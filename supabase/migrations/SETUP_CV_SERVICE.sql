-- ============================================
-- SCRIPT D'APPLICATION AUTOMATIQUE
-- Service CV Professionnel - OKOU Smart Hub
-- ============================================
-- 
-- Ce script contient TOUTES les migrations nécessaires
-- pour activer le service CV avec IA
--
-- À exécuter dans: Supabase Dashboard > SQL Editor
-- ============================================

-- 1. CRÉATION BUCKET STORAGE
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-documents', 'cv-documents', true)
ON CONFLICT (id) DO NOTHING;

-- 2. ACTIVATION RLS
-- ============================================
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. SUPPRESSION ANCIENNES POLICIES (si existent)
-- ============================================
DROP POLICY IF EXISTS "Users can upload their own CVs" ON storage.objects;
DROP POLICY IF EXISTS "Public can read CVs" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own CVs" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own CVs" ON storage.objects;

-- 4. CRÉATION POLICIES RLS
-- ============================================

-- Policy: Users can upload their own CVs
CREATE POLICY "Users can upload their own CVs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cv-documents');

-- Policy: Public read access for CVs
CREATE POLICY "Public can read CVs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'cv-documents');

-- Policy: Users can delete their own CVs
CREATE POLICY "Users can delete their own CVs"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'cv-documents');

-- Policy: Users can update their own CVs
CREATE POLICY "Users can update their own CVs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'cv-documents')
WITH CHECK (bucket_id = 'cv-documents');

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Vérifier que le bucket existe
SELECT id, name, public FROM storage.buckets WHERE id = 'cv-documents';

-- Vérifier les policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND policyname LIKE '%CV%'
ORDER BY policyname;

-- ============================================
-- RÉSULTAT ATTENDU:
-- ============================================
-- 
-- Bucket cv-documents:
-- ✅ id: cv-documents
-- ✅ name: cv-documents
-- ✅ public: true
--
-- Policies (4):
-- ✅ Users can upload their own CVs (INSERT)
-- ✅ Public can read CVs (SELECT)
-- ✅ Users can delete their own CVs (DELETE)
-- ✅ Users can update their own CVs (UPDATE)
--
-- ============================================

-- 🎉 SUCCÈS ! Bucket configuré avec RLS.
-- 
-- PROCHAINE ÉTAPE:
-- 1. Settings > Edge Functions > Environment Variables
-- 2. Ajouter: OPENAI_API_KEY = sk-...
-- 3. Déployer les Edge Functions (voir guide)
-- ============================================
