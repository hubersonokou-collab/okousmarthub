-- =============================================
-- POLICIES STORAGE POUR SUPABASE
-- À exécuter dans l'interface Supabase Storage
-- =============================================

-- =============================================
-- BUCKET: travel-documents
-- =============================================

-- Policy 1: Les utilisateurs peuvent uploader dans leur propre dossier
CREATE POLICY "Users can upload own travel documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'travel-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Les utilisateurs peuvent voir leurs propres fichiers
CREATE POLICY "Users can view own travel documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'travel-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Les utilisateurs peuvent mettre à jour leurs propres fichiers
CREATE POLICY "Users can update own travel documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'travel-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Les utilisateurs peuvent supprimer leurs propres fichiers
CREATE POLICY "Users can delete own travel documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'travel-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- BUCKET: invoices
-- =============================================

-- Policy 1: Upload invoices
CREATE POLICY "Users can upload invoices"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'invoices' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: View invoices
CREATE POLICY "Users can view invoices"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'invoices' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Update invoices
CREATE POLICY "Users can update invoices"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'invoices' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Delete invoices
CREATE POLICY "Users can delete invoices"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'invoices' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- BUCKET: receipts
-- =============================================

-- Policy 1: Upload receipts
CREATE POLICY "Users can upload receipts"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'receipts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: View receipts
CREATE POLICY "Users can view receipts"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'receipts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Update receipts
CREATE POLICY "Users can update receipts"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'receipts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Delete receipts
CREATE POLICY "Users can delete receipts"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'receipts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- NOTES IMPORTANTES
-- =============================================

-- Les fichiers doivent être uploadés avec un chemin comme:
-- {user_id}/filename.pdf
-- 
-- Exemple: 550e8400-e29b-41d4-a716-446655440000/passport.pdf
-- 
-- Dans votre code TypeScript, uploadez comme suit:
-- const filePath = `${user.id}/${file.name}`;
-- await supabase.storage.from('travel-documents').upload(filePath, file);
