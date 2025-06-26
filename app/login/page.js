'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage('Le compte n\'existe pas : ' + error.message);
      return;
    }

    setMessage('Connexion réussie !');
    router.push('/');
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
            {/* <span
    onClick={() => router.back()}
    style={{ marginRight: 10, cursor: 'pointer', fontSize: 24, color: '#000' }}
    >
    &lt;
    </span> */}

          {/* <FaArrowLeft onClick={() => router.back()} style={{ marginRight: 10, cursor: 'pointer', color: '#000' }} /> */}
          <h1 style={{ fontSize: 26, fontWeight: 'bold', color: '#000', flex: 1, textAlign: 'center' }}>Connexion</h1>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 10,
              border: '1px solid #ccc',
              background: '#fff',
              borderRadius: 8,
              color: '#000',
            }}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: '100%',
              padding: 10,
              border: '1px solid #ccc',
              background: '#fff',
              borderRadius: 8,
              color: '#000',
            }}
          />

          {/* Lien mot de passe oublié */}
          <div>
            <span
              onClick={() => router.push('/forgot-password')}
              style={{
                color: '#333',
                fontSize: 14,
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Mot de passe oublié ?
            </span>
          </div>

          <div>
            <label style={{ fontSize: 14, color: '#333' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              Se souvenir de mes identifiants
            </label>
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            style={{
              padding: 12,
              background: '#000',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            Se connecter
          </button>
        </form>

        {/* Message d'erreur ou succès */}
        {message && (
          <p style={{ color: '#900', fontSize: 14, marginTop: 20 }}>{message}</p>
        )}

        {/* Lien vers inscription */}
        <p style={{ fontSize: 14, textAlign: 'center', color: '#333', marginTop: 30 }}>
          Vous n'avez pas de compte ?{' '}
          <span
            onClick={() => router.push('/register')}
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            S'inscrire
          </span>
        </p>
      </div>
    </main>
  );
}
