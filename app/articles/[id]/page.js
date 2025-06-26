'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FaArrowLeft, FaDownload, FaHeart } from 'react-icons/fa'

export default function ArticlePage() {
  const { id } = useParams()
  const router = useRouter()

  const [article, setArticle] = useState(null)
  const [theme, setTheme] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      const { data: articleData } = await supabase.from('articles').select('*').eq('id', id).single()
      if (!articleData) {
        setLoading(false)
        return
      }
      setArticle(articleData)

      const { data: themeData } = await supabase.from('themes').select('*').eq('id', articleData.theme_id).single()
      const { data: userData } = await supabase.from('profils').select('id, avatar_url, nickname').eq('id', articleData.created_by).single()

      setTheme(themeData)
      setUser(userData)
      setLoading(false)
    }

    if (id) fetchData()
  }, [id])

  if (loading) return <div className="min-h-screen flex justify-center items-center">Chargement...</div>

  if (!article) return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <p>Article introuvable</p>
      <button className="mt-4 px-4 py-2 bg-[#9992FF] text-white rounded" onClick={() => router.push('/')}>
        Retour à l'accueil
      </button>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* IMAGE + HEADER */}
      <div className="relative w-full h-1/2">
        <img
          src={article.image_url || '/default-image.jpg'}
          alt={article.title}
          className="w-full h-full object-cover rounded-b-3xl"
        />
        <div className="absolute top-4 left-4 bg-white/80 rounded-full p-2 cursor-pointer" onClick={() => router.push('/')}>
          <FaArrowLeft size={18} />
        </div>
        <a
          href={article.image_url}
          download
          className="absolute top-4 right-4 bg-white/80 rounded-full p-2"
        >
          <FaDownload size={18} />
        </a>

        <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-xl space-y-1">
          <div className="text-xs font-medium bg-[#9992FF] text-white px-2 py-1 rounded-md w-fit">
            {theme?.name || 'Thème inconnu'}
          </div>
          <h1 className="text-xl font-bold">{article.title}</h1>
          <p className="text-gray-600 text-sm">⏱ 5 min</p>
        </div>
      </div>

      {/* INFOS AUTEUR */}
      <div className="flex items-center space-x-4 px-4 mt-4">
        <img
          src={user?.avatar_url || '/default-avatar.png'}
          alt={user?.nickname}
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="font-medium">{user?.nickname || 'Auteur inconnu'}</p>
      </div>

      {/* DESCRIPTION */}
      <div className="px-4 mt-6 text-gray-700 leading-relaxed">
        {article.content}
      </div>

      {/* FAVORI */}
      <div className="px-4 py-6 flex justify-end">
        <FaHeart className="text-2xl text-gray-400 hover:text-red-500 cursor-pointer" />
      </div>
    </div>
  )
}
