'use client'

import { useRouter, usePathname } from 'next/navigation'
import { FaHome, FaUser } from 'react-icons/fa'

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-14 z-50">
      <button
        onClick={() => router.push('/')}
        className={`flex flex-col items-center text-xs ${
          pathname === '/' ? 'text-[#9992FF]' : 'text-gray-600'
        }`}
      >
        <FaHome className="text-xl mb-1" />
        Accueil
      </button>
      <button
        onClick={() => router.push('/profile')}
        className={`flex flex-col items-center text-xs ${
          pathname === '/profile' ? 'text-[#9992FF]' : 'text-gray-600'
        }`}
      >
        <FaUser className="text-xl mb-1" />
        Profil
      </button>
    </nav>
  )
}

