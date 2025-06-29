import { supabase } from "@/lib/supabase";

export async function fetchArticlesService() {
    return await supabase
        .from('articles')
        .select('*, articles_created_by_fkey(nickname), themes(name), media(id,type,url,mime_type)');
};

export async function fetchArticlesSinceService(dateLimite) {
    return await supabase
        .from('articles')
        .select('*, articles_created_by_fkey(nickname), themes(name), media(id,type,url,mime_type)')
        .gte('created_at', dateLimite);
}

export async function fetchArticlesByThemeService(themeId) {
    return await supabase
        .from('articles')
        .select('*, articles_created_by_fkey(nickname), themes(name), media(id,type,url,mime_type)')
        .eq('theme_id', themeId);
}

export async function fetchThemesService() {
    return await supabase
        .from('themes')
        .select('id, name')
}

export async function deleteArticleService(articleId) {
    const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId);

    if (error) {
        return { success: false, message: error.message };
    }

    return { success: true };
}

export async function addArticleFavoriteService(articleId, userId) {
    return await supabase
      .from('favorites')
      .insert({ profil_id: userId, article_id: articleId });
}

export async function deleteArticleFavoriteService(articleId, userId) {
    return await supabase
      .from('favorites')
      .delete()
      .match({ profil_id: userId, article_id: articleId });
}