-- =============================================
-- SYSTÈME D'ASSISTANCE VOYAGE
-- Migration créée le: 2026-02-08
-- Programmes: Voyage général + Decreto Flussi
-- =============================================

-- =============================================
-- PHASE 1: TYPES ENUM
-- =============================================

-- Type de programme
CREATE TYPE public.travel_program_type AS ENUM ('general', 'decreto_flussi');

-- Type de document
CREATE TYPE public.travel_document_type AS ENUM (
    'passport',
    'photo',
    'birth_certificate',
    'work_certificate',
    'bank_statement',
    'motivation_letter',
    'other'
);

-- Statut de la demande (7 étapes Decreto Flussi)
CREATE TYPE public.travel_request_status AS ENUM (
    'registration',           -- Inscription candidat
    'document_review',        -- Étude et validation dossier
    'application_submitted',  -- Soumission Decreto Flussi
    'contract_obtained',      -- Obtention contrat travail
    'visa_application',       -- Dépôt demande visa
    'visa_obtained',          -- Obtention visa
    'completed',              -- Départ et intégration
    'rejected',
    'cancelled'
);

-- Tranche de paiement (Decreto Flussi)
CREATE TYPE public.travel_payment_stage AS ENUM ('stage_1', 'stage_2', 'stage_3');

-- Statut de paiement
CREATE TYPE public.travel_payment_status AS ENUM ('pending', 'completed', 'failed');

-- =============================================
-- PHASE 2: TABLES PRINCIPALES
-- =============================================

-- Table des demandes d'assistance voyage
CREATE TABLE public.travel_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    program_type travel_program_type NOT NULL,
    
    -- Informations candidat
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    date_of_birth DATE,
    nationality TEXT,
    current_occupation TEXT,
    
    -- Statut et suivi
    status travel_request_status DEFAULT 'registration' NOT NULL,
    
    -- Financier (Decreto Flussi)
    total_amount DECIMAL(10,2) DEFAULT 0,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    balance_due DECIMAL(10,2) DEFAULT 0,
    
    -- Notes admin
    notes TEXT,
    admin_comments TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des documents uploadés
CREATE TABLE public.travel_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.travel_requests(id) ON DELETE CASCADE NOT NULL,
    document_type travel_document_type NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,  -- Chemin dans Supabase Storage
    file_size BIGINT,
    mime_type TEXT,
    is_validated BOOLEAN DEFAULT false,
    validated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    validated_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des paiements (tranches)
CREATE TABLE public.travel_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.travel_requests(id) ON DELETE CASCADE NOT NULL,
    payment_stage travel_payment_stage NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status travel_payment_status DEFAULT 'pending' NOT NULL,
    paystack_reference TEXT,
    payment_method TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table de l'historique des changements de statut
CREATE TABLE public.travel_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.travel_requests(id) ON DELETE CASCADE NOT NULL,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- =============================================
-- PHASE 3: FONCTIONS
-- =============================================

-- Fonction pour générer un numéro de demande unique
CREATE OR REPLACE FUNCTION public.generate_travel_request_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    new_number TEXT;
    date_string TEXT;
    sequence_num INTEGER;
BEGIN
    -- Format de date YYYYMMDD
    date_string := TO_CHAR(NOW(), 'YYYYMMDD');
    
    -- Trouver le prochain numéro de séquence pour aujourd'hui
    SELECT COALESCE(MAX(
        CAST(
            SUBSTRING(request_number FROM 'TRAVEL-[0-9]{8}-([0-9]{4})')
            AS INTEGER
        )
    ), 0) + 1
    INTO sequence_num
    FROM public.travel_requests
    WHERE request_number LIKE 'TRAVEL-' || date_string || '-%';
    
    -- Générer le numéro avec padding
    new_number := 'TRAVEL-' || date_string || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$;

-- =============================================
-- PHASE 4: TRIGGERS
-- =============================================

-- Trigger pour updated_at sur travel_requests
CREATE TRIGGER update_travel_requests_updated_at
BEFORE UPDATE ON public.travel_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour générer automatiquement le numéro de demande
CREATE OR REPLACE FUNCTION public.set_travel_request_number()
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

CREATE TRIGGER set_travel_request_number_trigger
BEFORE INSERT ON public.travel_requests
FOR EACH ROW EXECUTE FUNCTION public.set_travel_request_number();

-- Trigger pour créer un historique lors du changement de statut
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

CREATE TRIGGER track_travel_status_change
AFTER UPDATE ON public.travel_requests
FOR EACH ROW EXECUTE FUNCTION public.track_travel_status_change();

-- =============================================
-- PHASE 5: ACTIVATION RLS
-- =============================================

ALTER TABLE public.travel_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_status_history ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PHASE 6: POLITIQUES RLS - TRAVEL_REQUESTS
-- =============================================

-- Les utilisateurs peuvent voir leurs propres demandes
CREATE POLICY "Users can view their own travel requests"
ON public.travel_requests FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs demandes
CREATE POLICY "Users can create travel requests"
ON public.travel_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all travel requests"
ON public.travel_requests FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Les admins peuvent tout modifier
CREATE POLICY "Admins can update travel requests"
ON public.travel_requests FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Politique pour les utilisateurs non authentifiés (tracker public)
CREATE POLICY "Anyone can view travel request by number"
ON public.travel_requests FOR SELECT
TO anon
USING (true);

-- =============================================
-- PHASE 7: POLITIQUES RLS - TRAVEL_DOCUMENTS
-- =============================================

-- Les utilisateurs peuvent voir leurs documents
CREATE POLICY "Users can view their own travel documents"
ON public.travel_documents FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.travel_requests
        WHERE travel_requests.id = travel_documents.request_id
        AND travel_requests.user_id = auth.uid()
    )
);

-- Les utilisateurs peuvent uploader des documents pour leurs demandes
CREATE POLICY "Users can upload documents for their requests"
ON public.travel_documents FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.travel_requests
        WHERE travel_requests.id = travel_documents.request_id
        AND travel_requests.user_id = auth.uid()
    )
);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all travel documents"
ON public.travel_documents FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Les admins peuvent valider/modifier
CREATE POLICY "Admins can manage travel documents"
ON public.travel_documents FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 8: POLITIQUES RLS - TRAVEL_PAYMENTS
-- =============================================

-- Les utilisateurs peuvent voir leurs paiements
CREATE POLICY "Users can view their own travel payments"
ON public.travel_payments FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.travel_requests
        WHERE travel_requests.id = travel_payments.request_id
        AND travel_requests.user_id = auth.uid()
    )
);

-- Les utilisateurs peuvent créer des paiements
CREATE POLICY "Users can create their own travel payments"
ON public.travel_payments FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.travel_requests
        WHERE travel_requests.id = travel_payments.request_id
        AND travel_requests.user_id = auth.uid()
    )
);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all travel payments"
ON public.travel_payments FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Les admins peuvent tout gérer
CREATE POLICY "Admins can manage travel payments"
ON public.travel_payments FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 9: POLITIQUES RLS - TRAVEL_STATUS_HISTORY
-- =============================================

-- Les utilisateurs peuvent voir leur historique
CREATE POLICY "Users can view their own travel status history"
ON public.travel_status_history FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.travel_requests
        WHERE travel_requests.id = travel_status_history.request_id
        AND travel_requests.user_id = auth.uid()
    )
);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all travel status history"
ON public.travel_status_history FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 10: INDEX POUR PERFORMANCE
-- =============================================

CREATE INDEX idx_travel_requests_user_id ON public.travel_requests(user_id);
CREATE INDEX idx_travel_requests_status ON public.travel_requests(status);
CREATE INDEX idx_travel_requests_program_type ON public.travel_requests(program_type);
CREATE INDEX idx_travel_requests_request_number ON public.travel_requests(request_number);
CREATE INDEX idx_travel_requests_created_at ON public.travel_requests(created_at DESC);
CREATE INDEX idx_travel_documents_request_id ON public.travel_documents(request_id);
CREATE INDEX idx_travel_documents_type ON public.travel_documents(document_type);
CREATE INDEX idx_travel_payments_request_id ON public.travel_payments(request_id);
CREATE INDEX idx_travel_payments_stage ON public.travel_payments(payment_stage);
CREATE INDEX idx_travel_status_history_request_id ON public.travel_status_history(request_id);

-- =============================================
-- PHASE 11: CONFIGURATION STORAGE (Commentaire)
-- =============================================

-- NOTE: Le bucket Storage pour les documents doit être créé manuellement:
-- 1. Aller dans Storage > Create bucket
-- 2. Nom: "travel-documents"
-- 3. Public: false
-- 4. Politiques RLS similaires aux tables

-- =============================================
-- FIN DE LA MIGRATION
-- =============================================
