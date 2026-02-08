-- =============================================
-- MIGRATION COMPLÈTE: Système Voyage Unifié
-- Date: 2026-02-08 13:30:00
-- Description: Migration complète et idempotente
--              - Système de base + Enrichissements
--              - Decreto Flussi intégré
--              - Messagerie, Notifications, Validation
-- =============================================

-- =============================================
-- PARTIE 1: NETTOYAGE (Safe - ne plante pas si n'existe pas)
-- =============================================

-- Supprimer les triggers
DROP TRIGGER IF EXISTS trigger_travel_status_notification ON public.travel_requests;
DROP TRIGGER IF EXISTS trigger_create_checklist ON public.travel_requests;
DROP TRIGGER IF EXISTS trigger_travel_status_history ON public.travel_requests;
DROP TRIGGER IF EXISTS trigger_travel_request_number ON public.travel_requests;
DROP TRIGGER IF EXISTS update_travel_requests_updated_at ON public.travel_requests;

-- Supprimer les vues
DROP VIEW IF EXISTS public.travel_requests_with_messages_count CASCADE;
DROP VIEW IF EXISTS public.admin_travel_statistics CASCADE;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS public.mark_message_as_read(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.mark_notification_as_read(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.create_travel_notification() CASCADE;
DROP FUNCTION IF EXISTS public.create_validation_checklist() CASCADE;
DROP FUNCTION IF EXISTS public.track_travel_status_change() CASCADE;
DROP FUNCTION IF EXISTS public.generate_travel_request_number() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;

-- Supprimer les tables (en ordre de dépendance)
DROP TABLE IF EXISTS public.travel_validation_checklist CASCADE;
DROP TABLE IF EXISTS public.travel_notifications CASCADE;
DROP TABLE IF EXISTS public.travel_messages CASCADE;
DROP TABLE IF EXISTS public.travel_payments CASCADE;
DROP TABLE IF EXISTS public.travel_documents CASCADE;
DROP TABLE IF EXISTS public.travel_status_history CASCADE;
DROP TABLE IF EXISTS public.travel_requests CASCADE;

-- Supprimer les types ENUM
DROP TYPE IF EXISTS public.notification_type CASCADE;
DROP TYPE IF EXISTS public.message_sender_type CASCADE;
DROP TYPE IF EXISTS public.travel_current_situation CASCADE;
DROP TYPE IF EXISTS public.travel_project_type CASCADE;
DROP TYPE IF EXISTS public.travel_document_type CASCADE;
DROP TYPE IF EXISTS public.travel_payment_stage CASCADE;
DROP TYPE IF EXISTS public.travel_request_status CASCADE;
DROP TYPE IF EXISTS public.travel_program_type CASCADE;

-- =============================================
-- PARTIE 2: TYPES ENUM
-- =============================================

CREATE TYPE public.travel_program_type AS ENUM (
    'general',           -- Voyage général (études, travail, tourisme, famille)
    'decreto_flussi'     -- Programme spécifique Decreto Flussi
);

CREATE TYPE public.travel_request_status AS ENUM (
    'registration',           -- Inscription initiale
    'payment_pending',        -- En attente de paiement
    'documents_pending',      -- Documents à fournir
    'documents_received',     -- Documents reçus
    'document_verification',  -- Vérification documents
    'processing',             -- Traitement en cours
    'appointment_scheduled',  -- Rendez-vous fixé
    'waiting_result',         -- En attente résultat
    'completed',              -- Complété
    'rejected',               -- Rejeté
    'cancelled'               -- Annulé
);

CREATE TYPE public.travel_payment_stage AS ENUM (
    'inscription',     -- Frais d'inscription
    'dossier',         -- Constitution dossier
    'visa',            -- Frais visa
    'billet',          -- Billet d'avion
    'autres'           -- Autres frais
);

CREATE TYPE public.travel_document_type AS ENUM (
    'passport',
    'photo',
    'diploma',
    'transcript',
    'work_certificate',
    'bank_statement',
    'birth_certificate',
    'marriage_certificate',
    'invitation_letter',
    'cv',
    'motivation_letter',
    'other'
);

CREATE TYPE public.travel_project_type AS ENUM (
    'studies',           -- Études
    'work',              -- Travail
    'tourism',           -- Tourisme
    'family_reunion'     -- Regroupement familial
);

CREATE TYPE public.travel_current_situation AS ENUM (
    'student',           -- Étudiant
    'employee',          -- Salarié
    'unemployed',        -- Sans emploi
    'entrepreneur'       -- Entrepreneur
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

-- =============================================
-- PARTIE 3: TABLE PRINCIPALE - travel_requests
-- =============================================

CREATE TABLE public.travel_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Type de programme
    program_type public.travel_program_type NOT NULL DEFAULT 'general',
    
    -- Pour programme général (études, travail, tourisme, famille)
    project_type public.travel_project_type,
    destination_country TEXT,
    current_situation public.travel_current_situation,
    
    -- Pour Decreto Flussi
    decreto_job_category TEXT,
    decreto_employer_info JSONB,
    decreto_quota_year INTEGER,
    
    -- Informations personnelles
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    date_of_birth DATE,
    nationality TEXT,
    
    -- Passeport
    passport_number TEXT,
    passport_issue_date DATE,
    passport_expiry_date DATE,
    
    -- Occupation
    current_occupation TEXT,
    
    -- Statut
    status public.travel_request_status NOT NULL DEFAULT 'registration',
    
    -- Finances
    service_fees DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) DEFAULT 0,
    amount_paid DECIMAL(12,2) DEFAULT 0,
    balance_due DECIMAL(12,2) DEFAULT 0,
    
    -- Vérification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id),
    
    -- Notes internes
    internal_notes TEXT,
    
    -- Dates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX idx_travel_requests_user_id ON public.travel_requests(user_id);
CREATE INDEX idx_travel_requests_status ON public.travel_requests(status);
CREATE INDEX idx_travel_requests_program_type ON public.travel_requests(program_type);
CREATE INDEX idx_travel_requests_created_at ON public.travel_requests(created_at DESC);

COMMENT ON TABLE public.travel_requests IS 'Demandes de voyage (général + Decreto Flussi)';

-- =============================================
-- PARTIE 4: DOCUMENTS
-- =============================================

CREATE TABLE public.travel_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.travel_requests(id) ON DELETE CASCADE,
    document_type public.travel_document_type NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_travel_documents_request_id ON public.travel_documents(request_id);

COMMENT ON TABLE public.travel_documents IS 'Documents téléversés pour chaque demande';

-- =============================================
-- PARTIE 5: PAIEMENTS
-- =============================================

CREATE TABLE public.travel_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.travel_requests(id) ON DELETE CASCADE,
    payment_stage public.travel_payment_stage NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_method TEXT,
    payment_reference TEXT,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_travel_payments_request_id ON public.travel_payments(request_id);
CREATE INDEX idx_travel_payments_date ON public.travel_payments(payment_date DESC);

COMMENT ON TABLE public.travel_payments IS 'Historique des paiements par étape';

-- =============================================
-- PARTIE 6: HISTORIQUE STATUTS
-- =============================================

CREATE TABLE public.travel_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.travel_requests(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_travel_status_history_request_id ON public.travel_status_history(request_id);
CREATE INDEX idx_travel_status_history_created_at ON public.travel_status_history(created_at DESC);

COMMENT ON TABLE public.travel_status_history IS 'Historique des changements de statut';

-- =============================================
-- PARTIE 7: MESSAGERIE CLIENT-ADMIN
-- =============================================

CREATE TABLE public.travel_messages (
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

CREATE INDEX idx_travel_messages_request_id ON public.travel_messages(request_id);
CREATE INDEX idx_travel_messages_created_at ON public.travel_messages(created_at DESC);
CREATE INDEX idx_travel_messages_unread ON public.travel_messages(is_read) WHERE is_read = FALSE;

COMMENT ON TABLE public.travel_messages IS 'Messagerie entre client et admin';

-- =============================================
-- PARTIE 8: NOTIFICATIONS
-- =============================================

CREATE TABLE public.travel_notifications (
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

CREATE INDEX idx_travel_notifications_user_id ON public.travel_notifications(user_id);
CREATE INDEX idx_travel_notifications_unread ON public.travel_notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_travel_notifications_created_at ON public.travel_notifications(created_at DESC);

COMMENT ON TABLE public.travel_notifications IS 'Notifications utilisateurs';

-- =============================================
-- PARTIE 9: CHECKLIST VALIDATION
-- =============================================

CREATE TABLE public.travel_validation_checklist (
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

CREATE UNIQUE INDEX idx_unique_checklist_per_request ON public.travel_validation_checklist(request_id);

COMMENT ON TABLE public.travel_validation_checklist IS 'Checklist de validation admin';

-- =============================================
-- PARTIE 10: FONCTIONS
-- =============================================

-- Fonction: Générer numéro de demande
CREATE OR REPLACE FUNCTION public.generate_travel_request_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    new_number TEXT;
    current_date TEXT;
    sequence_num INTEGER;
BEGIN
    current_date := TO_CHAR(NOW(), 'YYYYMMDD');
    
    SELECT COALESCE(MAX(
        CAST(
            SUBSTRING(request_number FROM 'TRAVEL-[0-9]{8}-([0-9]{4})')
            AS INTEGER
        )
    ), 0) + 1
    INTO sequence_num
    FROM public.travel_requests
    WHERE request_number LIKE 'TRAVEL-' || current_date || '-%';
    
    new_number := 'TRAVEL-' || current_date || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$;

-- Fonction: Update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fonction: Tracker les changements de statut
CREATE OR REPLACE FUNCTION public.track_travel_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.travel_status_history (
            request_id,
            old_status,
            new_status,
            changed_by
        ) VALUES (
            NEW.id,
            OLD.status::TEXT,
            NEW.status::TEXT,
            auth.uid()
        );
    END IF;
    RETURN NEW;
END;
$$;

-- Fonction: Marquer message comme lu
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

-- Fonction: Marquer notification comme lue
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

-- Fonction: Créer notification automatique
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

-- Fonction: Créer checklist automatiquement
CREATE OR REPLACE FUNCTION public.create_validation_checklist()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.travel_validation_checklist (request_id)
    VALUES (NEW.id)
    ON CONFLICT (request_id) DO NOTHING;
    
    RETURN NEW;
END;
$$;

-- =============================================
-- PARTIE 11: TRIGGERS
-- =============================================

-- Trigger: Générer numéro de demande
CREATE TRIGGER trigger_travel_request_number
    BEFORE INSERT ON public.travel_requests
    FOR EACH ROW
    EXECUTE FUNCTION (
        SELECT CASE 
            WHEN NEW.request_number IS NULL OR NEW.request_number = '' 
            THEN public.generate_travel_request_number()
            ELSE NEW.request_number
        END
    );

-- Note: En PostgreSQL, on ne peut pas appeler une fonction dans EXECUTE FUNCTION directement
-- Voici la version correcte:
DROP TRIGGER IF EXISTS trigger_travel_request_number ON public.travel_requests;

CREATE OR REPLACE FUNCTION public.set_request_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.request_number IS NULL OR NEW.request_number = '' THEN
        NEW.request_number := public.generate_travel_request_number();
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_travel_request_number
    BEFORE INSERT ON public.travel_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.set_request_number();

-- Trigger: Update timestamp
CREATE TRIGGER update_travel_requests_updated_at
    BEFORE UPDATE ON public.travel_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- Trigger: Historique statuts
CREATE TRIGGER trigger_travel_status_history
    AFTER UPDATE ON public.travel_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.track_travel_status_change();

-- Trigger: Notifications automatiques
CREATE TRIGGER trigger_travel_status_notification
    AFTER UPDATE ON public.travel_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.create_travel_notification();

-- Trigger: Création checklist
CREATE TRIGGER trigger_create_checklist
    AFTER INSERT ON public.travel_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.create_validation_checklist();

-- =============================================
-- PARTIE 12: RLS POLICIES
-- =============================================

-- travel_requests
ALTER TABLE public.travel_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_requests"
ON public.travel_requests FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "users_insert_requests"
ON public.travel_requests FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_update_own_requests"
ON public.travel_requests FOR UPDATE
USING (user_id = auth.uid());

-- travel_messages
ALTER TABLE public.travel_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_messages"
ON public.travel_messages FOR SELECT
USING (
    sender_id = auth.uid() OR
    request_id IN (SELECT id FROM public.travel_requests WHERE user_id = auth.uid())
);

CREATE POLICY "users_send_messages"
ON public.travel_messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- travel_notifications
ALTER TABLE public.travel_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_notifications"
ON public.travel_notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "users_update_own_notifications"
ON public.travel_notifications FOR UPDATE
USING (user_id = auth.uid());

-- travel_validation_checklist
ALTER TABLE public.travel_validation_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view_own_checklist"
ON public.travel_validation_checklist FOR SELECT
USING (
    request_id IN (SELECT id FROM public.travel_requests WHERE user_id = auth.uid())
);

-- travel_documents
ALTER TABLE public.travel_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_documents"
ON public.travel_documents FOR SELECT
USING (
    request_id IN (SELECT id FROM public.travel_requests WHERE user_id = auth.uid())
);

CREATE POLICY "users_upload_documents"
ON public.travel_documents FOR INSERT
WITH CHECK (
    request_id IN (SELECT id FROM public.travel_requests WHERE user_id = auth.uid())
);

-- travel_payments
ALTER TABLE public.travel_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_payments"
ON public.travel_payments FOR SELECT
USING (
    request_id IN (SELECT id FROM public.travel_requests WHERE user_id = auth.uid())
);

-- travel_status_history
ALTER TABLE public.travel_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_view_own_history"
ON public.travel_status_history FOR SELECT
USING (
    request_id IN (SELECT id FROM public.travel_requests WHERE user_id = auth.uid())
);

-- =============================================
-- PARTIE 13: VUES UTILES
-- =============================================

CREATE OR REPLACE VIEW public.travel_requests_with_messages_count AS
SELECT 
    tr.*,
    COUNT(DISTINCT tm.id) as total_messages,
    COUNT(DISTINCT tm.id) FILTER (WHERE tm.is_read = FALSE AND tm.sender_type = 'client') as unread_client_messages,
    COUNT(DISTINCT tm.id) FILTER (WHERE tm.is_read = FALSE AND tm.sender_type = 'admin') as unread_admin_messages
FROM public.travel_requests tr
LEFT JOIN public.travel_messages tm ON tr.id = tm.request_id
GROUP BY tr.id;

CREATE OR REPLACE VIEW public.admin_travel_statistics AS
SELECT 
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE status = 'registration') as pending_registration,
    COUNT(*) FILTER (WHERE status = 'completed') as completed,
    COUNT(*) FILTER (WHERE is_verified = TRUE) as verified_requests,
    COUNT(*) FILTER (WHERE program_type = 'decreto_flussi') as decreto_requests,
    COUNT(*) FILTER (WHERE program_type = 'general') as general_requests,
    SUM(total_amount) as total_revenue,
    SUM(amount_paid) as revenue_received,
    SUM(balance_due) as pending_payments
FROM public.travel_requests;

COMMENT ON VIEW public.admin_travel_statistics IS 'Statistiques globales pour dashboard admin';

-- =============================================
-- FIN DE LA MIGRATION
-- =============================================

COMMENT ON SCHEMA public IS 'Système complet voyage - Base + Decreto Flussi - Version 3.0';
