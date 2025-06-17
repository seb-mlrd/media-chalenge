'use client';

import { useAuth } from '../../context/AuthContext';
import LogoutButton from '@/components/logoutButton';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <p>Chargement...</p>;

  if (!user) return <p>Non connecté</p>;

  return (
    <div>
      <h1>Bienvenue, {user.nickname}</h1>
      {user.is_admin && <p>Vous êtes administrateur 🎉</p>}
      <LogoutButton />
    </div>
  );
}
