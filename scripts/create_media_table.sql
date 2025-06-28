-- Migration pour créer la table media pour stocker les métadonnées des fichiers média
-- Cette migration doit être exécutée dans la console SQL de Supabase

-- Création de la table media si elle n'existe pas déjà
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'image' ou 'video'
  url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création d'un index pour améliorer les performances de recherche par article
CREATE INDEX IF NOT EXISTS idx_media_article_id ON media(article_id);
