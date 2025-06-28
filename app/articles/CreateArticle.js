import { supabase } from '@/lib/supabase';
import { saveMediaMetadata } from '../media/MediaService';

async function createArticle(article, mediaFiles = []) {
  try {
    // 1. Créer l'article
    const { data, error } = await supabase
      .from('articles')
      .insert([{
        title: article.title,
        content: article.content,
        theme_id: article.theme_id,
        created_by: article.created_by,
        updated_by: article.updated_by
      }])
      .select();

    if (error) {
      console.error('Erreur lors de la création de l\'article :', error.message);
      return { success: false, message: error.message };
    }

    // Sécurisation de l'accès à data[0]
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { success: true, article: null };
    }

    const createdArticle = data[0];

    // 2. Associer les médias à l'article créé
    if (mediaFiles && mediaFiles.length > 0) {
      const mediaPromises = mediaFiles.map(media => 
        saveMediaMetadata(createdArticle.id, media)
      );
      
      await Promise.all(mediaPromises);
    }

    return { success: true, article: createdArticle };
  } catch (err) {
    console.error('Exception lors de la création de l\'article :', err);
    return { success: false, message: err.message || 'Une erreur inconnue est survenue' };
  }
}

export default createArticle;