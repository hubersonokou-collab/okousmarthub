

## Plan : Ajout d'images et refonte des couleurs pour les Services et Formations

### Objectif
Ajouter des images visuelles attractives a chaque service et formation, et rafraichir les couleurs avec une palette plus vibrante et moderne.

---

### 1. Ajout d'une colonne `image_url` aux tables `services` et `formations`

**Migration SQL** pour ajouter la colonne `image_url` (type TEXT) aux deux tables. Cela permettra d'associer une image a chaque service et formation via l'admin ou directement.

En attendant que des images personnalisees soient ajoutees, on utilisera des images Unsplash par defaut dans le code frontend.

---

### 2. Refonte de la page Services (`src/pages/Services.tsx`)

- Ajouter une **banniere image en haut de chaque carte** de service (hauteur ~160px) avec une image par defaut basee sur la categorie ou le slug
- Effet **zoom au survol** sur l'image
- Mettre a jour la **palette de couleurs des categories** :
  - Academique : degrades bleu-indigo vibrant
  - Voyage : degrades orange-corail
  - Emploi : degrades emeraude-turquoise
  - Entreprise : degrades ambre-dore
  - Digital : degrades violet-rose
  - Formation : degrades cyan-bleu ciel
- Ajouter un **gradient decoratif en bas de chaque carte** au survol
- Ameliorer le hero de la page avec un **fond degrade colore**

---

### 3. Refonte de la grille Services de la page d'accueil (`src/components/home/ServicesGrid.tsx`)

- Ajouter une **image de fond** en haut de chaque carte de service
- Images predefinies correspondant a chaque service (redaction, voyage, comptabilite, etc.)
- Conserver les icones mais les superposer sur l'image avec un effet de transparence
- Couleurs de gradients plus vives et attractives :
  - Bleu royal / Violet profond / Corail / Turquoise / Or / Rose fuchsia

---

### 4. Refonte de la page Formations (`src/pages/Formations.tsx`)

- Ajouter des **images illustratives** en haut de chaque carte de formation
- Images predefinies par categorie :
  - Informatique : image de code/developpement
  - Comptabilite : image de chiffres/tableaux
  - Design : image de creation graphique
  - Marketing : image de reseaux sociaux/analytics
  - Maintenance : image de reparation electronique
- **Nouvelles couleurs de categories** plus vibrantes :
  - Informatique : bleu electrique -> cyan
  - Comptabilite : vert emeraude -> teal
  - Design : violet -> fuchsia
  - Marketing : orange -> corail
  - Maintenance : rouge -> rose vif
- Ameliorer le hero avec un fond degrade attractif
- Ajouter un effet de **hover avec zoom** sur les images

---

### 5. Mise a jour du fichier de constantes (`src/lib/constants.ts`)

- Mettre a jour `CATEGORY_COLORS` avec des couleurs plus vibrantes et modernes
- Nouvelles palettes utilisant des teintes plus saturees (fuchsia, cyan, amber, coral, electric blue)

---

### 6. Mise a jour de `ServiceDetail.tsx`

- Enrichir la map `SERVICE_IMAGES` avec des images de meilleure qualite
- S'assurer que l'image d'Analyse Financiere est bien prise en compte

---

### 7. Mise a jour des couleurs CSS (`src/index.css`)

- Rafraichir les variables de gradients pour des couleurs plus eclatantes
- Mettre a jour `--gradient-primary` avec des tons plus vibrants
- Ajouter de nouvelles classes de gradient attractives

---

### Images par defaut utilisees (Unsplash)

| Service/Formation | Image |
|---|---|
| Redaction Academique | Etudiants/livres |
| Inscription VAP/VAE | Ceremonie de diplome |
| Assistance Voyage | Avion/globe |
| CV & Lettre | Documents professionnels |
| Comptabilite | Graphiques financiers |
| Creation Site Web | Ecran de code |
| Formation Pratique | Salle de classe |
| Analyse Financiere | Dashboard financier |
| Dev Web | Code sur ecran |
| Reseaux | Cables reseau |
| Design Graphique | Palette couleurs |
| Marketing Digital | Reseaux sociaux |
| Maintenance | Outils de reparation |

---

### Fichiers modifies

1. **Migration SQL** : nouvelle migration pour `ALTER TABLE services ADD COLUMN image_url TEXT` et idem pour `formations`
2. **`src/integrations/supabase/types.ts`** : mise a jour des types
3. **`src/pages/Services.tsx`** : ajout d'images, nouvelles couleurs
4. **`src/components/home/ServicesGrid.tsx`** : ajout d'images, nouvelles couleurs
5. **`src/pages/Formations.tsx`** : ajout d'images, nouvelles couleurs
6. **`src/pages/ServiceDetail.tsx`** : mise a jour des images par defaut
7. **`src/lib/constants.ts`** : nouvelles couleurs de categories
8. **`src/index.css`** : gradients plus vibrants

