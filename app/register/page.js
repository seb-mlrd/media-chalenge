'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaApple, FaFacebookF, FaGoogle } from 'react-icons/fa';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');

  const patternEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const patternPassword = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');

    const isEmailValid = checkEmailValid(email, patternEmail);
    const isPasswordValid = checkPasswordValid(password, patternPassword);
    const isNicknameValid = await checkNickNameExist(nickname);

    if (!isEmailValid || !isPasswordValid || !isNicknameValid) return;

    const { data, error } = await supabase.auth.signUp({ email, password });
    const userId = data.user?.id;

    const { data: existingProfile } = await supabase
      .from('profils')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingProfile) {
      setMessage('Un profil existe déjà pour cet utilisateur.');
      return;
    }

    if (!userId) {
      setMessage('Erreur : utilisateur non créé');
      return;
    }

    const { error: profileError } = await supabase.from('profils').insert([
      {
        user_id: userId,
        nickname,
        is_admin: false,
      },
    ]);

    if (profileError) {
      console.log('Erreur création profil : ' + profileError.message);
      return;
    }

    setMessage('Inscription réussie. Un mail vous a été envoyé.');
    setEmail('');
    setPassword('');
    setNickname('');
  };

  const checkNickNameExist = async (nickname) => {
    if (!nickname.trim()) {
      setMessage('Le pseudo ne doit pas être vide.');
      return false;
    }

    const { data: existingNick } = await supabase
      .from('profils')
      .select('id')
      .eq('nickname', nickname)
      .maybeSingle();

    if (existingNick) {
      setMessage('Ce pseudo est déjà utilisé.');
      return false;
    }

    return true;
  };

  const checkPasswordValid = (password, pattern) => {
    if (!pattern.test(password)) {
      setMessage("Le mot de passe doit contenir : majuscule, minuscule, chiffre et caractère spécial");
      return false;
    }
    if (password.length < 8 || password.length > 20) {
      setMessage("Le mot de passe doit faire entre 8 et 20 caractères");
      return false;
    }
    return true;
  };

  const checkEmailValid = (email, pattern) => {
    if (!pattern.test(email)) {
      setMessage("Email invalide");
      return false;
    }
    return true;
  };

  return (
    <main
      style={{
        maxWidth: 400,
        margin: '50px auto',
        padding: 20,
        fontFamily: 'sans-serif',
        color: '#000',
        paddingTop: 130,

      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30 }}>
        <FaArrowLeft onClick={() => router.back()} style={{ marginRight: 10, cursor: 'pointer', color: '#000' }} />
        <h1 style={{ fontSize: 26, fontWeight: 'bold', color: '#5C19F5', flex: 1, textAlign: 'center' }}>Inscription</h1>

      </div>

      {/* Formulaire */}
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          type="text"
          placeholder="Nom complet"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          style={{
            padding: 10,
            border: '1px solid #ccc',
            borderRadius: 8,
            background: '#fff',
          }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: 10,
            border: '1px solid #ccc',
            borderRadius: 8,
            background: '#fff',
          }}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: 10,
            border: '1px solid #ccc',
            borderRadius: 8,
            background: '#fff',
          }}
        />

        <button
          type="submit"
          style={{
            padding: 12,
            marginTop: 20,
            background: '#5C19F5',
            color: '#fff',
            border: 'none',
            borderRadius: 48,
            cursor: 'pointer',
          }}
        >
          S’inscrire
        </button>

        {/* Ligne de séparation */}
        <div className="flex items-center justify-center my-4 text-gray-400 text-sm">
          <span className="border-t border-gray-300 flex-grow mr-2" />
          OU 
          <span className="border-t border-gray-300 flex-grow ml-2" />
        </div>

        {/* Boutons sociaux */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <button
            type="button"
            onClick={() => console.log("Connexion avec Apple")}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: 10,
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: 48,
              cursor: 'pointer',
            }}
          >
            <FaApple />
            Continuer avec Apple
          </button>

          <button
            type="button"
            onClick={() => console.log("Connexion avec Google")}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: 10,
              background: '#F4F6F7',
              color: '#000',
              border: '1px solid #ccc',
              borderRadius: 48,
              cursor: 'pointer',
            }}
          >
            <FaGoogle />
            Continuer avec Google
          </button>


          <button
            type="button"
            onClick={() => console.log("Connexion avec Facebook")}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: 10,
              background: '#9992FF',
              color: '#fff',
              border: 'none',
              borderRadius: 48,
              cursor: 'pointer',
            }}
          >
            <FaFacebookF />
            Continuer avec Facebook
          </button>
        </div>

        {/* Lien Se connecter */}
        <p style={{ textAlign: 'center', marginTop: 30 }}>
          Vous avez déjà un compte ?{' '}
          <span
            onClick={() => router.push('/login')}
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            Se connecter
          </span>
        </p>
      </form>

      {/* Message */}
      {message && (
        <p style={{ marginTop: 20, textAlign: 'center', color: 'gray' }}>{message}</p>
      )}
    </main>
  );
}
