'use client';

import { useAuth } from '../../context/AuthContext';
import LogoutButton from '../../components/LogoutButton';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Switch } from '@headlessui/react';
import { FiLogOut, FiMoon, FiBell, FiBookmark, FiUser, FiTrash2} from 'react-icons/fi';
import { FaRegHeart } from 'react-icons/fa'

import { useTheme } from 'next-themes';
import NavBar from '../../components/NavBar';
import Loader from '../../components/Loader'; 

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const darkMode = theme === 'dark';
  const toggleDarkMode = () => {
    setTheme(darkMode ? 'light' : 'dark');
  };

  const [notifications, setNotifications] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Redirection si non connecté
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  // Charger l'avatar de l'utilisateur
  useEffect(() => {
    if (!user) return;

    const loadAvatar = async () => {
      const { data: profile, error } = await supabase
        .from('profils')
        .select('avatar_url')
        .eq('user_id', user.id)
        .single();

      if (!error && profile?.avatar_url) {
        const { data } = supabase.storage.from('media').getPublicUrl(profile.avatar_url);
        setAvatarUrl(data.publicUrl);
      }
    };

    loadAvatar();
  }, [user]);

  async function handleDeleteAccount() {
    const confirmed = window.confirm('⚠️ Supprimer définitivement votre compte ?');
    if (!confirmed) return;

    try {
      setUploading(true);
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert('Erreur : ' + (data.error || 'Erreur inconnue'));
        return;
      }

      alert('Compte supprimé.');
      router.push('/');
    } catch (error) {
      alert('Erreur inattendue : ' + error.message);
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <Loader />; 

  if (!user) return null;

  return (
    <div className="w-full min-h-screen mt-0 text-sm font-medium bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Header */}
      <div className="text-white text-center p-6 rounded-t-xl" style={{
        background: 'linear-gradient(135deg, #F7AD38 0%, #AD44AF 30%,#9992FF 80%, #9992FF 100%)',
        height: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        {/* Avatar */}
        <div className="mx-auto mb-4 w-20 h-20 rounded-full overflow-hidden bg-gray-300 relative">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="object-cover w-full h-full" />
          ) : (
            <FiUser className="text-gray-600 w-full h-full" />
          )}
        </div>

        <p className="text-lg font-semibold mb-2" style={{ color: '#5C19F5' }}>
          {user.nickname || 'Pseudo'}
        </p>

        <p className="text-sm mb-20" style={{ color: 'black' }}>
          {user.email}
        </p>

        <button
          onClick={() => router.push('/profile/edit')}
          style={{
            width: '200px',
            padding: '8px 0',
            borderRadius: 9999,
            fontSize: 14,
            background: '#5C19F5',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'block',
            margin: '0 auto',
          }}
        >
          Modifier
        </button>
      </div>

      {/* Collections */}
      <p className="font-bold uppercase text-gray-900 text-xl tracking-wider px-6 pt-6 pb-4">
        Collection
      </p>

      <div className="bg-gray-50 dark:bg-gray-800 py-4 px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <FaRegHeart />
            <span>Articles sauvegardés</span>
          </div>
          <span className="text-gray-400">{'>'}</span>
        </div>
      </div>

      {/* Préférences */}
      <p className="font-bold uppercase text-gray-900 text-xl tracking-wider px-6 pt-6 pb-4">
        Préférences
      </p>
      <div className="bg-white dark:bg-gray-800 px-6 py-4 space-y-4">
        {/* Dark Mode */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <FiMoon />
            <span>Dark mode</span>
          </div>
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            className={`${darkMode ? 'bg-black' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className={`${darkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
          </Switch>
        </div>

        {/* Notifications */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <FiBell />
            <span>Notifications</span>
          </div>
          <Switch
            checked={notifications}
            onChange={setNotifications}
            className={`${notifications ? 'bg-black' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className={`${notifications ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
          </Switch>
        </div>
      </div>

      {/* Logout */}
      <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="text-red-500 flex items-center gap-2 cursor-pointer">
          <FiLogOut />
          <LogoutButton />
        </div>
      </div>

      {/* Delete Account */}
                <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div
              onClick={handleDeleteAccount}
              className={`text-red-500 flex items-center gap-2 cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <FiTrash2 />
              <span className="font-medium">Supprimer mon compte</span>
            </div>
          </div>

      <NavBar />
    </div>
  );
}




