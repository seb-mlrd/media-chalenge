import { supabase } from '@/lib/supabase'; 

async function createArticle(article) {
  try {
    const { data, error } = await supabase
      .from('articles')
      .insert([{
        title: article.title,
        content: article.content,
        theme_id: article.theme_id,
        created_by: article.created_by,
        updated_by: article.updated_by
      }])
      .select(); // Ajout du .select() pour garantir le retour de data

    if (error) {
      console.error('Erreur lors de la création de l\'article :', error.message);
      return { success: false, message: error.message };
    }

    // Sécurisation de l'accès à data[0]
    if (data && Array.isArray(data) && data.length > 0) {
      return { success: true, article: data[0] };
    } else {
      return { success: true, article: null };
    }
  } catch (err) {
    console.error('Exception lors de la création de l\'article :', err);
    return { success: false, message: err.message || 'Une erreur inconnue est survenue' };
  }
}

export default createArticle;