'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiUser, FiCamera } from 'react-icons/fi';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

import Loader from '../../../components/Loader';
import NavBar from '../../../components/NavBar';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);

  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const patternEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const patternPassword = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) {
        router.push('/login');
        return;
      }

      setEmail(user.email);

      const { data, error } = await supabase
        .from('profils')
        .select('nickname, avatar_url')
        .eq('user_id', user.id)
        .single();

      if (error) {
        setMessage('❌ Erreur récupération du profil');
        setLoading(false);
        return;
      }

      setNickname(data.nickname);

      if (data.avatar_url) {
        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(data.avatar_url);
        setAvatarUrl(urlData.publicUrl);
      }

      setLoading(false);
    }

    if (!authLoading && user) {
      fetchUserProfile();
    }
  }, [authLoading, user, router]);

  const checkEmailValid = (email) => patternEmail.test(email);
  const checkPasswordValid = (password) => {
    if (!password) return true;
    return patternPassword.test(password) && password.length >= 8 && password.length <= 20;
  };
  const checkNicknameValid = (nickname) => nickname.trim() !== '';

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewAvatarFile(file);
    setMessage('');
    setPreviewAvatarUrl(URL.createObjectURL(file));
  };

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

    setUploading(true);

    if (!user) {
      setMessage('❌ Utilisateur non connecté');
      setUploading(false);
      router.push('/login');
      return;
    }

    if (newAvatarFile) {
      try {
        const fileExt = newAvatarFile.name.split('.').pop();
        const filePath = `avatars/${user.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, newAvatarFile, { upsert: true });

        if (uploadError) {
          setMessage('❌ Erreur upload : ' + uploadError.message);
          setUploading(false);
          return;
        }

        const { error: updateAvatarError } = await supabase
          .from('profils')
          .update({ avatar_url: filePath })
          .eq('user_id', user.id);

        if (updateAvatarError) {
          setMessage('❌ Erreur mise à jour avatar : ' + updateAvatarError.message);
          setUploading(false);
          return;
        }

        const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath);
        setAvatarUrl(urlData.publicUrl);
        setPreviewAvatarUrl(null);
        setNewAvatarFile(null);
      } catch (error) {
        setMessage('❌ Erreur upload : ' + error.message);
        setUploading(false);
        return;
      }
    }

    let updateMessage = '';
    let emailUpdated = false;

    if (email !== user.email) {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) {
        setMessage('❌ Erreur mise à jour email : ' + error.message);
        setUploading(false);
        return;
      } else {
        emailUpdated = true;
        updateMessage += `📧 2 e-mails envoyés :
• Ancienne adresse → confirmation du changement
• Nouvelle adresse → validation et accès à l’app
👉 Cliquez sur les deux pour finaliser.`;
      }
    }

    if (password) {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setMessage('❌ Erreur mise à jour mot de passe : ' + error.message);
        setUploading(false);
        return;
      }
    }

    const { error: profileError } = await supabase
      .from('profils')
      .update({ nickname })
      .eq('user_id', user.id);

    if (profileError) {
      setMessage('❌ Erreur mise à jour pseudo : ' + profileError.message);
      setUploading(false);
      return;
    }

    if (!emailUpdated) {
      updateMessage += '✅ Profil mis à jour avec succès !';
    }

    setMessage(updateMessage);
    setPassword('');
    setUploading(false);
  };

  if (loading || authLoading || !user) return <Loader />;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div
        className="text-white text-center p-6 rounded-b-xl relative"
        style={{
          background: 'linear-gradient(135deg, #F7AD38 0%, #AD44AF 30%,#9992FF 80%, #9992FF 100%)',
          height: '40vh',
          minHeight: '25vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={() => router.back()}
          className="absolute top-5 left-5 text-white text-xl"
        >
          <FiArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold mb-4">Modifier mon profil</h1>

        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-300">
            {previewAvatarUrl ? (
              <img src={previewAvatarUrl} alt="Avatar Preview" className="object-cover w-full h-full" />
            ) : avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="object-cover w-full h-full" />
            ) : (
              <FiUser className="text-gray-600 w-full h-full" />
            )}
            
          </div>

          <button
            type="button"
            onClick={() => document.getElementById('upload-avatar-input').click()}
            className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-white rounded-full p-2 shadow-md border border-gray-300 hover:bg-gray-100 focus:outline-none flex items-center justify-center"
            title="Changer la photo de profil"
          >
            <FiCamera className="text-gray-700 w-5 h-5" />
          </button>

          <input
            type="file"
            id="upload-avatar-input"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={uploading}
            className="hidden"
          />
        </div>
      </div>

      <form onSubmit={handleUpdate} className="max-w-xl mx-auto mt-10 px-6 space-y-6">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Nouveau mot de passe</label>
          <input
            type="password"
            placeholder="Laisser vide pour ne pas changer"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            maxLength={20}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Pseudo</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-full bg-[#5C19F5] hover:bg-[#4a13cc] transition text-white font-semibold text-lg"
          disabled={uploading}
        >
          Enregistrer les modifications
        </button>

        {message && (
          <p
            className={`text-center font-medium mt-4 ${
              message.startsWith('❌') ? 'text-red-500' : 'text-green-500'
            }`}
            style={{ whiteSpace: 'pre-line' }}
          >
            {message}
          </p>
        )}
      </form>

      <NavBar />
    </div>
  );
}
