'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FaBars, FaBell, FaSearch, FaPlayCircle } from 'react-icons/fa'
import Loader from '../components/Loader';
import { useAuth } from '@/context/AuthContext'

function highlightText(text, highlight) {
  if (!highlight) return text
  const regex = new RegExp(`(${highlight})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="text-blue-600 font-semibold">
        {part}
      </span>
    ) : (
      part
    )
  )
}

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter()
  const [articles, setArticles] = useState([])
  const [podcasts, setPodcasts] = useState([])
  const [themes, setThemes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const articlesRef = useRef(null)
  const [ready, setReady] = useState(false); // pour contrôler l'affichage après redirection

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        setReady(true); // l'utilisateur est présent, on peut afficher la page
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!ready) return

    const fetchData = async () => {
      try {
        const [articlesRes, podcastRes, themeRes] = await Promise.all([
          supabase.from('articles').select('*'),
          supabase.from('podcasts').select('*'),
          supabase.from('themes').select('*')
        ])

        if (articlesRes.error) throw articlesRes.error
        if (podcastRes.error) throw podcastRes.error
        if (themeRes.error) throw themeRes.error

        setArticles(articlesRes.data || [])
        setPodcasts(podcastRes.data || [])
        setThemes(themeRes.data || [])
      } catch (err) {
        console.error('Erreur fetch data :', err)
      }
    }

    fetchData()
  }, [ready])

  if (loading || !ready) {
    return <Loader />;
  }
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.description && article.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="p-4 space-y-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <FaBars className="text-xl" />
        <h1 className="text-lg font-semibold">Home</h1>
        <FaBell className="text-xl" />
      </div>

      {/* Welcome */}
      <h2 className="text-xl font-light">Hello, {user.nickname}</h2>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          className="bg-transparent outline-none w-full text-sm"
          placeholder="Recherche"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Themes */}
      <div className="flex justify-between items-center">
        <span className="font-medium">Thèmes</span>
        <a href="#" className="text-blue-500 text-sm">View all</a>
      </div>
      <div className="flex justify-center space-x-4 overflow-x-auto pb-2 max-w-full mx-auto">
        {themes.length > 0
          ? themes.map((theme) => (
              <div
                key={theme.id}
                className="flex flex-col items-center space-y-1 min-w-[56px]"
              >
                <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-700">
                    {theme.name ? theme.name[0].toUpperCase() : '?'}
                  </span>
                </div>
                <span className="text-xs text-gray-600 text-center break-words max-w-[56px]">
                  {theme.name}
                </span>
              </div>
            ))
          : [1, 2, 3].map((_, idx) => (
              <div key={idx} className="w-14 h-14 rounded-full bg-gray-200" />
            ))}
      </div>

      {/* Articles */}
      <h3 className="font-medium text-center mb-4">Articles</h3>

      {searchTerm.trim() === '' ? (
        <div
          ref={articlesRef}
          className="relative w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{
            paddingLeft: 'calc(50vw - 150px)',
            paddingRight: 'calc(50vw - 150px)',
            scrollPaddingLeft: 'calc(50vw - 150px)',
            scrollPaddingRight: 'calc(50vw - 150px)',
          }}
        >
          <div className="flex space-x-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="snap-center flex-shrink-0 w-[300px] bg-gray-100 p-4 rounded-xl shadow-lg flex flex-col justify-between"
                style={{ minHeight: '250px' }}
              >
                <div className="flex-grow" />
                <div className="flex flex-col">
                  <h4 className="font-semibold">{article.title}</h4>
                  <div className="flex justify-between items-start mt-1">
                    <p className="text-sm text-gray-600 flex-1 pr-2">{article.description}</p>
                    <button className="text-blue-500 text-sm font-medium whitespace-nowrap">
                      Lire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <div
                key={article.id}
                className="flex items-center w-full bg-gray-100 p-4 rounded-lg shadow"
              >
                <img
                  src={article.image_url || '/default-image.jpg'}
                  alt={article.title}
                  className="w-24 h-16 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex flex-col ml-4 flex-grow">
                  <h4 className="font-semibold text-lg">
                    {highlightText(article.title, searchTerm)}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {highlightText(article.description || '', searchTerm)}
                  </p>
                </div>
                <button className="ml-4 text-blue-600 hover:text-blue-800 font-bold text-2xl">
                  &gt;
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Aucun article trouvé.</p>
          )}
        </div>
      )}

      {/* Podcasts */}
      <h3 className="font-medium">Podcasts</h3>
      <div className="space-y-3">
        {podcasts.map((podcast) => (
          <div
            key={podcast.id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
          >
            <div>
              <p className="font-semibold text-sm">{podcast.title}</p>
              <span className="text-xs text-gray-500">{podcast.duration} min</span>
            </div>
            <FaPlayCircle className="text-xl text-black" />
          </div>
        ))}
      </div>
    </div>
  )
}