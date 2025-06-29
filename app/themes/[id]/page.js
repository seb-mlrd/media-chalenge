'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FaArrowLeft, FaRegBell, FaPlayCircle, FaSearch } from 'react-icons/fa'

export default function ThemePage({ params }) {
  const { id } = params
  const router = useRouter()
  const [theme, setTheme] = useState(null)
  const [articles, setArticles] = useState([])
  const [podcasts, setPodcasts] = useState([])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      const { data: themeData, error: themeError } = await supabase
        .from('themes')
        .select('*')
        .eq('id', id)
        .single()

      if (themeError) {
        console.error('Erreur chargement thème:', themeError)
        setLoading(false)
        return
      }
      setTheme(themeData)

      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .eq('theme_id', id)

      if (articlesError) {
        console.error('Erreur chargement articles:', articlesError)
      } else {
        setArticles(articlesData || [])
      }

      const { data: podcastsData, error: podcastsError } = await supabase
        .from('podcasts')
        .select('*')
        .eq('theme_id', id)

      if (podcastsError) {
        console.error('Erreur chargement podcasts:', podcastsError)
      } else {
        setPodcasts(podcastsData || [])
      }

      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .eq('theme_id', id)

      if (videosError) {
        console.error('Erreur chargement vidéos:', videosError)
      } else {
        setVideos(videosData || [])
      }

      setLoading(false)
    }

    fetchData()
  }, [id])

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Chargement...</p>
      </div>
    )

  if (!theme)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p>Thème introuvable</p>
        <button
          className="mt-4 px-4 py-2 bg-[#9992FF] text-white rounded"
          onClick={() => router.push('/')}
        >
          Retour aux thèmes
        </button>
      </div>
    )

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.content && a.content.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  const filteredPodcasts = podcasts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filters = [
    { key: 'all', shortLabel: 'Tous' },
    { key: 'articles', shortLabel: 'Articles' },
    { key: 'podcasts', shortLabel: 'Podcasts' },
    { key: 'videos', shortLabel: 'Vidéos' },
  ]

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.push('/')}
          className="p-2 rounded hover:bg-gray-200"
          aria-label="Retour"
        >
          <FaArrowLeft size={20} />
        </button>

        <h1 className="text-xl font-bold">{theme.name}</h1>

        <button className="p-2 rounded hover:bg-gray-200" aria-label="Notifications">
          <FaRegBell size={20} />
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 mb-6 w-full max-w-xl mx-auto">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow outline-none text-sm sm:text-base"
        />
      </div>

      {/* Boutons de filtre responsive */}
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        {filters.map(({ key, shortLabel }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center justify-center rounded-full font-medium
              px-8 py-2 text-sm sm:text-base
              ${
                filter === key
                  ? 'bg-[#9992FF] text-white shadow-lg'
                  : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
              }`}
          >
            {shortLabel}
          </button>
        ))}
      </div>

      {/* Articles */}
      {(filter === 'all' || filter === 'articles') && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Articles</h2>
          {filteredArticles.length === 0 ? (
            <p>Aucun article pour ce thème.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-gray-100 p-4 rounded shadow flex flex-col justify-between"
                  style={{ minHeight: '350px' }}
                >
                  <div className="flex-grow" />
                  <div className="flex flex-col">
                    <h3 className="font-semibold">{article.title}</h3>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">{article.content}</p>
                    <button
                      className="mt-4 self-end text-blue-600 hover:underline"
                      onClick={() => router.push(`/articles/${article.id}`)}
                    >
                      Lire
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Podcasts */}
      {(filter === 'all' || filter === 'podcasts') && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Podcasts</h2>
          {filteredPodcasts.length === 0 ? (
            <p>Aucun podcast pour ce thème.</p>
          ) : (
            <div className="space-y-3">
              {filteredPodcasts.map((podcast) => (
                <div
                  key={podcast.id}
                  className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-100 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-sm">{podcast.title}</p>
                    <span className="text-xs text-gray-500">{podcast.duration} min</span>
                  </div>
                  <FaPlayCircle className="text-xl text-black mt-2 sm:mt-0" />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Vidéos */}
      {(filter === 'all' || filter === 'videos') && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Vidéos</h2>
          {filteredVideos.length === 0 ? (
            <p>Aucune vidéo pour ce thème.</p>
          ) : (
            <div className="space-y-3">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-100 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-sm">{video.title}</p>
                    <span className="text-xs text-gray-500">{video.duration} min</span>
                  </div>
                  <FaPlayCircle className="text-xl text-black mt-2 sm:mt-0" />
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
