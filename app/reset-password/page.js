'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage('');

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage('Erreur : ' + error.message);
    } else {
      setMessage('Mot de passe mis à jour avec succès !');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  // Optionnel : s'assurer que l'utilisateur est bien en mode "recovery"
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setMessage('Lien invalide ou expiré.');
      }
    });
  }, []);

  return (
    <main style={{ maxWidth: 400, margin: '50px auto', padding: 20 }}>
      <h1 style={{ fontSize: 20, fontWeight: 'bold', color: '#000', flex: 1, textAlign: 'center' }}>
      Réinitialiser le mot de passe</h1>

      <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: 10,
            border: '1px solid #ccc',
            borderRadius: 4,
          }}
        />
        <button type="submit" style={{
          padding: 10,
          background: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}>
          Réinitialiser
        </button>
        {message && <p style={{ textAlign: 'center', color: 'gray' }}>{message}</p>}
      </form>
    </main>
  );
}
