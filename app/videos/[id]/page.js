'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FaArrowLeft, FaDownload, FaHeart } from 'react-icons/fa'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'

dayjs.extend(relativeTime)
dayjs.locale('fr')

export default function ArticleVideoPage() {
  const { id } = useParams()
  const router = useRouter()
  const [article, setArticle] = useState(null)
  const [theme, setTheme] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      const articleId = Number(id)
      if (isNaN(articleId)) {
        console.error('ID article invalide')
        setLoading(false)
        return
      }
      // Récupérer article
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
        setLoading(false)
        return
      }
      setArticle(articleData)

      // Récupérer thème lié
      const { data: themeData, error: themeError } = await supabase
        .from('themes')
        .select('*')
        .eq('id', articleData.theme_id)
        .single()
      if (themeError) {
        console.warn('Erreur récupération thème:', themeError)
      }
      setTheme(themeData || null)

      // Récupérer auteur
      const { data: userData, error: userError } = await supabase
        .from('profils')
        .select('id, avatar_url, nickname')
        .eq('id', articleData.created_by)
        .single()
      if (userError) {
        console.warn('Erreur récupération auteur:', userError)
      }
      setUser(userData || null)

      // Générer URL publique de l'avatar
      if (userData?.avatar_url) {
        const { data: publicUrlData, error: publicUrlError } = supabase.storage
          .from('media')
          .getPublicUrl(userData.avatar_url)
        if (publicUrlError) {
          console.warn('Erreur récupération URL avatar:', publicUrlError)
          setAvatarUrl(null)
        } else {
          setAvatarUrl(publicUrlData.publicUrl)
        }
      } else {
        setAvatarUrl(null)
      }

      setLoading(false)
    }

    fetchData()
  }, [id])

  useEffect(() => {
    async function fetchUser() {
      // Récupérer user actuel via supabase.auth.getUser()
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Erreur récupération user:', error)
        setCurrentUser(null)
      } else {
        setCurrentUser(data.user)
      }
    }

    fetchUser()
  }, [])

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

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('profil_id', currentUser.id)
        .eq('article_id', articleId)
        .single()

      if (!error && data) {
        setLiked(true)
      } else {
        setLiked(false)
      }
    }

    checkFavorite()
  }, [currentUser, id])

  async function toggleFavorite() {
    if (!currentUser) {
      alert('Vous devez être connecté pour ajouter un favori.')
      return
    }

    const articleId = Number(id)
    if (isNaN(articleId)) {
      console.error("ID de l'article invalide")
      return
    }

    if (liked) {
      // Supprimer favori
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('profil_id', currentUser.id)
        .eq('article_id', articleId)

      if (error) {
        console.error('Erreur suppression favori:', error.message)
      } else {
        setLiked(false)
      }
    } else {
      // Ajouter favori
      const { error } = await supabase
        .from('favorites')
        .insert([{ profil_id: currentUser.id, article_id: articleId }])

      if (error) {
        console.error('Erreur ajout favori:', error.message)
      } else {
        setLiked(true)
      }
    }
  }

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
      {/* VIDEO + HEADER */}
      <div className="relative w-full h-[80vh] rounded-b-3xl overflow-hidden">
        {(() => {
          const videoMedia = article.media?.find(m => m.type === 'video')
          if (videoMedia) {
            return (
              <video
                src={videoMedia.url}
                controls
                autoPlay
                muted
                loop
                className="w-full h-full object-cover rounded-b-3xl"
              />
            )
          } else {
            return (
              <img
                src={article.media?.find(m => m.type === 'image')?.url || '/default-image.jpg'}
                alt={article.title}
                className="w-full h-full object-cover rounded-b-3xl"
              />
            )
          }
        })()}

        <div
          className="absolute top-4 left-4 bg-white/80 rounded-full p-2 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <FaArrowLeft size={18} />
        </div>
       
       
        <button
  onClick={async () => {
    const media =
      article.media?.find((m) => m.type === 'video')

    if (!media?.url) {
      alert('Aucun média à télécharger.')
      return
    }

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
    } catch (error) {
      console.error('Erreur lors du téléchargement :', error)
      alert("Le téléchargement a échoué.")
    }
  }}
  className="absolute top-4 right-4 bg-white/80 rounded-full p-2"
>
  <FaDownload size={18} />
</button>



        <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-xl space-y-1">
          <div className="text-xs font-medium bg-[#9992FF] text-white px-2 py-1 rounded-md w-fit">
            {theme?.name || 'Thème inconnu'}
          </div>
          <h1 className="text-xl font-bold">{article.title}</h1>
          <p className="text-gray-600 text-sm">🕒 {dayjs(article.created_at).fromNow()}</p>
        </div>
      </div>

      {/* INFOS AUTEUR */}
      <div className="flex items-center space-x-4 px-4 mt-4">
        <img
          src={avatarUrl || '/default-avatar.png'}
          alt={user?.nickname || 'Auteur inconnu'}
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="font-medium">{user?.nickname || 'Auteur inconnu'}</p>
      </div>

      {/* DESCRIPTION */}
      <div className="px-4 mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        {article.content}
      </div>

      {/* Ligne horizontale centrée */}
      <hr
        className="my-6 border-t border-gray-300 dark:border-gray-700 mx-auto"
        style={{ width: '8cm' }}
      />

      {/* FAVORI */}
      <div className="px-4 pb-6 flex justify-center">
        <div
          className="bg-[#9992FF] p-3 rounded-full cursor-pointer"
          onClick={toggleFavorite}
        >
          <FaHeart
            className={`text-xl transition-colors ${
              liked ? 'text-red-500' : 'text-white'
            }`}
          />
        </div>
      </div>
    </div>
  )
}
