'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FaArrowLeft, FaDownload, FaHeart } from 'react-icons/fa'
import { useAuth } from '@/context/AuthContext'
import { addArticleFavoriteService, deleteArticleFavoriteService } from '@/services/articlesService'

export default function ArticleVideoPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, loading } = useAuth();
  const [article, setArticle] = useState(null)
  const [theme, setTheme] = useState(null)
  const [liked, setLiked] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
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
      if (isNaN(articleId)) return

      const { data: articleData } = await supabase
        .from('articles')
        .select(`*, media:media!media_article_id_fkey(url, type)`)
        .eq('id', articleId)
        .single()

      setArticle(articleData || null)

      const { data: themeData } = await supabase
        .from('themes')
        .select('*')
        .eq('id', articleData?.theme_id)
        .single()
      setTheme(themeData || null)

      const { data: userData } = await supabase
        .from('profils')
        .select('id, avatar_url, nickname')
        .eq('id', articleData?.created_by)
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
      if (!currentUser) return setLiked(false)

      const articleId = Number(id)
      if (isNaN(articleId)) return setLiked(false)

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
    return <div className="min-h-screen flex justify-center items-center">Chargement...</div>

  if (!article)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p>Article introuvable</p>
        <button
          className="mt-4 px-4 py-2 bg-[#9992FF] text-white rounded"
          onClick={() => router.push('/')}
        >Retour à l&apos;accueil</button>
      </div>
    )

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="relative w-full h-[80vh] rounded-b-3xl overflow-hidden">
        {(() => {
          const videoMedia = article.media?.find(m => m.type === 'video')
          if (videoMedia) {
            return <video src={videoMedia.url} controls autoPlay muted loop className="w-full h-full object-cover rounded-b-3xl" />
          } else {
            return <img src={article.media?.find(m => m.type === 'image')?.url || '/default-image.jpg'} alt={article.title} className="w-full h-full object-cover rounded-b-3xl" />
          }
        })()}

        <div className="absolute top-4 left-4 bg-white/80 rounded-full p-2 cursor-pointer" onClick={() => router.push('/')}> <FaArrowLeft size={18} /> </div>

        <button onClick={async () => {
          const media = article.media?.find((m) => m.type === 'video')
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
        }} className="absolute top-4 right-4 bg-white/80 rounded-full p-2">
          <FaDownload size={18} />
        </button>

        <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-xl space-y-1">
          <div className="text-xs font-medium bg-[#9992FF] text-white px-2 py-1 rounded-md w-fit">{theme?.name || 'Thème inconnu'}</div>
          <h1 className="text-xl font-bold">{article.title}</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4 px-4 mt-4">
        <img src={avatarUrl || '/default-avatar.png'} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
        <p className="font-medium">{user?.nickname || 'Auteur inconnu'}</p>
      </div>

      <div className="px-4 mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">{article.content}</div>

      <hr className="my-6 border-t border-gray-300 dark:border-gray-700 mx-auto" style={{ width: '8cm' }} />

      <div className="px-4 pb-6 flex justify-center">
        <div className="bg-[#9992FF] p-3 rounded-full cursor-pointer" onClick={toggleFavorite}>
          <FaHeart className={`text-xl transition-colors ${liked ? 'text-red-500' : 'text-white'}`} />
        </div>
      </div>
    </div>
  )
}
