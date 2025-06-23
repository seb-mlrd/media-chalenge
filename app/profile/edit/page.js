'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const patternEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const patternPassword = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;

  useEffect(() => {
    async function fetchUserProfile() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push('/login');
        return;
      }

      setEmail(user.email);

      const { data, error: profileError } = await supabase
        .from('profils')
        .select('nickname')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        setMessage('❌ Erreur récupération du profil');
        setLoading(false);
        return;
      }

      setNickname(data.nickname);
      setLoading(false);
    }

    fetchUserProfile();
  }, [router]);

  const checkEmailValid = (email) => patternEmail.test(email);
  const checkPasswordValid = (password) => {
    if (!password) return true;
    return patternPassword.test(password) && password.length >= 8 && password.length <= 20;
  };
  const checkNicknameValid = (nickname) => nickname.trim() !== '';

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!checkEmailValid(email)) {
      setMessage('❌ Email invalide');
      return;
    }
    if (!checkPasswordValid(password)) {
      setMessage('❌ Mot de passe invalide : majuscule, minuscule, chiffre, caractère spécial, 8-20 caractères');
      return;
    }
    if (!checkNicknameValid(nickname)) {
      setMessage('❌ Le pseudo ne doit pas être vide');
      return;
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setMessage('❌ Utilisateur non connecté');
      router.push('/login');
      return;
    }

    let updateMessage = '';
    let emailUpdated = false;

    // Mise à jour de l'email
    if (email !== user.email) {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) {
        setMessage('❌ Erreur mise à jour email : ' + error.message);
        return;
      } else {
        emailUpdated = true;
        updateMessage += '📧 Un email de confirmation a été envoyé à votre nouvelle adresse. Veuillez confirmer.\n';
      }
    }

    // Mise à jour du mot de passe
    if (password) {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setMessage('❌ Erreur mise à jour mot de passe : ' + error.message);
        return;
      }
    }

    // Mise à jour du pseudo
    const { error: profileError } = await supabase
      .from('profils')
      .update({ nickname })
      .eq('user_id', user.id);

    if (profileError) {
      setMessage('❌ Erreur mise à jour pseudo : ' + profileError.message);
      return;
    }

    if (!emailUpdated) {
      updateMessage += '✅ Profil mis à jour avec succès !';
    }

    setMessage(updateMessage);
    setPassword('');
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <main style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>Modifier mon profil</h1>
      <form onSubmit={handleUpdate}>
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
          placeholder="Nouveau mot de passe (laisser vide pour ne pas changer)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
          minLength={8}
          maxLength={20}
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
          Mettre à jour
        </button>
      </form>
      {message && <p style={{ marginTop: 10, whiteSpace: 'pre-line' }}>{message}</p>}
    </main>
  );
}
