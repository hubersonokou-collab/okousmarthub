# 🚀 Instructions de Déploiement - Système Voyage

## ✅ Statut actuel

- ✅ Code déployé sur Vercel (automatique via GitHub)
- ⏳ Migration Supabase à appliquer (ÉTAPE CRITIQUE)

---

## 📝 ÉTAPE 1: Appliquer la Migration Supabase

### Option A: Via l'interface Web Supabase (RECOMMANDÉ)

1. **Aller sur Supabase Dashboard**
   - Ouvrir: https://supabase.com/dashboard
   - Se connecter
   - Sélectionner votre projet OKOU SMART HUB

2. **Ouvrir l'éditeur SQL**
   - Cliquer sur "SQL Editor" dans la barre latérale gauche
   - Cliquer sur "New query"

3. **Copier-coller la migration**
   - Ouvrir le fichier: `supabase/migrations/20260208120000_travel_system_complete.sql`
   - Copier TOUT le contenu
   - Coller dans l'éditeur SQL de Supabase

4. **Exécuter la migration**
   - Cliquer sur "Run" ou appuyer sur Ctrl+Enter
   - Attendre la fin de l'exécution (environ 5-10 secondes)
   - Vérifier qu'il n'y a pas d'erreurs

5. **Vérification**
   - Dans la sidebar, cliquer sur "Table Editor"
   - Vérifier que ces nouvelles tables existent:
     - `travel_messages`
     - `travel_notifications`
     - `travel_validation_checklist`

### Option B: Via SQL directement (copier-coller)

Si vous préférez copier-coller directement, voici le SQL à exécuter:

```sql
-- VOIR LE FICHIER: supabase/migrations/20260208120000_travel_system_complete.sql
-- Copier tout son contenu et l'exécuter dans Supabase SQL Editor
```

---

## 📦 ÉTAPE 2: Créer les Buckets Storage

### Via l'interface Supabase

1. **Aller dans Storage**
   - Cliquer sur "Storage" dans la barre latérale
   - Cliquer sur "New bucket"

2. **Créer bucket `travel-documents`**
   - Name: `travel-documents`
   - Public bucket: **NON** (décocher)
   - File size limit: 10 MB
   - Cliquer sur "Create bucket"

3. **Créer bucket `invoices`**
   - Name: `invoices`
   - Public bucket: **NON**
   - File size limit: 5 MB
   - Cliquer sur "Create bucket"

4. **Créer bucket `receipts`**
   - Name: `receipts`
   - Public bucket: **NON**
   - File size limit: 5 MB
   - Cliquer sur "Create bucket"

---

## 🔐 ÉTAPE 3: Configurer les Policies Storage

Pour **chaque bucket créé**, ajouter les policies suivantes:

### Via SQL Editor

```sql
-- Policy: Utilisateurs peuvent uploader leurs propres fichiers
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'travel-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Utilisateurs peuvent lire leurs propres fichiers
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'travel-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Admins peuvent tout lire
CREATE POLICY "Admins can read all files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'travel-documents' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

**Répéter ces 3 policies** pour les buckets `invoices` et `receipts` en changeant `bucket_id`.

---

## ✅ ÉTAPE 4: Vérifier le déploiement Vercel

1. **Aller sur Vercel**
   - https://vercel.com/dashboard
   - Trouver le projet OKOU SMART HUB

2. **Vérifier le statut**
   - Le dernier déploiement doit avoir le statut "Ready"
   - Si "Building", attendre qu'il finisse

3. **Obtenir l'URL**
   - Copier l'URL de production (ex: `https://votre-app.vercel.app`)

---

## 🧪 ÉTAPE 5: Tester le système

### Test 1: Formulaire de demande

1. Aller sur: `https://votre-app.vercel.app/services/assistance-voyage`
2. Cliquer sur un bouton "Faire une demande" (Études ou Travail)
3. Remplir le formulaire étape par étape:
   - Étape 1: Choisir type de projet, destination, infos perso
   - Étape 2: Infos passeport
   - Étape 3: Upload documents (tester drag & drop)
   - Étape 4: Voir récapitulatif
4. Soumettre la demande

**Résultat attendu:** Message de succès + création du dossier en base

### Test 2: Dashboard Client

1. Aller sur: `https://votre-app.vercel.app/dashboard/client`
2. Vérifier que:
   - Les stats s'affichent (Total, En cours, Complétés)
   - Vos dossiers sont listés
   - Vous pouvez cliquer sur un dossier

### Test 3: Dashboard Admin

1. Se connecter avec un compte admin
2. Aller sur: `https://votre-app.vercel.app/dashboard/superadmin`
3. Vérifier:
   - Les KPIs globaux s'affichent
   - La liste des dossiers apparaît
   - La checklist fonctionne
   - Les actions Valider/Rejeter fonctionnent

### Test 4: Détails dossier

1. Depuis le dashboard client, cliquer sur un dossier
2. Vérifier les 4 tabs:
   - Vue d'ensemble
   - Documents
   - Paiements
   - Messages
3. Tester l'envoi d'un message

---

## 🐛 Résolution de problèmes

### Erreur: "relation does not exist"

**Problème:** Migration Supabase pas appliquée

**Solution:**
- Retourner à l'ÉTAPE 1
- Appliquer la migration SQL
- Vérifier que les tables sont créées

### Erreur lors de l'upload de fichier

**Problème:** Buckets Storage pas créés

**Solution:**
- Retourner à l'ÉTAPE 2
- Créer les 3 buckets
- Appliquer les policies (ÉTAPE 3)

### Le formulaire ne s'affiche pas correctement

**Problème:** Déploiement Vercel pas terminé

**Solution:**
- Attendre la fin du build sur Vercel
- Rafraîchir la page (Ctrl+F5)

### Les données ne se sauvegardent pas

**Problèmes possibles:**
1. Migration pas appliquée → ÉTAPE 1
2. Variables d'environnement manquantes → Vérifier Vercel settings

---

## 📊 Ce qui fonctionne MAINTENANT

Après avoir suivi ces 5 étapes:

✅ Formulaire dynamique complet (4 étapes)
✅ Upload de documents avec drag & drop
✅ Dashboard client avec statistiques
✅ Dashboard admin avec workflow de vérification
✅ Système de messagerie client-admin
✅ Notifications automatiques
✅ Suivi des paiements
✅ Génération automatique de numéros de dossier

---

## 🎯 Prochaines améliorations (optionnelles)

1. **Intégration paiements** (Orange Money, Wave, Stripe)
2. **Visionneuse PDF** pour documents
3. **Génération de factures PDF**
4. **Notifications email/SMS**
5. **Export Excel** des statistiques

---

## ✨ C'est tout !

Une fois ces 5 étapes complétées, votre **Système Complet de Gestion Voyage** sera 100% fonctionnel ! 🚀

**Temps estimé:** 15-20 minutes

**Difficulté:** Facile (copier-coller)
