-- Migration pour changer les colonnes created_by et updated_by de INTEGER à UUID
-- Cette migration doit être exécutée dans la console SQL de Supabase

-- Étape 1: Modifier le type de colonne created_by
ALTER TABLE articles
  ALTER COLUMN created_by TYPE uuid USING created_by::text::uuid;

-- Étape 2: Modifier le type de colonne updated_by
ALTER TABLE articles
  ALTER COLUMN updated_by TYPE uuid USING updated_by::text::uuid;

-- Note: Si la conversion échoue à cause de données non valides, 
-- vous pouvez soit:
-- 1. Nettoyer les données avant la migration
-- 2. Ou utiliser une approche différente en créant des colonnes temporaires
