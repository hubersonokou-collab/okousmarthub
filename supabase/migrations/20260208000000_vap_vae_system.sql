-- =============================================
-- SYSTÈME DE GESTION DES INSCRIPTIONS VAP/VAE
-- Migration créée le: 2026-02-08
-- =============================================

-- =============================================
-- PHASE 1: TYPES ENUM
-- =============================================

-- Niveau académique VAP/VAE
CREATE TYPE public.vap_vae_level AS ENUM ('DUT', 'LICENCE', 'MASTER');

-- Statut de la demande VAP/VAE
CREATE TYPE public.vap_vae_request_status AS ENUM (
    'pending',
    'processing',
    'document_review',
    'validation_pending',
    'completed',
    'rejected',
    'cancelled'
);

-- Type de paiement
CREATE TYPE public.vap_vae_payment_type AS ENUM ('advance', 'balance');

-- Statut de paiement
CREATE TYPE public.vap_vae_payment_status AS ENUM ('pending', 'completed', 'failed');

-- Type de suivi
CREATE TYPE public.vap_vae_support_type AS ENUM ('standard', 'priority', 'personalized');

-- =============================================
-- PHASE 2: TABLES PRINCIPALES
-- =============================================

-- Table des demandes d'inscription VAP/VAE
CREATE TABLE public.vap_vae_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    current_profession TEXT NOT NULL,
    years_of_experience INTEGER NOT NULL CHECK (years_of_experience >= 0),
    desired_field TEXT NOT NULL,
    level vap_vae_level NOT NULL,
    support_type vap_vae_support_type DEFAULT 'standard' NOT NULL,
    status vap_vae_request_status DEFAULT 'pending' NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    advance_paid DECIMAL(10,2) DEFAULT 0,
    balance_due DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des paiements VAP/VAE
CREATE TABLE public.vap_vae_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.vap_vae_requests(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_type vap_vae_payment_type NOT NULL,
    status vap_vae_payment_status DEFAULT 'pending' NOT NULL,
    paystack_reference TEXT,
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table de l'historique des changements de statut
CREATE TABLE public.vap_vae_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.vap_vae_requests(id) ON DELETE CASCADE NOT NULL,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table de la tarification VAP/VAE (configuration)
CREATE TABLE public.vap_vae_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT UNIQUE NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    advance_amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- =============================================
-- PHASE 3: FONCTIONS
-- =============================================

-- Fonction pour générer un numéro de demande unique
CREATE OR REPLACE FUNCTION public.generate_vap_vae_request_number()
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
            SUBSTRING(request_number FROM 'VAP-[0-9]{8}-([0-9]{4})')
            AS INTEGER
        )
    ), 0) + 1
    INTO sequence_num
    FROM public.vap_vae_requests
    WHERE request_number LIKE 'VAP-' || date_string || '-%';
    
    -- Générer le numéro avec padding
    new_number := 'VAP-' || date_string || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$;

-- =============================================
-- PHASE 4: TRIGGERS
-- =============================================

-- Trigger pour updated_at sur vap_vae_requests
CREATE TRIGGER update_vap_vae_requests_updated_at
BEFORE UPDATE ON public.vap_vae_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour générer automatiquement le numéro de demande
CREATE OR REPLACE FUNCTION public.set_vap_vae_request_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.request_number IS NULL OR NEW.request_number = '' THEN
        NEW.request_number := public.generate_vap_vae_request_number();
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_vap_vae_request_number_trigger
BEFORE INSERT ON public.vap_vae_requests
FOR EACH ROW EXECUTE FUNCTION public.set_vap_vae_request_number();

-- Trigger pour créer un historique lors du changement de statut
CREATE OR REPLACE FUNCTION public.track_vap_vae_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.vap_vae_status_history (
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

CREATE TRIGGER track_vap_vae_status_change
AFTER UPDATE ON public.vap_vae_requests
FOR EACH ROW EXECUTE FUNCTION public.track_vap_vae_status_change();

-- =============================================
-- PHASE 5: ACTIVATION RLS
-- =============================================

ALTER TABLE public.vap_vae_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vap_vae_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vap_vae_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vap_vae_pricing ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PHASE 6: POLITIQUES RLS - VAP_VAE_REQUESTS
-- =============================================

-- Les utilisateurs peuvent voir leurs propres demandes
CREATE POLICY "Users can view their own vap vae requests"
ON public.vap_vae_requests FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs demandes
CREATE POLICY "Users can create vap vae requests"
ON public.vap_vae_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all vap vae requests"
ON public.vap_vae_requests FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Les admins peuvent tout modifier
CREATE POLICY "Admins can update vap vae requests"
ON public.vap_vae_requests FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Politique pour les utilisateurs non authentifiés (tracker public)
CREATE POLICY "Anyone can view vap vae request by number"
ON public.vap_vae_requests FOR SELECT
TO anon
USING (true);

-- =============================================
-- PHASE 7: POLITIQUES RLS - VAP_VAE_PAYMENTS
-- =============================================

-- Les utilisateurs peuvent voir leurs propres paiements
CREATE POLICY "Users can view their own vap vae payments"
ON public.vap_vae_payments FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.vap_vae_requests
        WHERE vap_vae_requests.id = vap_vae_payments.request_id
        AND vap_vae_requests.user_id = auth.uid()
    )
);

-- Les utilisateurs peuvent créer des paiements pour leurs demandes
CREATE POLICY "Users can create their own vap vae payments"
ON public.vap_vae_payments FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.vap_vae_requests
        WHERE vap_vae_requests.id = vap_vae_payments.request_id
        AND vap_vae_requests.user_id = auth.uid()
    )
);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all vap vae payments"
ON public.vap_vae_payments FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Les admins peuvent tout gérer
CREATE POLICY "Admins can manage vap vae payments"
ON public.vap_vae_payments FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 8: POLITIQUES RLS - VAP_VAE_STATUS_HISTORY
-- =============================================

-- Les utilisateurs peuvent voir l'historique de leurs demandes
CREATE POLICY "Users can view their own vap vae status history"
ON public.vap_vae_status_history FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.vap_vae_requests
        WHERE vap_vae_requests.id = vap_vae_status_history.request_id
        AND vap_vae_requests.user_id = auth.uid()
    )
);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all vap vae status history"
ON public.vap_vae_status_history FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 9: POLITIQUES RLS - VAP_VAE_PRICING
-- =============================================

-- Tout le monde peut voir la tarification active
CREATE POLICY "Anyone can view active vap vae pricing"
ON public.vap_vae_pricing FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Les admins peuvent gérer la tarification
CREATE POLICY "Admins can manage vap vae pricing"
ON public.vap_vae_pricing FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 10: DONNÉES INITIALES - TARIFICATION
-- =============================================

INSERT INTO public.vap_vae_pricing (level, base_price, advance_amount, description, is_active) VALUES
(
    'DUT',
    200000,
    150000,
    'Inscription VAP/VAE niveau DUT - Toutes filières professionnelles',
    true
),
(
    'LICENCE',
    500000,
    400000,
    'Inscription VAP/VAE niveau Licence - Toutes filières professionnelles',
    true
),
(
    'MASTER',
    1000000,
    600000,
    'Inscription VAP/VAE niveau Master - Toutes filières professionnelles',
    true
);

-- =============================================
-- PHASE 11: INDEX POUR PERFORMANCE
-- =============================================

CREATE INDEX idx_vap_vae_requests_user_id ON public.vap_vae_requests(user_id);
CREATE INDEX idx_vap_vae_requests_status ON public.vap_vae_requests(status);
CREATE INDEX idx_vap_vae_requests_request_number ON public.vap_vae_requests(request_number);
CREATE INDEX idx_vap_vae_requests_created_at ON public.vap_vae_requests(created_at DESC);
CREATE INDEX idx_vap_vae_payments_request_id ON public.vap_vae_payments(request_id);
CREATE INDEX idx_vap_vae_status_history_request_id ON public.vap_vae_status_history(request_id);

-- =============================================
-- FIN DE LA MIGRATION
-- =============================================
