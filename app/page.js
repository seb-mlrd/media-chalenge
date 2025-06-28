'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FaBell, FaSearch, FaPlayCircle, FaTimes } from 'react-icons/fa'
import { FiArrowRight } from 'react-icons/fi'

import Loader from '../components/Loader'
import NavBar from '../components/NavBar'
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
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [articles, setArticles] = useState([])
  const [podcasts, setPodcasts] = useState([])
  const [themes, setThemes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [searchOverlay, setSearchOverlay] = useState(false)
  const [users, setUsers] = useState([])

  const articlesRef = useRef(null)

  const getThemeName = (id) => {
    const theme = themes.find((t) => t.id === id)
    return theme ? theme.name : 'Thème inconnu'
  }

  const getNickname = (id) => {
    const userProfile = users.find((u) => u.id === id)
    return userProfile ? userProfile.nickname : 'Inconnu'
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    const fetchContent = async () => {
      const { data: articlesData } = await supabase.from('articles').select('*')
      const { data: podcastData } = await supabase.from('podcasts').select('*')
      const { data: themeData } = await supabase.from('themes').select('*')
      const { data: usersData } = await supabase.from('profils').select('id, nickname')

      setArticles(articlesData || [])
      setPodcasts(podcastData || [])
      setThemes(themeData || [])
      setUsers(usersData || [])

      setLoadingProfile(false)
    }

    if (user) {
      fetchContent()
    }
  }, [user])

  if (loading || loadingProfile) return <Loader />

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.content && article.content.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const themeFilteredArticles = selectedTheme
    ? filteredArticles.filter((article) => article.theme_id === selectedTheme)
    : filteredArticles

  const nickname = user?.nickname || 'Utilisateur'

  return (
    <div className="p-4 space-y-6 relative">
      {/* TOP BAR */}
      <div className="flex justify-between items-center">
        <img src="/logo.png" alt="Logo" className="h-20 w-auto" />
        <div className="flex items-center space-x-4">
          <FaBell className="text-xl" />
          <FaSearch className="text-xl cursor-pointer" onClick={() => setSearchOverlay(true)} />
        </div>
      </div>

      {/* WELCOME */}
      <h2 className="text-xl font-bold">Bonjour, {nickname}</h2>
      <h2 className="text-xl font-light">Voici ce qu’on a déniché pour toi aujourd’hui.</h2>

      {/* SEARCH OVERLAY */}
      {searchOverlay && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-50 p-6 overflow-y-auto">
          <div className="flex items-center mb-6">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              autoFocus
              className="flex-grow text-lg outline-none border-b border-gray-300 pb-1"
              placeholder="Rechercher des articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaTimes
              className="ml-3 text-xl text-gray-600 cursor-pointer"
              onClick={() => {
                setSearchTerm('')
                setSearchOverlay(false)
              }}
            />
          </div>

          <div className="space-y-4">
            {themeFilteredArticles.length > 0 ? (
              themeFilteredArticles.map((article) => (
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
                      {highlightText(article.content || '', searchTerm)}
                    </p>
                  </div>
                  <button className="ml-4 text-blue-600 hover:text-blue-800 font-bold text-2xl">
                    <FiArrowRight />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">Aucun article trouvé.</p>
            )}
          </div>
        </div>
      )}

      {/* THEMES */}
      <div className="flex justify-between items-center">
        <span className="font-medium">Tes sujets du moment</span>
        {/* <button
          className="text-sm font-medium text-[#9992FF]"
          onClick={() => setSelectedTheme(null)}
        >
          Voir tout
        </button> */}
      </div>
      <div className="flex justify-center space-x-4 overflow-x-auto pb-2 max-w-full mx-auto">
        {themes.length > 0
          ? themes.map((theme) => (
              <div
                key={theme.id}
                className="flex flex-col items-center space-y-1 min-w-[56px] cursor-pointer"
                // onClick={() => setSelectedTheme(theme.id)}

                onClick={() => router.push(`/themes/${theme.id}`)}

              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor:
                      selectedTheme === null
                        ? theme.color || '#9992FF'
                        : selectedTheme === theme.id
                        ? theme.color || '#9992FF'
                        : '#E0E0E0',
                  }}
                >
                  <span
                    className={`text-sm font-semibold ${
                      selectedTheme !== null && selectedTheme !== theme.id
                        ? 'text-gray-400'
                        : 'text-white'
                    }`}
                  >
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

      {/* ARTICLES */}
      <h3 className="font-medium  mb-4">À lire sans scroller des heures</h3>
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
          {themeFilteredArticles.map((article) => (
            <div
              key={article.id}
              className="snap-center flex-shrink-0 w-[300px] bg-gray-100 p-4 rounded-xl shadow-lg flex flex-col justify-between"
              style={{ minHeight: '350px' }}
            >
              <div className="flex-grow" />
              <div className="flex flex-col">
                <h4 className="font-semibold">{article.title}</h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{article.content}</p>
                <div className="mt-2 text-xs text-gray-500 space-y-1">  
                </div>
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
      </div>

      {/* PODCASTS */}
      <h3 className="font-medium">À écouter entre deux réunions</h3>
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

      <NavBar />
    </div>
  )
}






