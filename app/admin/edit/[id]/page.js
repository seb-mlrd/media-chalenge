'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaSave } from "react-icons/fa";
import { fetchThemesService } from "@/services/articlesService";
export default function EditArticle() {
  const { id } = useParams();
  const router = useRouter();
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState();
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState({
    title: '',
    theme: '',
    content: '',
  });

  const fetchThemes = async () => {
    const { data: themesData, error } = await fetchThemesService();
    if (error) {
        console.error('Erreur lors du chargement des thèmes:', error);
    } else {
        setThemes(themesData);
    }
  };

    useEffect(() => {
    const fetchArticle = async () => {
        const { data : articleData, error } = await supabase
        .from("articles")
        .select("*, themes(name)")
        .eq("id", id)
        .single();

        if (error) {
        console.error("Erreur de chargement :", error);
        } else {
            setArticle(articleData);
            setSelectedTheme(articleData.theme_id);
        }

        setLoading(false);
    };

    if (id) fetchArticle();
    fetchThemes();
    }, [id]);

  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase
            .from("articles")
            .update({
            title: article.title,
            theme_id: selectedTheme,
            content: article.content,
            updated_at: new Date(),
            })
            .eq("id", id);

        if (error) {
            console.error("Erreur de mise à jour :", error);
        } else {
            router.push("/admin/articles");
        }
    };

  if (loading) return <p className="text-center mt-10 text-gray-600">Chargement...</p>;

  const handleSelectChange = async (e) => {
      const theme = e.target.value;
      setSelectedTheme(theme);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Modifier l’article</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-600">Titre</label>
          <input
            type="text"
            id="title"
            name="title"
            value={article.title}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
            <select
            className="border rounded-md p-2 bg-white text-gray-700 text-sm w-full"
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

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-600">Contenu</label>
          <textarea
            id="content"
            name="content"
            rows="6"
            value={article.content}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            <FaSave /> Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
}
