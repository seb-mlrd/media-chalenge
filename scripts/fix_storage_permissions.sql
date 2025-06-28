-- Script SQL pour configurer les permissions Supabase Storage plus permissives
-- Exécutez ce script dans la console SQL de Supabase pour faciliter les uploads

-- Créer une politique permissive pour les uploads
INSERT INTO storage.policies (name, bucket_id, definition, owner)
VALUES (
  'Allow uploads for authenticated users - permissive',
  'media',
  '(auth.role() = ''authenticated'')',
  (SELECT id FROM auth.users LIMIT 1)
)
ON CONFLICT (name, bucket_id) DO UPDATE
SET definition = '(auth.role() = ''authenticated'')';

-- Créer une politique permissive pour la lecture
INSERT INTO storage.policies (name, bucket_id, definition, owner)
VALUES (
  'Allow downloads for all - permissive',
  'media',
  'TRUE',
  (SELECT id FROM auth.users LIMIT 1)
)
ON CONFLICT (name, bucket_id) DO UPDATE
SET definition = 'TRUE';

-- Note: Ce script crée des politiques très permissives.
-- Pour un environnement de production, utilisez des politiques plus restrictives.
