'use client';

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FaRegBell, FaSearch, FaPlayCircle, FaTimes } from 'react-icons/fa'
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

export default function Home() {
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

  if (loading) return <Loader />;

  return (
    <div className="p-4 md:p-6 space-y-6 relative">
      {/* TOP BAR */}
      <div className="flex justify-between items-center">
        <img src="/logo.png" alt="Logo" className="h-16 md:h-20 w-auto" />
        <div className="flex items-center space-x-4">
          <FaRegBell className="text-xl" />
          <FaSearch className="text-xl cursor-pointer" onClick={() => setSearchOverlay(true)} />
        </div>
      </div>

      {/* WELCOME */}
      <h2 className="text-lg md:text-xl font-bold">Bonjour, {nickname}</h2>

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
                    <h4 className="font-semibold text-base">
                      {highlightText(article.title, searchTerm)}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {highlightText(article.content || '', searchTerm)}
                    </p>
                  </div>
                  <button className="ml-4 text-blue-600 hover:text-blue-800 font-bold text-2xl"
                    onClick={() => router.push(`/articles/${article.id}`)}>
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
      <div className="flex justify-center space-x-4 overflow-x-auto pb-2 max-w-full mx-auto">
        {themes.length > 0
          ? themes.map((theme) => (
              <div
                key={theme.id}
                className="flex flex-col items-center space-y-1 min-w-[56px] cursor-pointer"
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
      <h3 className="font-medium text-base md:text-lg mb-4">À lire sans scroller des heures</h3>
      <div
        ref={articlesRef}
        className="relative w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
        style={{
          paddingLeft: 'max(1rem, calc(50vw - 150px))',
          paddingRight: 'max(1rem, calc(50vw - 150px))',
          scrollPaddingLeft: 'max(1rem, calc(50vw - 150px))',
          scrollPaddingRight: 'max(1rem, calc(50vw - 150px))',
        }}
      >
        <div className="flex space-x-4">
          {themeFilteredArticles.map((article) => (
            <div
              key={article.id}
              className="snap-center flex-shrink-0 w-[80vw] max-w-[300px] p-4 rounded-xl shadow-lg flex flex-col justify-between bg-cover bg-center"
              style={{
                minHeight: '350px',
                backgroundImage: `url(${article.image_url || '/default-image.jpg'})`,
              }}
            >
              <div className="flex-grow" />
              <div className="flex flex-col">
                <span
                  className="text-xs font-medium text-white px-2 py-2 rounded-tl-lg rounded-tr-lg w-fit"
                  style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), #9992FF)' }}
                >
                  {getThemeName(article.theme_id)}
                </span>
                <div
                  className="p-4 inline-block max-w-full flex flex-col text-white rounded-tr-2xl rounded-bl-2xl rounded-br-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #9992FF 0%, #F7AD38 100%)',
                  }}
                >
                  <h4 className="font-semibold text-sm md:text-base">{article.title}</h4>
                  <p className="text-xs md:text-sm mt-1 line-clamp-2">{article.content}</p>
                  <button
                    className="mt-4 self-end text-white hover:underline text-sm"
                    onClick={() => router.push(`/articles/${article.id}`)}
                  >
                    Lire
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PODCASTS */}
      <h3 className="font-medium text-base md:text-lg">À écouter entre deux réunions</h3>
      <div className="space-y-3 mb-16">
        {podcasts.map((podcast) => (
          <div
            key={podcast.id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
          >
            <div>
              <p className="font-semibold text-sm md:text-base">{podcast.title}</p>
              <span className="text-xs text-gray-500">{podcast.duration} min</span>
            </div>
            <FaPlayCircle className="text-xl text-black" />
          </div>
        ))}
      </div>
    </div>
  );
}
