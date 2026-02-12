# Déploiement des Edge Functions IA

## Prérequis
1. Installer Supabase CLI
```bash
npm install -g supabase
```

2. Se connecter à Supabase
```bash
supabase login
```

3. Lier le projet
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

## Configurer la clé OpenAI

Dans le dashboard Supabase:
1. Aller dans Settings → Edge Functions
2. Ajouter la variable d'environnement:
   - Nom: `OPENAI_API_KEY`
   - Valeur: `sk-...` (votre clé OpenAI)

## Déployer les fonctions

```bash
# Déployer ai-suggest-skills
supabase functions deploy ai-suggest-skills

# Déployer ai-enhance-summary
supabase functions deploy ai-enhance-summary
```

## Tester localement (optionnel)

```bash
# Démarrer toutes les fonctions localement
supabase functions serve

# Tester ai-suggest-skills
curl -i --location --request POST 'http://localhost:54321/functions/v1/ai-suggest-skills' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"jobTitle":"Développeur Full Stack","industry":"Tech","existingSkills":["React","Node.js"]}'

# Tester ai-enhance-summary
curl -i --location --request POST 'http://localhost:54321/functions/v1/ai-enhance-summary' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"summary":"Développeur passionné avec 5 ans d\'expérience."}'
```

## URLs des fonctions déployées

Après déploiement, les endpoints seront:
- `https://YOUR_PROJECT_REF.supabase.co/functions/v1/ai-suggest-skills`
- `https://YOUR_PROJECT_REF.supabase.co/functions/v1/ai-enhance-summary`

## Configuration dans le frontend

Les URLs seront automatiquement configurées via le client Supabase.
