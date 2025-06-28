'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    router.push('/home');
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
            

          <FaArrowLeft onClick={() => router.back()} style={{ marginRight: 10, cursor: 'pointer', color: '#000' }} />
          <h1 style={{ fontSize: 26, fontWeight: 'bold', color: '#000', flex: 1, textAlign: 'center' }}>Connexion</h1>

        </div>
          <h1 style={{ fontSize: 26, fontWeight: 'Semi-bold', color: '#000', flex: 1 }}>Content de te revoir</h1>
          <h2 style={{ fontSize: 18,  color: '#000', flex: 1, marginBottom: 20, }}>Connecte-toi pour accéder à ton flux personnalisé.</h2>

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


          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '10px 40px 10px 10px',
                border: '1px solid #ccc',
                background: '#fff',
                borderRadius: 8,
                color: '#000',
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#888',
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
  <span style={{ fontSize: 14, color: '#333' }}>Mémoriser mes identifiants</span>
  <label style={{ position: 'relative', display: 'inline-block', width: 40, height: 22 }}>
    <input
      type="checkbox"
      checked={rememberMe}
      onChange={(e) => setRememberMe(e.target.checked)}
      style={{ opacity: 0, width: 0, height: 0 }}
    />
    <span
      style={{
        position: 'absolute',
        cursor: 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: rememberMe ? '#FFAE27' : '#ccc',
        transition: '.4s',
        borderRadius: 34,
      }}
    />
    <span
      style={{
        position: 'absolute',
        content: '""',
        height: 16,
        width: 16,
        left: rememberMe ? '20px' : '4px',
        bottom: '3px',
        backgroundColor: 'white',
        transition: '.4s',
        borderRadius: '50%',
      }}
    />
  </label>
</div>


          {/* Bouton de connexion */}
          <button
            type="submit"
            style={{
              padding: 12,
              background: '#5C19F5',
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
