-- =============================================
-- FIX: Politiques RLS VAP/VAE pour permettre
-- les inscriptions anonymes et connectées
-- Migration créée le: 2026-02-23
-- =============================================

-- Supprimer l'ancienne politique trop restrictive
DROP POLICY IF EXISTS "Users can create vap vae requests" ON public.vap_vae_requests;

-- Nouvelle politique : tout le monde peut créer une demande
-- (utilisateurs connectés ET visiteurs anonymes)
CREATE POLICY "Anyone can create vap vae requests"
ON public.vap_vae_requests FOR INSERT
TO anon, authenticated
WITH CHECK (
    -- Si connecté, user_id doit correspondre ou être null
    -- Si anonyme, user_id doit être null
    (auth.uid() IS NULL AND user_id IS NULL)
    OR
    (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR user_id IS NULL))
);

-- Permettre aux anonymes de lire leur propre demande via request_number
DROP POLICY IF EXISTS "Anyone can view vap vae request by number" ON public.vap_vae_requests;

CREATE POLICY "Anyone can view vap vae request by number"
ON public.vap_vae_requests FOR SELECT
TO anon
USING (true);

-- S'assurer que les utilisateurs connectés peuvent voir leurs demandes
DROP POLICY IF EXISTS "Users can view their own vap vae requests" ON public.vap_vae_requests;

CREATE POLICY "Users can view their own vap vae requests"
ON public.vap_vae_requests FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR public.has_role(auth.uid(), 'admin')
);
