# PreShot - Plateforme de Média

Application de gestion d'articles et de contenu média construite avec Next.js et Supabase.

## Fonctionnalités

- Création d'articles avec titre et contenu
- Catégorisation des articles par thèmes
- Interface utilisateur moderne et responsive
- Support du thème sombre
- Gestion des thèmes (ajout, liste)

## Prérequis

- Node.js 14.x ou supérieur
- Compte Supabase avec une base de données configurée
- Variables d'environnement configurées

## Installation

1. Clonez le dépôt :

```bash
git clone <URL-du-depot>
cd media-chalenge
```

2. Installez les dépendances :

```bash
npm install
# ou
yarn install

#Installer dayjs avec relativeTime (si ce n’est pas encore fait)

npm install dayjs

```
3. Configurez les variables d'environnement :

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```
NEXT_PUBLIC_SUPABASE_URL=votre-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anonyme-supabase
```

4. Démarrez le serveur de développement :

```bash
npm run dev
# ou
yarn dev
```

## Configuration de la base de données

Pour initialiser la base de données, vous devez exécuter manuellement le script SQL suivant dans l'éditeur SQL de votre projet Supabase :

```sql
-- Créer la table themes
CREATE TABLE IF NOT EXISTS themes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer des thèmes par défaut
INSERT INTO themes (name) VALUES 
  ('Actualités'),
  ('Sports'),
  ('Technologie'),
  ('Culture'),
  ('Économie');
```

## Structure du projet

- `/app/page.js` - Formulaire de création d'articles
- `/app/articles/CreateArticle.js` - Service pour la création d'articles
- `/app/themes/` - Gestion des thèmes
- `/app/components/` - Composants réutilisables (Navbar, etc.)
- `/app/lib/supabase.js` - Configuration du client Supabase

## Modèle de données

L'application utilise les tables suivantes dans Supabase :

1. **articles** - Stocke les articles
   - `id` - Identifiant unique (clé primaire)
   - `title` - Titre de l'article
   - `content` - Contenu de l'article
   - `theme_id` - Clé étrangère vers la table themes
   - `created_by` - ID de l'utilisateur ayant créé l'article
   - `updated_by` - ID de l'utilisateur ayant mis à jour l'article
   - `created_at` - Date de création
   - `updated_at` - Date de mise à jour

2. **themes** - Stocke les catégories d'articles
   - `id` - Identifiant unique (clé primaire)
   - `name` - Nom du thème
   - `created_at` - Date de création

## Développement

Pour ajouter de nouvelles fonctionnalités ou corriger des bugs, vous pouvez :

1. Créer une branche pour votre fonctionnalité
2. Développer et tester votre code
3. Soumettre une pull request pour examen

## Dépendances

- Ajouter le dark mode:
  npm install next-themes
- Ajouter tailwind et postcss:
  npm install -D tailwindcss postcss autoprefixer
  npm install -D @tailwindcss/postcss
- Ajouter headlessui
  npm install @headlessui/react

## Licence

Ce projet est sous licence [MIT](LICENSE).

## Remerciements

- [Next.js](https://nextjs.org) - Framework React
- [Supabase](https://supabase.io) - Backend as a Service
