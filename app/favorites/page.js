'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user) fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    const { data, error } = await supabase
      .from('favorites')
      .select('article:article_id (*, media:media!media_article_id_fkey(url, type))')
      .eq('profil_id', user.id);

    if (!error && data) {
      setFavorites(data.map(f => f.article));
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Chargement...
      </div>
    );

  return (
    <div className="min-h-screen bg-white px-4 pt-6 pb-20 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          className="bg-white rounded-full p-2 shadow"
          onClick={() => router.back()}
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-lg font-bold text-gray-800 dark:text-white">Mes Favoris</h1>
        <div className="w-8" />
      </div>

      {/* Articles List */}
      <div className="space-y-6">
        {favorites.map((article) => (
          <div key={article.id} className="rounded-xl overflow-hidden shadow-md">
            <div className="relative">
              <img
                src={article.media?.find(m => m.type === 'image')?.url || '/default-image.jpg'}
                alt={article.title}
                className="w-full h-52 object-cover"
              />
              <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">Sport</div>
              <div className="absolute bottom-2 right-2 text-white text-sm bg-black/60 px-2 py-0.5 rounded">4:31</div>
              <div className="absolute inset-0 flex justify-center items-center">
                <button className="bg-black/60 p-3 rounded-full">
                  <svg className="text-white w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 flex justify-between">
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                {article.title.length > 80 ? article.title.slice(0, 77) + '...' : article.title}
              </p>
              <button
                onClick={() => router.push(`/articles/${article.id}`)}
                className="text-[#9992FF] text-sm font-medium border border-[#9992FF] px-3 py-1 rounded-full"
              >
                Voir l&apos;article
              </button>
            </div>
          </div>
        ))}
        {favorites.length === 0 && (
          <p className="text-center text-gray-500 mt-20">Aucun favori pour le moment.</p>
        )}
      </div>
    </div>
  );
}
