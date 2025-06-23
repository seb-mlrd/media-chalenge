'use client';

import { useAuth } from '../context/AuthContext';
import LogoutButton from "../components/LogoutButton";
import { useRouter } from 'next/navigation';

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();
    if (loading) return <p>Chargement...</p>;
  
    return (
      <div>
        <h1>Bienvenue {user && user.nickname}</h1>
        {user?.is_admin && <p>Vous êtes administrateur 🎉</p>}
        {user ?
          <LogoutButton />
        :
        <div>
          <button onClick={() => router.push('/register')} style={{ padding: 10, marginInline: 20, marginTop: 20, cursor: 'pointer' }}>
            Inscription
          </button>
          <button onClick={() => router.push('/login')} style={{ padding: 10, marginInline: 20, marginTop: 20, cursor: 'pointer' }}>
            Connexion
          </button>
        </div>
      }
      </div>
    );
}
