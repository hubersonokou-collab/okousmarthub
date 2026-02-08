# 📦 Configuration Storage Supabase - GUIDE SIMPLIFIÉ

## ✅ Étape 1: Créer les buckets

Dans Supabase Dashboard > Storage:

1. **Bucket: travel-documents**
   - Cliquer "New bucket"
   - Name: `travel-documents`
   - Public bucket: **DÉCOCHÉ** (Private)
   - File size limit: `10485760` (10 MB)
   - Allowed MIME types: Laisser vide
   - Cliquer "Create bucket"

2. **Bucket: invoices**
   - Name: `invoices`
   - Public bucket: **DÉCOCHÉ**
   - File size limit: `5242880` (5 MB)
   - Cliquer "Create bucket"

3. **Bucket: receipts**
   - Name: `receipts`
   - Public bucket: **DÉCOCHÉ**
   - File size limit: `5242880` (5 MB)
   - Cliquer "Create bucket"

---

## ✅ Étape 2: Ajouter les policies

### MÉTHODE SIMPLE (Recommandée)

Pour chaque bucket, Supabase vous propose des templates. **Utilisez cette approche:**

1. Aller sur le bucket (ex: `travel-documents`)
2. Cliquer sur l'onglet **"Policies"**
3. Cliquer **"New policy"**
4. Choisir un template: **"Allow authenticated users to upload"**
5. Modifier le nom si nécessaire
6. Cliquer **"Review"** puis **"Save policy"**

Répéter pour:
- ✅ Upload (INSERT)
- ✅ Read (SELECT)
- ✅ Update (UPDATE)
- ✅ Delete (DELETE)

### MÉTHODE AVANCÉE (Via SQL)

Si les templates ne fonctionnent pas, utilisez le SQL personnalisé:

**Pour travel-documents:**

```sql
-- Upload
CREATE POLICY "Users upload own files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'travel-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Read
CREATE POLICY "Users read own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'travel-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Update
CREATE POLICY "Users update own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'travel-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Delete
CREATE POLICY "Users delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'travel-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Répéter pour `invoices` et `receipts`** en changeant `bucket_id`.

---

## ✅ Étape 3: Vérifier

Dans Supabase > Storage > travel-documents > Policies

Vous devriez voir **4 policies actives**:
- ✅ INSERT policy
- ✅ SELECT policy
- ✅ UPDATE policy
- ✅ DELETE policy

---

## 🧪 Tester l'upload

Dans votre code TypeScript, l'upload se fait comme suit:

```typescript
import { supabase } from '@/lib/supabase';

async function uploadDocument(file: File, userId: string) {
  // Le chemin doit inclure l'user_id comme premier dossier
  const filePath = `${userId}/${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('travel-documents')
    .upload(filePath, file);
    
  if (error) {
    console.error('Upload error:', error);
    return null;
  }
  
  return data;
}
```

---

## ⚠️ Erreurs courantes

### Erreur: "new row violates row-level security policy"

**Cause:** Policy mal configurée ou chemin de fichier incorrect

**Solution:**
1. Vérifier que le fichier est uploadé avec le bon chemin: `{user_id}/filename`
2. Vérifier que l'utilisateur est authentifié
3. Re-créer les policies

### Erreur: "relation storage.objects does not exist"

**Cause:** Les policies doivent être créées dans l'interface Storage, pas dans SQL Editor

**Solution:**
1. Aller dans Storage > Bucket > Policies
2. Créer les policies via l'interface graphique

---

## ✨ C'est tout !

Une fois les 3 buckets créés avec leurs policies, le système d'upload de documents fonctionnera parfaitement ! 🚀

**Fichier SQL complet:** `supabase/storage_policies.sql`
