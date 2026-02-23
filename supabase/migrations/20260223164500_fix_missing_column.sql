-- Vérification et réparation de la structure de la table vap_vae_requests
DO $$ 
BEGIN
    -- 1. Ajouter la colonne advance_paid si elle manque
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='vap_vae_requests' AND column_name='advance_paid'
    ) THEN
        ALTER TABLE public.vap_vae_requests ADD COLUMN advance_paid DECIMAL(10,2) DEFAULT 0;
    END IF;

    -- 2. Vérifier aussi les autres colonnes critiques
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='vap_vae_requests' AND column_name='total_amount'
    ) THEN
        ALTER TABLE public.vap_vae_requests ADD COLUMN total_amount DECIMAL(10,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='vap_vae_requests' AND column_name='balance_due'
    ) THEN
        ALTER TABLE public.vap_vae_requests ADD COLUMN balance_due DECIMAL(10,2) DEFAULT 0;
    END IF;
END $$;

-- 3. Recharger le cache du schéma (PostgREST)
-- Note: Dans Supabase, cela se fait normalement via l'UI ou automatiquement, 
-- mais on peut forcer une petite modification pour déclencher le rafraîchissement.
COMMENT ON TABLE public.vap_vae_requests IS 'Table des demandes VAP/VAE - Mise à jour du cache';
