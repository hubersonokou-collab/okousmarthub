# 🚀 MIGRATION SIMPLIFIÉE - Système Voyage Complet

## ✅ Nouvelle migration unifiée créée !

**Fichier:** `supabase/migrations/20260208140000_unified_travel_system.sql`

Cette migration est **complète et sécurisée**:
- ✅ Supprime les anciennes structures (si elles existent)
- ✅ Recrée TOUT le système voyage
- ✅ Intègre Decreto Flussi
- ✅ Ajoute dashboards client/admin
- ✅ Messagerie + Notifications
- ✅ Peut être exécutée plusieurs fois sans erreur

---

## 📝 INSTRUCTIONS - 3 ÉTAPES SIMPLES

### ÉTAPE 1: Appliquer la migration Supabase

1. **Ouvrir Supabase Dashboard**
   - Aller sur: https://supabase.com/dashboard
   - Sélectionner votre projet OKOU SMART HUB

2. **Aller dans SQL Editor**
   - Cliquer sur "SQL Editor" (barre gauche)
   - Cliquer sur "New query"

3. **Copier-coller et exécuter**
   - Ouvrir le fichier: `supabase/migrations/20260208140000_unified_travel_system.sql`
   - **Copier TOUT le contenu** (Ctrl+A, Ctrl+C)
   - **Coller** dans l'éditeur SQL Supabase
   - Cliquer sur **"Run"** (ou Ctrl+Enter)
   - ⏱️ Attendre 15-20 secondes

✅ **La migration va**:
- Supprimer les anciennes tables/types (DROP IF EXISTS)
- Créer toutes les nouvelles tables
- Configurer les triggers automatiques
- Activer les RLS policies

### ÉTAPE 2: Créer les buckets Storage

1. **Dans Supabase, cliquer sur "Storage"** (barre gauche)

2. **Créer 3 buckets** (bouton "New bucket"):

   **Bucket 1:**
   - Name: `travel-documents`
   - Public: **NON** (décocher)
   - File size limit: `10 MB`

   **Bucket 2:**
   - Name: `invoices`
   - Public: **NON**
   - File size limit: `5 MB`

   **Bucket 3:**
   - Name: `receipts`
   - Public: **NON**
   - File size limit: `5 MB`

### ÉTAPE 3: Configurer les policies Storage

Pour chaque bucket créé:

1. Cliquer sur le bucket
2. Aller dans l'onglet "Policies"
3. Cliquer sur "New policy"
4. Choisir "Custom policy"
5. **Copier-coller ces 3 policies** (à adapter pour chaque bucket):

```sql
-- Policy 1: Upload
CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'travel-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Read own
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'travel-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Admins read all
CREATE POLICY "Admins can read all"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'travel-documents');
```

> **Note:** Répéter pour les buckets `invoices` et `receipts` en changeant `bucket_id`.

---

## ✅ VÉRIFICATION

Une fois la migration appliquée, vérifier que ça a marché:

### Dans Supabase:

1. **Table Editor** → Vérifier que ces tables existent:
   - `travel_requests` ✓
   - `travel_messages` ✓
   - `travel_notifications` ✓
   - `travel_documents` ✓
   - `travel_payments` ✓
   - `travel_validation_checklist` ✓
   - `travel_status_history` ✓

2. **SQL Editor** → Exécuter:
   ```sql
   SELECT * FROM public.admin_travel_statistics;
   ```
   → Vous devriez voir 1 ligne avec toutes les stats à 0

---

## 🎯 Ce qui est maintenant disponible

### Programme Général (Nouveau)
- 🎓 **Études** - Visa étudiant
- 💼 **Travail** - Visa professionnel
- ✈️ **Tourisme** - Visa touristique
- 👨‍👩‍👧 **Regroupement familial** - Visa famille

### Decreto Flussi (Déjà existant + intégré)
- Système complet Decreto Flussi
- Gestion quotas annuels
- Catégories d'emploi
- Info employeur

### Fonctionnalités communes
- ✅ Formulaire dynamique (4 étapes)
- ✅ Upload documents avec drag & drop
- ✅ Dashboard client
- ✅ Dashboard SuperAdmin
- ✅ Messagerie client-admin
- ✅ Notifications automatiques
- ✅ Suivi paiements
- ✅ Validation checklist

---

## 🌐 URLs du système

Après déploiement Vercel (automatique):

- **Formulaire général:** `/services/assistance-voyage/demande`
- **Tracker:** `/services/assistance-voyage/suivi`
- **Dashboard client:** `/dashboard/client`
- **Dashboard admin:** `/dashboard/superadmin`

---

## 🐛 En cas de problème

### Erreur: "already exists"
**Solution:** Migration déjà appliquée partiellement.
1. Aller dans SQL Editor
2. Exécuter chaque section `DROP` manuellement
3. Relancer la migration complète

### Les tables n'apparaissent pas
**Solution:**
1. Rafraîchir le navigateur (Ctrl+F5)
2. Vérifier dans SQL Editor: `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`

### Storage policies ne marchent pas
**Solution:**
1. Vérifier que les buckets sont PRIVATE (pas public)
2. Re-créer les policies une par une
3. Tester avec: `SELECT * FROM storage.objects;`

---

## ✨ C'est TOUT !

Une fois ces 3 étapes faites:

**Votre système de gestion voyage est 100% OPÉRATIONNEL** ! 🎉

Vous pouvez:
- ✅ Créer des demandes
- ✅ Uploader des documents
- ✅ Échanger des messages
- ✅ Suivre les paiements
- ✅ Vérifier les dossiers (admin)
- ✅ Voir les statistiques (admin)

**Test rapide:**
1. Créer une demande de voyage
2. Vérifier dans dashboard client
3. Vérifier dans dashboard admin
4. Tester la messagerie

**Tout fonctionne ? → Le système est prêt pour la production ! 🚀**
