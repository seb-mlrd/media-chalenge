'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import NavBar from '@/components/NavBar'

export default function FavoritesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchFavorites = async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('article:article_id(*, media(*), themes(name))')
        .eq('profil_id', user.id)

      if (!error && data) {
        const expanded = data.flatMap(fav => {
          const hasVideo = fav.article.media?.some(m => m.type === 'video')
          const hasImage = fav.article.media?.some(m => m.type === 'image')

          if (hasVideo && hasImage) {
            return [
              { ...fav.article, _viewType: 'video' },
              { ...fav.article, _viewType: 'article' },
            ]
          }

          return [
            {
              ...fav.article,
              _viewType: hasVideo ? 'video' : 'article'
            }
          ]
        })
        setFavorites(expanded)
      }
      setLoading(false)
    }

    fetchFavorites()
  }, [user])

  if (loading) return <div className="p-4 text-center">Chargement...</div>
  if (favorites.length === 0) return <div className="p-4 text-center">
    Aucun favori trouvé
    <NavBar />
  </div>

  return (
    <div className="p-4 space-y-6">
      {favorites.map((article, index) => (
        <div key={article.id + '-' + index} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
          <div className="relative w-full h-48">
            {article._viewType === 'video' ? (
              <video
                src={article.media.find(m => m.type === 'video')?.url || '/default-video.mp4'}
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={article.media.find(m => m.type === 'image')?.url || '/default-image.jpg'}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-2 left-2 bg-[#9992FF] text-white text-xs px-2 py-1 rounded-full">
              {article.themes?.name || 'Sans thème'}
            </div>
            {article._viewType === 'video' ? (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                Vidéo
              </div>
            ) : (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                Article
              </div>
            )
          }
          </div>
          <div className="p-4 space-y-2">
            <h2 className="text-sm text-black font-semibold line-clamp-2">{article.title}</h2>
            <button
              onClick={() => router.push(
                article._viewType === 'video'
                  ? `/videos/${article.id}`
                  : `/articles/${article.id}`
              )}
              className="text-[#9992FF] text-sm font-medium border border-[#9992FF] px-3 py-1 rounded-full hover:bg-[#9992FF] hover:text-white transition"
            >
              Voir {article._viewType === 'video' ? 'la vidéo' : "l'article"}
            </button>
          </div>
        </div>
      ))}
      <NavBar />
    </div>
  )
}
