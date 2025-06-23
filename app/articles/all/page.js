'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AllArticles() {
    const [allArticles, setAllArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchArticles = async () => {
            let { data: articles, error } = await supabase
                .from('articles')
                .select('*');

            if (error) {
                console.error('Erreur de récupération :', error);
            } else {
                setAllArticles(articles);
            }

            setLoading(false);
        };

        fetchArticles();
    }, []);

    const handleDelete = async (articleId) => {
        const { error } = await supabase
            .from('articles')
            .delete()
            .eq('id', articleId);

        if (error) {
            console.error('Erreur de suppression :', error);
        } else {
            setAllArticles(prev => prev.filter(article => article.id !== articleId));
        }
    };

    if (loading) return <p className="text-center text-gray-600 mt-8">Chargement...</p>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des articles</h1>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b">Titre</th>
                        <th className="py-2 px-4 border-b">Contenu</th>
                        <th className="py-2 px-4 border-b text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {allArticles.map((article) => (
                        <tr key={article.id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">{article.title}</td>
                            <td className="py-2 px-4 border-b">{article.content}</td>
                            <td className="py-2 px-4 border-b text-center space-x-2">
                                <button
                                    onClick={() => router.push(`edit/${article.id}`)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(article.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
