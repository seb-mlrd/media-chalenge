'use client';

import { useAuth } from '@/context/AuthContext';
import LogoutButton from "@/components/LogoutButton";
import EditButton from "@/components/EditButton";
import { useRouter } from 'next/navigation';
import { FaApple, FaFacebookF, FaGoogle, FaTwitter } from 'react-icons/fa';
import Loader from '@/components/Loader'

// import { signInWithProvider } from '../lib/authHelpers';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-3xl shadow-md w-[350px] text-center">
        <div className="h-40 bg-gray-300 rounded-md mb-6" />
        <h1 className="text-xl font-semibold">PRESHOT</h1>
        <p className="text-gray-600 mb-6">Votre coup d’avance</p>

        {user ? (
          <>
            <h2 className="text-lg mb-4">Bienvenue {user.nickname}</h2>
            {user.is_admin && <p className="mb-2 text-green-600">Vous êtes administrateur 🎉</p>}
            <LogoutButton />
            <EditButton />
          </>
        ) : (
          <>
             {/* Bouton inscription */}
            <button
              onClick={() => router.push('/register')}
              className="w-full bg-[#5C19F5] text-white py-3 rounded-full font-semibold mb-4"
            >
              Je m'inscris
            </button>

            <div className="flex items-center justify-center my-4 text-gray-400 text-sm">
              <span className="border-t border-gray-300 flex-grow mr-2" />
              OU CONTINUER VIA
              <span className="border-t border-gray-300 flex-grow ml-2" />
            </div>

            <div className="flex justify-between items-center gap-3 mb-6">
  <button
    className="bg-black text-white p-3 rounded-full"
    onClick={() => console.log("Connexion avec Apple")}
  >
    <FaApple />
  </button>
  <button
    className="bg-[#0779E4] text-white p-3 rounded-full"
    onClick={() => console.log("Connexion avec Facebook")}
  >
    <FaFacebookF />
  </button>
  <button
    className="bg-[#F4F6F7] text-blue p-3 rounded-full"

    onClick={() => console.log("Connexion avec Google")}
  >
    <FaGoogle />
  </button>
  <button
    className="bg-[#404040] text-white p-3 rounded-full"
    onClick={() => console.log("Connexion avec Twitter")}
  >
    <FaTwitter />
  </button>
</div>


            <p className="text-sm">
              Déja inscrit(e) ?{' '}
              <span
                className="text-gray-600 underline cursor-pointer"
                onClick={() => router.push('/login')}
              >
                Je me connecte
              </span>
            </p>

            <p className="text-xs text-gray-400 mt-4">
              En vous inscrivant, vous acceptez nos{' '}
              <span className="underline">Conditions d’utilisation</span>  et notre{' '}
              <span className="underline">Politique de confidentialité</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
