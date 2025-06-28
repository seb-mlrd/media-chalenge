'use client';

import { useAuth } from '../../context/AuthContext';
import LogoutButton from "../../components/LogoutButton";
import EditButton from "../../components/EditButton";
import { useRouter } from 'next/navigation';
import { FaApple, FaFacebookF, FaGoogle, FaTwitter } from 'react-icons/fa';
import Loader from '../../components/Loader';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-3xl shadow-md w-[350px] text-center overflow-hidden">
        <div className="h-[380px] w-full">
          <img
            src="/index.png"
            alt="PRESHOT"
            className="h-full w-full object-cover"
          />
        </div>

        {/* CONTENU texte et boutons */}
        <div className="p-6">
          <h1 className="text-xl font-semibold">PRESHOT</h1>
          <p className="text-gray-600 mb-6">Votre coup d’avance</p>

          {user ? (
            <>
              <h2 className="text-lg mb-4">Bienvenue {user.nickname}</h2>
              {user.is_admin && (
                <p className="mb-2 text-green-600">Vous êtes administrateur 🎉</p>
              )}
              <LogoutButton />
              <EditButton />
            </>
          ) : (
            <>
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
                <button className="bg-black text-white p-3 rounded-full">
                  <FaApple />
                </button>
                <button className="bg-[#0779E4] text-white p-3 rounded-full">
                  <FaFacebookF />
                </button>
                <button className="bg-[#F4F6F7] text-blue p-3 rounded-full">
                  <FaGoogle />
                </button>
                <button className="bg-[#404040] text-white p-3 rounded-full">
                  <FaTwitter />
                </button>
              </div>

              <p className="text-sm">
                Déjà inscrit(e) ?{' '}
                <span
                  className="text-gray-600 underline cursor-pointer"
                    style={{ color: '#9992FF' }}
                  onClick={() => router.push('/login')}
                >
                  Je me connecte
                </span>
              </p>

<p className="text-xs mt-4 text-center">
  <span className="text-black font-medium">
    En vous inscrivant, vous acceptez nos{' '}
  </span>
  <span className="underline text-gray-400">Conditions d’utilisation</span>{' '}
  <span className="text-black font-medium">et notre </span>
  <span className="underline text-gray-400">Politique de confidentialité</span>
</p>

            </>
          )}
        </div>
      </div>
    </div>
  );
}
