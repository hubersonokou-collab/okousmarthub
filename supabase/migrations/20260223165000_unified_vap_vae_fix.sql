-- =============================================
-- UNIFICATION DU SCHÉMA VAP/VAE
-- Restaure l'intégralité du système original + Compatibilité Admin
-- Migration créée le: 2026-02-23
-- =============================================

-- 1. Réinitialisation sécurisée
DROP TABLE IF EXISTS public.vap_vae_status_history CASCADE;
DROP TABLE IF EXISTS public.vap_vae_payments CASCADE;
DROP TABLE IF EXISTS public.vap_vae_requests CASCADE;

-- 2. Restauration des Types ENUM (si manquants)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vap_vae_level') THEN
        CREATE TYPE public.vap_vae_level AS ENUM ('DUT', 'LICENCE', 'MASTER');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vap_vae_request_status') THEN
        CREATE TYPE public.vap_vae_request_status AS ENUM (
            'pending', 'processing', 'document_review', 'validation_pending', 
            'completed', 'rejected', 'cancelled'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vap_vae_support_type') THEN
        CREATE TYPE public.vap_vae_support_type AS ENUM ('standard', 'priority', 'personalized');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vap_vae_payment_type') THEN
        CREATE TYPE public.vap_vae_payment_type AS ENUM ('advance', 'balance');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vap_vae_payment_status') THEN
        CREATE TYPE public.vap_vae_payment_status AS ENUM ('pending', 'completed', 'failed');
    END IF;
END $$;

-- 3. Table des demandes d'inscription VAP/VAE UNIFIÉE
CREATE TABLE public.vap_vae_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Compatibilité Admin
    service_type TEXT NOT NULL DEFAULT 'VAP' CHECK (service_type IN ('VAP', 'VAE')),
    
    -- Informations Client
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    
    -- Détails de la demande
    current_profession TEXT NOT NULL,
    current_situation TEXT, -- Alias pour admin
    years_of_experience INTEGER NOT NULL CHECK (years_of_experience >= 0),
    experience_years INTEGER, -- Alias pour admin
    desired_field TEXT NOT NULL,
    target_diploma TEXT, -- Alias pour admin
    
    -- Niveaux et Suivi
    level vap_vae_level NOT NULL,
    support_type vap_vae_support_type DEFAULT 'standard' NOT NULL,
    
    -- Statut et Notes
    status vap_vae_request_status DEFAULT 'pending' NOT NULL,
    notes TEXT,
    admin_notes TEXT, -- Alias pour admin
    
    -- Comptabilité
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    advance_paid DECIMAL(10,2) DEFAULT 0,
    balance_due DECIMAL(10,2) NOT NULL DEFAULT 0,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 4. Fonctions et Triggers pour Autonumérotation
CREATE OR REPLACE FUNCTION public.generate_vap_vae_request_number()
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
    new_number TEXT;
    date_string TEXT;
    sequence_num INTEGER;
BEGIN
    date_string := TO_CHAR(NOW(), 'YYYYMMDD');
    SELECT COALESCE(MAX(CAST(SUBSTRING(request_number FROM 'VAP-[0-9]{8}-([0-9]{4})') AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM public.vap_vae_requests
    WHERE request_number LIKE 'VAP-' || date_string || '-%';
    new_number := 'VAP-' || date_string || '-' || LPAD(sequence_num::TEXT, 4, '0');
    RETURN new_number;
END; $$;

CREATE OR REPLACE FUNCTION public.set_vap_vae_request_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.request_number IS NULL OR NEW.request_number = '' THEN
        NEW.request_number := public.generate_vap_vae_request_number();
    END IF;
    -- Synchroniser les alias admin
    NEW.current_situation := NEW.current_profession;
    NEW.experience_years := NEW.years_of_experience;
    NEW.target_diploma := NEW.desired_field;
    RETURN NEW;
END; $$;

CREATE TRIGGER set_vap_vae_request_number_trigger
BEFORE INSERT ON public.vap_vae_requests
FOR EACH ROW EXECUTE FUNCTION public.set_vap_vae_request_number();

-- 5. RLS: Politiques Permissives
ALTER TABLE public.vap_vae_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create vap vae requests"
ON public.vap_vae_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can view vap vae request by number"
ON public.vap_vae_requests FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage all"
ON public.vap_vae_requests FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Recréer les tables liées
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

CREATE TABLE public.vap_vae_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.vap_vae_requests(id) ON DELETE CASCADE NOT NULL,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Autoriser les fonctions de numérotation pour tout le monde
GRANT EXECUTE ON FUNCTION public.generate_vap_vae_request_number() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_vap_vae_request_number() TO anon, authenticated;
