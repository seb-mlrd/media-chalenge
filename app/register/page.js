'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const patternEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  const patternPassword = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');

    const isEmailValid = checkEmailValid(email, patternEmail);
    const isPasswordValid = checkPasswordValid(password, patternPassword);
    const isNicknameValid = await checkNickNameExist(nickname);

    if (!isEmailValid || !isPasswordValid || !isNicknameValid) {
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    const userId = data.user?.id;

    const { data: existingProfile } = await supabase
    .from('profils')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

    if (existingProfile) {
        setMessage('❌ Un profil existe déjà pour cet utilisateur.');
        return;
    }

    if (!userId) {
        setMessage('Erreur : utilisateur non créé');
        return;
    }

    const { error: profileError } = await supabase.from('profils').insert([
        {
        user_id: userId,
        nickname: nickname,
        is_admin: false,
        },
    ]);

    if (profileError) {
        console.log('Erreur création profil : ' + profileError.message);
        return;
    }

    setMessage('Inscription réussie, un mail vous à été envoyé');
    setEmail('');
    setPassword('');
    setNickname('');
  };

    const checkNickNameExist = async (nickname) => {
        if (!nickname.trim()) {
            setMessage('❌ Le pseudo ne doit pas être vide.');
            return false;
        }

        const { data: existingNick } = await supabase
        .from('profils')
        .select('id')
        .eq('nickname', nickname)
        .maybeSingle();

        if (existingNick) {
            setMessage('❌ Ce pseudo est déjà utilisé.');
            return false;
        }

        return true;
    };

    const checkPasswordValid = (password, pattern) => {
    if (!pattern.test(password)) {
        setMessage("❌ Le mot de passe doit contenir : majuscule, minuscule, chiffre et caractère spécial");
        return false;
    }
    if (password.length < 8 || password.length > 20) {
        setMessage("❌ Le mot de passe doit faire entre 8 et 20 caractères");
        return false;
    }
    return true;
    };

    const checkEmailValid = (email, pattern) => {
    if (!pattern.test(email)) {
        setMessage("❌ Email invalide");
        return false;
    }
    return true;
    };
  
  return (
    <main style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>Inscription</h1>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Pseudo"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <button type="submit" style={{ padding: 10, width: '100%', cursor: 'pointer' }}>
          S’inscrire
        </button>
        <p style={{ marginTop: 20, textAlign: 'center' }}>
        Déjà un compte ?{' '}
        <span
            onClick={() => router.push('/login')}
            style={{ color: '#0070f3', cursor: 'pointer', textDecoration: 'underline' }}
        >
            Se connecter
        </span>
        </p>
      </form>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </main>
  );
}
