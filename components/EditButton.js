'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function EditButton() {
  const { edit } = useAuth();
  const router = useRouter();

  const handleEdit = async () => {
    router.push('/profile/edit'); 
  };

  return (
    <button onClick={handleEdit} style={{ padding: 10, marginTop: 20, cursor: 'pointer' }}>
      Modifier mon profil
    </button>
  );
}
