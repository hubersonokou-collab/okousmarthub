-- =============================================
-- MIGRATION: Système d'Évaluation VOYAGE
-- Date: 2026-02-08
-- Description: Ajout du système d'évaluation avec paiement échelonné
-- =============================================

-- =============================================
-- PARTIE 1: MODIFICATION TABLE travel_requests
-- =============================================

-- Ajouter colonnes pour le système d'évaluation
ALTER TABLE public.travel_requests
ADD COLUMN IF NOT EXISTS evaluation_status TEXT CHECK (evaluation_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS evaluation_notes TEXT,
ADD COLUMN IF NOT EXISTS evaluation_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS evaluated_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS payment_stage TEXT CHECK (payment_stage IN ('evaluation', 'tranche1', 'tranche2', 'completed')) DEFAULT 'evaluation';

-- Ajouter commentaires
COMMENT ON COLUMN public.travel_requests.evaluation_status IS 'Statut de l''évaluation: pending, approved, rejected';
COMMENT ON COLUMN public.travel_requests.evaluation_notes IS 'Notes de l''admin lors de l''évaluation';
COMMENT ON COLUMN public.travel_requests.evaluation_date IS 'Date du résultat de l''évaluation';
COMMENT ON COLUMN public.travel_requests.evaluated_by IS 'ID de l''admin qui a évalué';
COMMENT ON COLUMN public.travel_requests.payment_stage IS 'Étape de paiement actuelle';

-- =============================================
-- PARTIE 2: MODIFICATION ENUM payment_step
-- =============================================

-- Créer nouveau type pour les étapes de paiement
DO $$ 
BEGIN
    -- Vérifier si le type existe déjà
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_type_new') THEN
        CREATE TYPE payment_type_new AS ENUM (
            'evaluation',      -- 10 000 FCFA
            'tranche1',        -- 1 000 000 FCFA
            'tranche2',        -- 1 500 000 FCFA
            'inscription',     -- Ancien système
            'dossier',         -- Ancien système
            'visa',            -- Ancien système
            'billet',          -- Ancien système
            'other'
        );
    END IF;
END $$;

-- Migrer vers le nouveau type si nécessaire
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'travel_payments' 
        AND column_name = 'payment_step'
        AND data_type != 'payment_type_new'
    ) THEN
        -- Ajouter temporairement une nouvelle colonne
        ALTER TABLE public.travel_payments 
        ADD COLUMN IF NOT EXISTS payment_type_temp payment_type_new;
        
        -- Migrer les données
        UPDATE public.travel_payments 
        SET payment_type_temp = payment_step::text::payment_type_new
        WHERE payment_type_temp IS NULL;
        
        -- Supprimer l'ancienne colonne
        ALTER TABLE public.travel_payments DROP COLUMN IF EXISTS payment_step;
        
        -- Renommer la nouvelle colonne
        ALTER TABLE public.travel_payments 
        RENAME COLUMN payment_type_temp TO payment_step;
    END IF;
END $$;

-- =============================================
-- PARTIE 3: FONCTION NOTIFICATION ÉVALUATION
-- =============================================

-- Fonction pour créer notification après évaluation
CREATE OR REPLACE FUNCTION public.notify_evaluation_result()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    notification_message TEXT;
BEGIN
    -- Seulement si le statut d'évaluation change
    IF OLD.evaluation_status IS DISTINCT FROM NEW.evaluation_status 
       AND NEW.evaluation_status IN ('approved', 'rejected') THEN
        
        -- Déterminer le message
        IF NEW.evaluation_status = 'approved' THEN
            notification_message := 'Votre dossier a été évalué positivement ! Vous pouvez procéder au paiement de la première tranche (1 000 000 FCFA).';
        ELSE
            notification_message := 'Votre dossier n''a pas été retenu après évaluation. ' || COALESCE(NEW.evaluation_notes, 'Contactez-nous pour plus d''informations.');
        END IF;
        
        -- Créer la notification
        INSERT INTO public.travel_notifications (
            request_id,
            user_id,
            type,
            title,
            message,
            created_at
        ) VALUES (
            NEW.id,
            NEW.user_id,
            'status',
            CASE 
                WHEN NEW.evaluation_status = 'approved' THEN '✅ Dossier Éligible'
                ELSE '❌ Dossier Non Éligible'
            END,
            notification_message,
            NOW()
        );
        
        -- Mettre à jour le payment_stage si approuvé
        IF NEW.evaluation_status = 'approved' THEN
            NEW.payment_stage := 'tranche1';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- =============================================
-- PARTIE 4: TRIGGER NOTIFICATION ÉVALUATION
-- =============================================

DROP TRIGGER IF EXISTS trigger_evaluation_notification ON public.travel_requests;

CREATE TRIGGER trigger_evaluation_notification
    BEFORE UPDATE ON public.travel_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_evaluation_result();

-- =============================================
-- PARTIE 5: VUE ADMIN - ÉVALUATIONS EN ATTENTE
-- =============================================

CREATE OR REPLACE VIEW public.admin_pending_evaluations AS
SELECT 
    tr.id,
    tr.request_number,
    tr.project_type,
    tr.destination,
    tr.user_id,
    tr.full_name,
    tr.email,
    tr.phone,
    tr.created_at,
    tr.evaluation_status,
    -- Vérifier si paiement évaluation effectué
    EXISTS (
        SELECT 1 FROM public.travel_payments tp
        WHERE tp.request_id = tr.id 
        AND tp.payment_step = 'evaluation'
        AND tp.payment_status = 'completed'
    ) as evaluation_paid,
    -- Montant payé pour évaluation
    COALESCE((
        SELECT SUM(amount)
        FROM public.travel_payments tp
        WHERE tp.request_id = tr.id 
        AND tp.payment_step = 'evaluation'
        AND tp.payment_status = 'completed'
    ), 0) as evaluation_amount_paid
FROM public.travel_requests tr
WHERE tr.evaluation_status = 'pending'
AND EXISTS (
    SELECT 1 FROM public.travel_payments tp
    WHERE tp.request_id = tr.id 
    AND tp.payment_step = 'evaluation'
    AND tp.payment_status = 'completed'
)
ORDER BY tr.created_at ASC;

-- Accès à la vue pour les admins
ALTER VIEW public.admin_pending_evaluations OWNER TO postgres;

-- =============================================
-- PARTIE 6: MISE À JOUR RLS POLICIES
-- =============================================

-- Policy pour voir les évaluations (admins)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'travel_requests' 
        AND policyname = 'Admins can view all evaluations'
    ) THEN
        CREATE POLICY "Admins can view all evaluations"
        ON public.travel_requests
        FOR SELECT
        TO authenticated
        USING (true);  -- Ajuster selon votre système de rôles
    END IF;
END $$;

-- =============================================
-- PARTIE 7: INDEX POUR PERFORMANCE
-- =============================================

-- Index sur evaluation_status pour requêtes rapides
CREATE INDEX IF NOT EXISTS idx_travel_requests_evaluation_status 
ON public.travel_requests(evaluation_status);

-- Index sur payment_stage
CREATE INDEX IF NOT EXISTS idx_travel_requests_payment_stage 
ON public.travel_requests(payment_stage);

-- Index composite pour les évaluations en attente
CREATE INDEX IF NOT EXISTS idx_travel_requests_pending_evaluation 
ON public.travel_requests(evaluation_status, created_at)
WHERE evaluation_status = 'pending';

-- =============================================
-- FIN DE LA MIGRATION
-- =============================================

-- Afficher un résumé
DO $$
BEGIN
    RAISE NOTICE '✅ Migration système d''évaluation terminée';
    RAISE NOTICE '📋 Colonnes ajoutées: evaluation_status, evaluation_notes, evaluation_date, evaluated_by, payment_stage';
    RAISE NOTICE '🔔 Trigger de notification créé';
    RAISE NOTICE '📊 Vue admin_pending_evaluations créée';
    RAISE NOTICE '🚀 Système prêt à l''emploi';
END $$;
