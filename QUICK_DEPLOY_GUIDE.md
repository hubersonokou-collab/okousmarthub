# 🚀 Guide de Déploiement Rapide - OKOU Smart Hub

Votre application est prête à être déployée ! Suivez ces étapes simples.

---

## ✅ État Actuel

- ✅ Code vérifié (pas d'erreurs TypeScript)
- ✅ Working tree Git propre
- ✅ Variables d'environnement configurées
- ✅ Migrations SQL prêtes

---

## 📦 Étape 1: Pousser sur GitHub (Si pas déjà fait)

### Vérifier le remote GitHub
```bash
git remote -v
```

### Si le repository existe déjà, simplement pousser
```bash
git add .
git commit -m "Deploy: Ready for production"
git push origin main
```

### Si pas de repository GitHub, en créer un
1. Aller sur https://github.com/new
2. Créer un nouveau repository (ex: `okou-smart-hub`)
3. Copier les commandes fournies par GitHub
4. Les exécuter dans le terminal

---

## 🌐 Étape 2: Déployer sur Vercel

### 2.1 Se connecter à Vercel
1. Aller sur https://vercel.com
2. Cliquer sur "Sign up" ou "Log in"
3. Choisir "Continue with GitHub"

### 2.2 Importer le projet
1. Cliquer sur "Add New Project"
2. Importer le repository `okou-smart-hub` depuis GitHub
3. Vercel va détecter automatiquement que c'est un projet Vite

### 2.3 Configurer les variables d'environnement
Avant de déployer, ajouter ces variables dans "Environment Variables" :

```
VITE_SUPABASE_URL=https://zvqiuhostvqwxtumrwdp.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2cWl1aG9zdHZxd3h0dW1yd2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMzA2NDAsImV4cCI6MjA4NTYwNjY0MH0.CQaSLTSuu7uJPDj840VuMgqg07n7wvO01iehrbKjBMk
VITE_SUPABASE_PROJECT_ID=zvqiuhostvqwxtumrwdp
```

### 2.4 Déployer
1. Cliquer sur "Deploy"
2. Attendre 2-3 minutes que le build se termine
3. ✅ Votre application sera disponible sur une URL comme `https://okou-smart-hub.vercel.app`

---

## 🗄️ Étape 3: Configurer Supabase

### 3.1 Se connecter à Supabase
1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet (zvqiuhostvqwxtumrwdp)

### 3.2 Appliquer la migration SQL
1. Cliquer sur "SQL Editor" dans la barre latérale
2. Cliquer sur "New query"
3. Copier le contenu de `supabase/migrations/20260208140000_unified_travel_system.sql`
4. Coller dans l'éditeur
5. Cliquer sur "Run" (ou Ctrl+Enter)
6. Attendre 5-10 secondes
7. ✅ Vérifier qu'il n'y a pas d'erreurs

### 3.3 Créer les buckets Storage

#### Bucket 1: travel-documents
1. Cliquer sur "Storage" → "New bucket"
2. Name: `travel-documents`
3. Public bucket: **DÉCOCHER** (privé)
4. File size limit: `10` MB
5. Cliquer "Create bucket"

#### Bucket 2: invoices
1. Cliquer "New bucket"
2. Name: `invoices`
3. Public bucket: **DÉCOCHER**
4. File size limit: `5` MB
5. Cliquer "Create bucket"

#### Bucket 3: receipts
1. Cliquer "New bucket"
2. Name: `receipts`
3. Public bucket: **DÉCOCHER**
4. File size limit: `5` MB
5. Cliquer "Create bucket"

### 3.4 Appliquer les policies Storage
1. Retourner dans "SQL Editor"
2. Cliquer "New query"
3. Copier le contenu de `supabase/storage_policies.sql`
4. Coller dans l'éditeur
5. Cliquer "Run"
6. ✅ Les 12 policies sont créées

---

## 🧪 Étape 4: Tester l'Application Déployée

### Test 1: Accès de base
1. Ouvrer l'URL Vercel dans un navigateur
2. Vérifier que la page d'accueil s'affiche
3. ✅ Pas d'erreur 404 ou 500

### Test 2: Navigation vers le service voyage
1. Cliquer sur "VOYAGE" dans le menu
2. Ou aller sur `/services/assistance-voyage`
3. ✅ La page se charge correctement

### Test 3: Bouton "Evaluer mon dossier"
1. Sur la page de voyage, cliquer "Evaluer mon dossier"
2. ✅ Redirection vers le formulaire de demande
3. ✅ Les 4 étapes s'affichent

### Test 4: Formulaire (si connecté)
1. S'inscrire ou se connecter
2. Remplir le formulaire étape par étape
3. ✅ Upload de documents fonctionne
4. ✅ Demande créée avec succès

---

## ✅ C'est Terminé !

Votre application est maintenant **100% déployée en production** ! 🎉

### URLs importantes

- **Application**: `https://[votre-url].vercel.app`
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard

### Fonctionnalités disponibles

- ✅ Formulaire de demande de voyage (4 étapes)
- ✅ Upload de documents
- ✅ Dashboard client
- ✅ Dashboard admin
- ✅ Messagerie
- ✅ Suivi des paiements

---

## 🆘 Besoin d'Aide ?

Si vous rencontrez des problèmes :

1. **Erreur de build sur Vercel** → Vérifier les logs dans Vercel Dashboard
2. **Erreur de connexion Supabase** → Vérifier que les variables d'environnement sont correctes
3. **Tables manquantes** → Appliquer la migration SQL (Étape 3.2)
4. **Upload de fichiers échoue** → Créer les buckets (Étape 3.3) et policies (Étape 3.4)

---

**Temps total estimé : 15-20 minutes**
