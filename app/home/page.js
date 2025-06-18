'use client';

import { useAuth } from '../../context/AuthContext';
import LogoutButton from '../../components/LogoutButton';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <p>Chargement...</p>;

  if (!user) return <p>Non connecté</p>;

  return (
    <div>
      <h1>Bienvenue, {user.nickname}</h1>
      {user.is_admin && <p>Vous êtes administrateur 🎉</p>}

      <button
        onClick={() => router.push('/profile/edit')}
        style={{
          marginTop: '10px',
          padding: '8px 12px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Modifier mon profil
      </button>

      <LogoutButton />
    </div>
  );
}
