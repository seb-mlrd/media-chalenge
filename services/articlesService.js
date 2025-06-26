import { supabase } from "@/lib/supabase";

export async function fetchArticlesService() {
    return await supabase
        .from('articles')
        .select('*, articles_created_by_fkey(nickname), themes(name)');
};

export async function fetchArticlesSinceService(dateLimite) {
    return await supabase
        .from('articles')
        .select('*, articles_created_by_fkey(nickname), themes(name)')
        .gte('created_at', dateLimite);
}

export async function fetchArticlesByThemeService(themeId) {
    return await supabase
        .from('articles')
        .select('*, articles_created_by_fkey(nickname), themes(name)')
        .eq('theme_id', themeId);
}

export async function fetchThemesService() {
    return await supabase
        .from('themes')
        .select('id, name')
}