'use client'

export default function Error({ error }) {
  console.error(error)

  return (
    <div className="text-center p-8 text-red-600 dark:text-red-400">
      <h1 className="text-2xl font-bold">Erreur serveur (500)</h1>
      <p>Une erreur est survenue. Veuillez réessayer plus tard.</p>
    </div>
  )
}
