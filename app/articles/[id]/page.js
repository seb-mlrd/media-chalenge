'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FaArrowLeft, FaDownload, FaHeart } from 'react-icons/fa'
import { FiMaximize, FiMinimize } from 'react-icons/fi'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'
import { addArticleFavoriteService, deleteArticleFavoriteService } from '@/services/articlesService'
import { useAuth } from '@/context/AuthContext'

dayjs.extend(relativeTime)
dayjs.locale('fr')

export default function ArticlePage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, loading } = useAuth();
  const [article, setArticle] = useState(null)
  const [theme, setTheme] = useState(null)
  const [liked, setLiked] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    const { data, error } = await supabase
      .from('favorites')
      .select('article_id')
      .eq('profil_id', user.id);

    if (!error && data) {
      setFavorites(data.map(f => f.article_id));
    }
  };

  const isFavorited = (articleId) => favorites.includes(articleId);

  useEffect(() => {
    async function fetchData() {
      const articleId = Number(id)
      if (isNaN(articleId)) {
        console.error('ID article invalide')
        return
      }

      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .select(`
            *,
            media:media!media_article_id_fkey(
              url,
              type
            )
          `)
        .eq('id', articleId)
        .single()

      if (articleError || !articleData) {
        console.error('Erreur récupération article:', articleError)
        return
      }
      setArticle(articleData)

      const { data: themeData } = await supabase
        .from('themes')
        .select('*')
        .eq('id', articleData.theme_id)
        .single()
      setTheme(themeData || null)

      const { data: userData } = await supabase
        .from('profils')
        .select('id, avatar_url, nickname')
        .eq('id', articleData.created_by)
        .single()

      if (userData?.avatar_url) {
        const { data: publicUrlData } = supabase.storage
          .from('media')
          .getPublicUrl(userData.avatar_url)
        setAvatarUrl(publicUrlData.publicUrl)
      } else {
        setAvatarUrl(null)
      }
    }

    fetchData()
  }, [id])

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    async function checkFavorite() {
      if (!currentUser) {
        setLiked(false)
        return
      }

      const articleId = Number(id)
      if (isNaN(articleId)) {
        setLiked(false)
        return
      }

      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('profil_id', currentUser.id)
        .eq('article_id', articleId)
        .single()

      setLiked(!!data)
    }

    checkFavorite()
  }, [currentUser, id])

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullScreen(true)
    } else {
      document.exitFullscreen()
      setIsFullScreen(false)
    }
  }

  const toggleFavorite = async () => {
    const articleId = Number(id);
    if (isFavorited(articleId)) {
      const { error } = await deleteArticleFavoriteService(articleId, user.id)
      setLiked(false)
      if (!error) {
        setFavorites(favorites.filter(id => id !== articleId));
      }
    } else {
      const { error } = await addArticleFavoriteService(articleId, user.id)
      setLiked(true)
      if (!error) {
        setFavorites([...favorites, articleId]);
      }
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Chargement...
      </div>
    )

  if (!article)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p>Article introuvable</p>
        <button
          className="mt-4 px-4 py-2 bg-[#9992FF] text-white rounded"
          onClick={() => router.push('/')}
        >
          Retour à l&apos;accueil
        </button>
      </div>
    )

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="relative w-full h-[50vh]">
        <img
          src={article.media?.find(m => m.type === 'image')?.url || '/default-image.jpg'}
          alt={article.title}
          className="w-full h-full object-cover rounded-b-3xl"
        />

        <div
          className="absolute top-4 left-4 bg-white/80 rounded-full p-2 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <FaArrowLeft size={18} />
        </div>

        <div className="absolute top-4 right-4 flex space-x-2 bg-white/80 rounded-full p-2">
          <button
            onClick={async () => {
              const media = article.media?.find((m) => m.type === 'image')
              if (!media?.url) return alert('Aucun média à télécharger.')
              try {
                const response = await fetch(media.url)
                const blob = await response.blob()
                const blobUrl = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = blobUrl
                link.download = media.url.split('/').pop() || 'media'
                document.body.appendChild(link)
                link.click()
                link.remove()
                window.URL.revokeObjectURL(blobUrl)
              } catch (err) {
                console.error('Erreur téléchargement :', err)
                alert("Le téléchargement a échoué.")
              }
            }}
            className="p-1"
          >
            <FaDownload size={18} />
          </button>

          <button onClick={toggleFullScreen} className="p-1">
            {isFullScreen ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
          </button>
        </div>

        <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-xl space-y-1">
          <div className="text-xs font-medium bg-[#9992FF] text-white px-2 py-1 rounded-md w-fit">
            {theme?.name || 'Thème inconnu'}
          </div>
          <h1 className="text-xl font-bold">{article.title}</h1>
          <p className="text-gray-600 text-sm">🕒 {dayjs(article.created_at).fromNow()}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 px-4 mt-4">
        <img
          src={avatarUrl || '/default-avatar.png'}
          alt={article?.articles_created_by_fkey?.nickname || 'Auteur inconnu'}
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="font-medium">{article?.articles_created_by_fkey?.nickname || 'Auteur inconnu'}</p>
      </div>

      <div className="px-4 mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        {article.content}
      </div>

      <hr className="my-6 border-t border-gray-300 dark:border-gray-700 mx-auto" style={{ width: '8cm' }} />

      <div className="px-4 pb-6 flex justify-center">
        <div
          className="bg-[#9992FF] p-3 rounded-full cursor-pointer"
          onClick={toggleFavorite}
        >
          <FaHeart className={`text-xl transition-colors ${liked ? 'text-red-500' : 'text-white'}`} />
        </div>
      </div>
    </div>
  )
}