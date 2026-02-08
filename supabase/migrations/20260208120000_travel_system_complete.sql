-- =============================================
-- MIGRATION: Système Complet de Gestion Voyage
-- Date: 2026-02-08 12:00:00
-- Description: Enrichissement pour dashboards client/admin
-- =============================================

-- 1. TYPES ENUM additionnels
-- =============================================

CREATE TYPE public.travel_project_type AS ENUM (
    'studies',
    'work',
    'tourism',
    'family_reunion'
);

CREATE TYPE public.travel_current_situation AS ENUM (
    'student',
    'employee',
    'unemployed',
    'entrepreneur'
);

CREATE TYPE public.message_sender_type AS ENUM (
    'client',
    'admin'
);

CREATE TYPE public.notification_type AS ENUM (
    'document_missing',
    'payment_due',
    'status_update',
    'message_received',
    'deadline_approaching'
);

-- 2. ENRICHISSEMENT TABLE travel_requests
-- =============================================

-- Ajout colonnes pour projets personnalisés (non Decreto Flussi)
ALTER TABLE public.travel_requests
ADD COLUMN IF NOT EXISTS project_type public.travel_project_type,
ADD COLUMN IF NOT EXISTS destination_country TEXT,
ADD COLUMN IF NOT EXISTS passport_number TEXT,
ADD COLUMN IF NOT EXISTS passport_issue_date DATE,
ADD COLUMN IF NOT EXISTS passport_expiry_date DATE,
ADD COLUMN IF NOT EXISTS current_situation public.travel_current_situation,
ADD COLUMN IF NOT EXISTS service_fees DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES auth.users(id);

-- Commentaires
COMMENT ON COLUMN public.travel_requests.project_type IS 'Type de projet voyage (études, travail, tourisme, famille)';
COMMENT ON COLUMN public.travel_requests.destination_country IS 'Pays de destination';
COMMENT ON COLUMN public.travel_requests.service_fees IS 'Frais de service FCFA';
COMMENT ON COLUMN public.travel_requests.is_verified IS 'Dossier vérifié par admin';

-- 3. TABLE MESSAGERIE CLIENT-ADMIN
-- =============================================

CREATE TABLE IF NOT EXISTS public.travel_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.travel_requests(id) ON DELETE CASCADE,
    sender_type public.message_sender_type NOT NULL,
    sender_id UUID REFERENCES auth.users(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX idx_travel_messages_request_id ON public.travel_messages(request_id);
CREATE INDEX idx_travel_messages_created_at ON public.travel_messages(created_at DESC);
CREATE INDEX idx_travel_messages_unread ON public.travel_messages(is_read) WHERE is_read = FALSE;

COMMENT ON TABLE public.travel_messages IS 'Messagerie entre client et admin pour chaque dossier';

-- 4. TABLE NOTIFICATIONS
-- =============================================

CREATE TABLE IF NOT EXISTS public.travel_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    request_id UUID REFERENCES public.travel_requests(id) ON DELETE CASCADE,
    type public.notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_travel_notifications_user_id ON public.travel_notifications(user_id);
CREATE INDEX idx_travel_notifications_unread ON public.travel_notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_travel_notifications_created_at ON public.travel_notifications(created_at DESC);

COMMENT ON TABLE public.travel_notifications IS 'Système de notifications pour les utilisateurs';

-- 5. TABLE VALIDATION CHECKLIST
-- =============================================

CREATE TABLE IF NOT EXISTS public.travel_validation_checklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.travel_requests(id) ON DELETE CASCADE,
    passport_valid BOOLEAN DEFAULT FALSE,
    photo_conform BOOLEAN DEFAULT FALSE,
    payment_received BOOLEAN DEFAULT FALSE,
    documents_complete BOOLEAN DEFAULT FALSE,
    bank_statements_ok BOOLEAN DEFAULT FALSE,
    additional_notes TEXT,
    validated_by UUID REFERENCES auth.users(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Un seul checklist par demande
CREATE UNIQUE INDEX idx_unique_checklist_per_request ON public.travel_validation_checklist(request_id);

COMMENT ON TABLE public.travel_validation_checklist IS 'Checklist de validation pour chaque dossier';

-- 6. FONCTION: Marquer message comme lu
-- =============================================

CREATE OR REPLACE FUNCTION public.mark_message_as_read(message_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.travel_messages
    SET is_read = TRUE,
        read_at = NOW()
    WHERE id = message_uuid;
END;
$$;

-- 7. FONCTION: Marquer notification comme lue
-- =============================================

CREATE OR REPLACE FUNCTION public.mark_notification_as_read(notification_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.travel_notifications
    SET is_read = TRUE,
        read_at = NOW()
    WHERE id = notification_uuid;
END;
$$;

-- 8. FONCTION: Créer notification automatique
-- =============================================

CREATE OR REPLACE FUNCTION public.create_travel_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    notification_title TEXT;
    notification_message TEXT;
    target_user_id UUID;
BEGIN
    -- Détecter le changement de statut
    IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
        target_user_id := NEW.user_id;
        notification_title := 'Changement de statut';
        notification_message := format('Votre dossier %s a changé de statut: %s', NEW.request_number, NEW.status);
        
        INSERT INTO public.travel_notifications (
            user_id,
            request_id,
            type,
            title,
            message,
            action_url
        ) VALUES (
            target_user_id,
            NEW.id,
            'status_update',
            notification_title,
            notification_message,
            '/dashboard/client/request/' || NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Trigger pour notifications automatiques
DROP TRIGGER IF EXISTS trigger_travel_status_notification ON public.travel_requests;
CREATE TRIGGER trigger_travel_status_notification
    AFTER UPDATE ON public.travel_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.create_travel_notification();

-- 9. FONCTION: Créer checklist automatiquement
-- =============================================

CREATE OR REPLACE FUNCTION public.create_validation_checklist()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Créer checklist pour nouvelle demande
    INSERT INTO public.travel_validation_checklist (request_id)
    VALUES (NEW.id)
    ON CONFLICT (request_id) DO NOTHING;
    
    RETURN NEW;
END;
$$;

-- Trigger pour création automatique checklist
DROP TRIGGER IF EXISTS trigger_create_checklist ON public.travel_requests;
CREATE TRIGGER trigger_create_checklist
    AFTER INSERT ON public.travel_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.create_validation_checklist();

-- 10. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Messages: Client voit ses messages, Admin voit tout
CREATE POLICY "users_own_messages"
ON public.travel_messages FOR SELECT
USING (
    sender_id = auth.uid() OR
    request_id IN (SELECT id FROM public.travel_requests WHERE user_id = auth.uid())
);

-- Insertion: Client et Admin peuvent envoyer
CREATE POLICY "users_send_messages"
ON public.travel_messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Notifications: User voit uniquement ses notifications
CREATE POLICY "users_own_notifications"
ON public.travel_notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "users_update_own_notifications"
ON public.travel_notifications FOR UPDATE
USING (user_id = auth.uid());

-- Checklist: Admins peuvent tout modifier, clients peuvent voir
CREATE POLICY "view_own_checklist"
ON public.travel_validation_checklist FOR SELECT
USING (
    request_id IN (SELECT id FROM public.travel_requests WHERE user_id = auth.uid())
);

-- Enable RLS
ALTER TABLE public.travel_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_validation_checklist ENABLE ROW LEVEL SECURITY;

-- 11. CONFIGURATION STORAGE (Instructions)
-- =============================================

-- NOTE: À exécuter dans l'interface Supabase Storage:
-- 
-- 1. Créer bucket 'travel-documents' (private)
-- 2. Créer bucket 'invoices' (private)
-- 3. Créer bucket 'receipts' (private)
--
-- Policies Storage à ajouter:
-- 
-- travel-documents:
--   - Upload: auth.uid() = user_id du request
--   - Download: auth.uid() = user_id OR admin role
--
-- invoices:
--   - Upload: admin only
--   - Download: auth.uid() = user_id du request
--
-- receipts:
--   - Upload: auth.uid() = user_id
--   - Download: auth.uid() = user_id OR admin

-- 12. VUES UTILES
-- =============================================

-- Vue: Dossiers avec statut messagerie
CREATE OR REPLACE VIEW public.travel_requests_with_messages_count AS
SELECT 
    tr.*,
    COUNT(DISTINCT tm.id) as total_messages,
    COUNT(DISTINCT tm.id) FILTER (WHERE tm.is_read = FALSE AND tm.sender_type = 'client') as unread_client_messages,
    COUNT(DISTINCT tm.id) FILTER (WHERE tm.is_read = FALSE AND tm.sender_type = 'admin') as unread_admin_messages
FROM public.travel_requests tr
LEFT JOIN public.travel_messages tm ON tr.id = tm.request_id
GROUP BY tr.id;

-- Vue: Statistiques admin
CREATE OR REPLACE VIEW public.admin_travel_statistics AS
SELECT 
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE status = 'registration') as pending_registration,
    COUNT(*) FILTER (WHERE status = 'completed') as completed,
    COUNT(*) FILTER (WHERE is_verified = TRUE) as verified_requests,
    SUM(total_amount) as total_revenue,
    SUM(amount_paid) as revenue_received,
    SUM(balance_due) as pending_payments
FROM public.travel_requests;

COMMENT ON VIEW public.admin_travel_statistics IS 'Statistiques globales pour dashboard admin';

-- 13. DONNÉES INITIALES
-- =============================================

-- Tarifs services par type de projet
INSERT INTO public.travel_requests (
    request_number,
    program_type,
    project_type,
    full_name,
    phone,
    email,
    service_fees,
    total_amount,
    status
) VALUES 
    ('TRAVEL-SAMPLE-0000', 'general', 'studies', 'Sample User', '+2250000000000', 'sample@example.com', 50000, 50000, 'registration')
ON CONFLICT DO NOTHING;

-- Supprimer l'exemple après vérification
DELETE FROM public.travel_requests WHERE request_number = 'TRAVEL-SAMPLE-0000';

-- FIN MIGRATION
COMMENT ON SCHEMA public IS 'Migration système complet voyage - Version 2.0';
