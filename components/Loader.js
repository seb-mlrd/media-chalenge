'use client'

import { FaSpinner } from 'react-icons/fa'

export default function Loader() {
  return (
    <div className="text-center py-12 flex flex-col items-center gap-6">
      <FaSpinner className="animate-spin text-gray-500 dark:text-gray-400 text-5xl" />
      <p className="text-gray-700 dark:text-gray-300 text-2xl font-semibold">
        Chargement en cours ...
      </p>
    </div>
  )
}
