'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <button onClick={handleLogout} style={{ padding: 10, marginTop: 20, cursor: 'pointer' }}>
      🔓 Se déconnecter
    </button>
  );
}