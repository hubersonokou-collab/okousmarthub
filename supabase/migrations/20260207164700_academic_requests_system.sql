-- =============================================
-- SYSTÈME DE GESTION DES DEMANDES DE RÉDACTION ACADÉMIQUE
-- Migration créée le: 2026-02-07
-- =============================================

-- =============================================
-- PHASE 1: TYPES ENUM
-- =============================================

-- Niveau académique
CREATE TYPE public.academic_level AS ENUM ('BT', 'BTS', 'LICENCE');

-- Type de document
CREATE TYPE public.document_type AS ENUM (
    'RAPPORT_BT',
    'RAPPORT_BTS_AVEC_STAGE',
    'RAPPORT_BTS_SANS_STAGE',
    'MEMOIRE_LICENCE'
);

-- Statut de la demande académique
CREATE TYPE public.academic_request_status AS ENUM (
    'pending',
    'info_received',
    'plan_validated',
    'in_writing',
    'in_review',
    'ready_for_print',
    'completed',
    'cancelled'
);

-- Type de paiement
CREATE TYPE public.payment_type AS ENUM ('advance', 'balance');

-- Statut de paiement académique
CREATE TYPE public.academic_payment_status AS ENUM ('pending', 'completed', 'failed');

-- =============================================
-- PHASE 2: TABLES PRINCIPALES
-- =============================================

-- Table des demandes de rédaction académique
CREATE TABLE public.academic_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    institution TEXT NOT NULL,
    field_of_study TEXT NOT NULL,
    academic_level academic_level NOT NULL,
    document_type document_type NOT NULL,
    has_internship BOOLEAN DEFAULT false,
    status academic_request_status DEFAULT 'pending' NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    advance_paid DECIMAL(10,2) DEFAULT 0,
    balance_due DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des paiements académiques
CREATE TABLE public.academic_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.academic_requests(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_type payment_type NOT NULL,
    status academic_payment_status DEFAULT 'pending' NOT NULL,
    paystack_reference TEXT,
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table de l'historique des changements de statut
CREATE TABLE public.academic_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.academic_requests(id) ON DELETE CASCADE NOT NULL,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table de la tarification académique (configuration)
CREATE TABLE public.academic_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type TEXT UNIQUE NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    advance_amount DECIMAL(10,2) NOT NULL,
    included_copies INTEGER DEFAULT 0,
    includes_mentoring BOOLEAN DEFAULT false,
    description TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- =============================================
-- PHASE 3: FONCTIONS
-- =============================================

-- Fonction pour générer un numéro de demande unique
CREATE OR REPLACE FUNCTION public.generate_request_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    new_number TEXT;
    current_date TEXT;
    sequence_num INTEGER;
BEGIN
    -- Format de date YYYYMMDD
    current_date := TO_CHAR(NOW(), 'YYYYMMDD');
    
    -- Trouver le prochain numéro de séquence pour aujourd'hui
    SELECT COALESCE(MAX(
        CAST(
            SUBSTRING(request_number FROM 'REF-[0-9]{8}-([0-9]{4})')
            AS INTEGER
        )
    ), 0) + 1
    INTO sequence_num
    FROM public.academic_requests
    WHERE request_number LIKE 'REF-' || current_date || '-%';
    
    -- Générer le numéro avec padding
    new_number := 'REF-' || current_date || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$;

-- =============================================
-- PHASE 4: TRIGGERS
-- =============================================

-- Trigger pour updated_at sur academic_requests
CREATE TRIGGER update_academic_requests_updated_at
BEFORE UPDATE ON public.academic_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour générer automatiquement le numéro de demande
CREATE OR REPLACE FUNCTION public.set_request_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.request_number IS NULL OR NEW.request_number = '' THEN
        NEW.request_number := public.generate_request_number();
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_request_number_trigger
BEFORE INSERT ON public.academic_requests
FOR EACH ROW EXECUTE FUNCTION public.set_request_number();

-- Trigger pour créer un historique lors du changement de statut
CREATE OR REPLACE FUNCTION public.track_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.academic_status_history (
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

CREATE TRIGGER track_academic_status_change
AFTER UPDATE ON public.academic_requests
FOR EACH ROW EXECUTE FUNCTION public.track_status_change();

-- =============================================
-- PHASE 5: ACTIVATION RLS
-- =============================================

ALTER TABLE public.academic_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_pricing ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PHASE 6: POLITIQUES RLS - ACADEMIC_REQUESTS
-- =============================================

-- Les utilisateurs peuvent voir leurs propres demandes
CREATE POLICY "Users can view their own academic requests"
ON public.academic_requests FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs demandes
CREATE POLICY "Users can create academic requests"
ON public.academic_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all academic requests"
ON public.academic_requests FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Les admins peuvent tout modifier
CREATE POLICY "Admins can update academic requests"
ON public.academic_requests FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Politique pour les utilisateurs non authentifiés (tracker public)
CREATE POLICY "Anyone can view request by number"
ON public.academic_requests FOR SELECT
TO anon
USING (true);

-- =============================================
-- PHASE 7: POLITIQUES RLS - ACADEMIC_PAYMENTS
-- =============================================

-- Les utilisateurs peuvent voir leurs propres paiements
CREATE POLICY "Users can view their own academic payments"
ON public.academic_payments FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.academic_requests
        WHERE academic_requests.id = academic_payments.request_id
        AND academic_requests.user_id = auth.uid()
    )
);

-- Les utilisateurs peuvent créer des paiements pour leurs demandes
CREATE POLICY "Users can create their own academic payments"
ON public.academic_payments FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.academic_requests
        WHERE academic_requests.id = academic_payments.request_id
        AND academic_requests.user_id = auth.uid()
    )
);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all academic payments"
ON public.academic_payments FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Les admins peuvent tout gérer
CREATE POLICY "Admins can manage academic payments"
ON public.academic_payments FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 8: POLITIQUES RLS - ACADEMIC_STATUS_HISTORY
-- =============================================

-- Les utilisateurs peuvent voir l'historique de leurs demandes
CREATE POLICY "Users can view their own status history"
ON public.academic_status_history FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.academic_requests
        WHERE academic_requests.id = academic_status_history.request_id
        AND academic_requests.user_id = auth.uid()
    )
);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all status history"
ON public.academic_status_history FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 9: POLITIQUES RLS - ACADEMIC_PRICING
-- =============================================

-- Tout le monde peut voir la tarification active
CREATE POLICY "Anyone can view active academic pricing"
ON public.academic_pricing FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Les admins peuvent gérer la tarification
CREATE POLICY "Admins can manage academic pricing"
ON public.academic_pricing FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 10: DONNÉES INITIALES - TARIFICATION
-- =============================================

INSERT INTO public.academic_pricing (document_type, base_price, advance_amount, included_copies, includes_mentoring, description, is_active) VALUES
(
    'RAPPORT_BT',
    35000,
    25000,
    4,
    false,
    'Rédaction complète du rapport de stage BT + 4 exemplaires imprimés',
    true
),
(
    'RAPPORT_BTS_AVEC_STAGE',
    35000,
    25000,
    4,
    false,
    'Rédaction complète du rapport de stage BTS (avec stage effectué) + 4 exemplaires imprimés',
    true
),
(
    'RAPPORT_BTS_SANS_STAGE',
    70000,
    50000,
    3,
    true,
    'Rédaction complète du rapport + 3 exemplaires + mentorat entreprise (recherche de stage, suivi, notes, attestation et confirmation de stage)',
    true
),
(
    'MEMOIRE_LICENCE',
    100000,
    60000,
    0,
    false,
    'Rédaction complète du mémoire de Licence Professionnelle',
    true
);

-- =============================================
-- PHASE 11: INDEX POUR PERFORMANCE
-- =============================================

CREATE INDEX idx_academic_requests_user_id ON public.academic_requests(user_id);
CREATE INDEX idx_academic_requests_status ON public.academic_requests(status);
CREATE INDEX idx_academic_requests_request_number ON public.academic_requests(request_number);
CREATE INDEX idx_academic_requests_created_at ON public.academic_requests(created_at DESC);
CREATE INDEX idx_academic_payments_request_id ON public.academic_payments(request_id);
CREATE INDEX idx_academic_status_history_request_id ON public.academic_status_history(request_id);

-- =============================================
-- FIN DE LA MIGRATION
-- =============================================
