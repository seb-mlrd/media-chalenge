'use client'

import { useRouter, usePathname } from 'next/navigation'
import { FaHome, FaUser, FaRegHeart } from 'react-icons/fa'

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
      <button
        onClick={() => router.push('/')}
        className={`${
          pathname === '/' ? 'text-[#9992FF]' : 'text-gray-600'
        }`}
      >
        <FaHome className="text-2xl" />
      </button>

      <button
        onClick={() => router.push('/favorites')}
        className={`${
          pathname === '/favorites' ? 'text-[#9992FF]' : 'text-gray-600'
        }`}
      >
        <FaRegHeart className="text-2xl" />
      </button>

      <button
        onClick={() => router.push('/profile')}
        className={`${
          pathname === '/profile' ? 'text-[#9992FF]' : 'text-gray-600'
        }`}
      >
        <FaUser className="text-2xl" />
      </button>
    </nav>
  )
}
