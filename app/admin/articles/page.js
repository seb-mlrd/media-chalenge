'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetchArticlesService, fetchArticlesSinceService, fetchArticlesByThemeService, fetchThemesService } from "@/services/articlesService";

export default function AllArticles() {
    const { user, loading } = useAuth();
    const [allArticles, setAllArticles] = useState([]);
    const router = useRouter();
    const [themes, setThemes] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState('');

    const fetchThemes = async () => {
        const { data, error } = await fetchThemesService();
        if (error) {
            console.error('Erreur lors du chargement des thèmes:', error);
        } else {
            setThemes(data);
        }
    };
    const fetchArticles = async () => {
        let { data: articles, error } = await fetchArticlesService()
        if (error) {
            console.error('Erreur de récupération :', error);
        } else {
            setAllArticles(articles);
        }
    };

    useEffect(() => {
        if (!loading && user && !user.is_admin) {
            router.push('/');
        }
    }, [loading, user, router]);

    useEffect(() => {

        fetchThemes();
        fetchArticles();
    }, []);

    if (loading || !user) {
        return <p className="text-center text-gray-600 mt-8">Chargement...</p>;
    }

    const fetchArticlesLastDay = async () => {
        const dateLimite = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const { data: articles, error } = await fetchArticlesSinceService(dateLimite)
        if (error) {
            console.error('Erreur de récupération :', error);
        } else {
            setAllArticles(articles);
        }
    };

    const fetchArticlesLastSevenDays = async () => {
        const dateLimite = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

        const { data: articles, error } = await fetchArticlesSinceService(dateLimite)
        if (error) {
            console.error('Erreur de récupération :', error);
        } else {
            setAllArticles(articles);
        }
    };

    const fetchArticlesLastThirtyDays = async () => {
        const dateLimite = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

        const { data: articles, error } = await fetchArticlesSinceService(dateLimite)
        if (error) {
            console.error('Erreur de récupération :', error);
        } else {
            setAllArticles(articles);
        }
    };

    const fetchArticlesLastYears = async () => {
        const dateLimite = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();

        const { data: articles, error } = await fetchArticlesSinceService(dateLimite)
        if (error) {
            console.error('Erreur de récupération :', error);
        } else {
            setAllArticles(articles);
        }
    };

    const handleSelectChange = async (e) => {
        const theme = e.target.value;
        setSelectedTheme(theme);
        if(theme){
            const { data: articles, error } = await fetchArticlesByThemeService(theme)
            if (error) {
                console.error('Erreur de récupération :', error);
            } else {
                setAllArticles(articles);
            }
        }else{
            await fetchArticles();
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r px-6 py-8 hidden md:block">
                <div className="text-xl font-semibold text-gray-700 mb-10">Dashboard</div>
                <nav className="space-y-4 text-gray-700">
                    <a href="/admin" className="block hover:text-indigo-600 p-2">Dashboard</a>
                    <a href="/admin/articles" className="block hover:text-indigo-600 p-2 bg-gray-100">Contenu</a>
                    <a href="/admin/user" className="block hover:text-indigo-600 p-2">Utilisateurs</a>
                </nav>
            </aside>
        
            {/* Main content */}
            <main className="flex-1 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl text-gray-700 font-bold">Bienvenue, {user.nickname}</h1>
                        <p className="text-gray-500 text-sm">Voici un aperçu du trafic de votre site et des utilisateurs actifs.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="font-medium text-gray-700">{user.nickname}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <img src={`https://stmouhqxlajaofnzgeup.supabase.co/storage/v1/object/public/media/${user.avatar}`} alt="Avatar Preview" className="object-cover w-10 h-10 rounded-full" />
                    </div>
                </div>

                {/* Filtres */}
                <div className="mb-4 flex gap-2">
                    <button className="px-3 py-1 text-sm border text-gray-500 rounded-md bg-white hover:bg-gray-100" onClick={() => fetchArticles()}>Tout</button>
                    <button className="px-3 py-1 text-sm border text-gray-500 rounded-md bg-white hover:bg-gray-100" onClick={() => fetchArticlesLastYears()}>12 mois</button>
                    <button className="px-3 py-1 text-sm border text-gray-500 rounded-md bg-white hover:bg-gray-100" onClick={() => fetchArticlesLastThirtyDays()}>30 jours</button>
                    <button className="px-3 py-1 text-sm border text-gray-500 rounded-md bg-white hover:bg-gray-100" onClick={() => fetchArticlesLastSevenDays()}>7 jours</button>
                    <button className="px-3 py-1 text-sm border text-gray-500 rounded-md bg-white hover:bg-gray-100" onClick={() => fetchArticlesLastDay()}>24 heures</button>
                    <select
                        className="border rounded-md p-2 bg-white text-gray-500 text-sm w-auto"
                        value={selectedTheme}
                        onChange={handleSelectChange}
                    >
                        <option value="">-- Choisir un thème --</option>
                        {themes.map((theme) => (
                        <option key={theme.id} value={theme.id}>
                            {theme.name}
                        </option>
                        ))}
                    </select>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {allArticles.map((article) => (
                        <div key={article.id} className="bg-white border rounded-lg p-4 shadow-sm">
                            <div className="h-32 bg-gray-200 rounded mb-4" />
                            <p className="text-indigo-600 text-sm font-medium mb-1">{article.articles_created_by_fkey?.nickname ?? 'Auteur inconnu'} • {new Date(article.created_at).toLocaleString("fr-FR", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}</p>
                            <h3 className="text-lg font-semibold mb-1 text-gray-700">{article.title}</h3>
                             <p className="text-gray-500 text-sm mb-3">
                                {article.content.length > 200 ? article.content.slice(0, 200) + "..." : article.content}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">{article.themes?.name}</span>
                                <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700" onClick={() => router.push(`edit/${article.id}`)}>
                                    Voir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
