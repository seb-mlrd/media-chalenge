'use client';

import { useAuth } from '../../context/AuthContext';
import LogoutButton from '../../components/LogoutButton';
import EditButton from '../../components/EditButton';
import Loader from '../../components/Loader';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Switch } from '@headlessui/react';
import { FiLogOut, FiMoon, FiBell, FiUser, FiBookmark } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function fetchProfile() {
      const { data: profile, error } = await supabase
        .from('profils')
        .select('nickname')
        .eq('user_id', user.id)
        .single();

      if (!error && profile) {
        setNickname(profile.nickname);
      } else {
        setNickname('Pseudo inconnu');
      }
      setLoadingProfile(false);
    }

    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || loadingProfile)
    return (
      <p style={{ textAlign: 'center', marginTop: 50, color: '#666' }}>
        Chargement...
      </p>
    );

  if (!user) return null;

  return (
    <div className="max-w-sm mx-auto mt-10 text-sm font-medium">
      {/* Profile Header */}
      <div className="bg-black text-white text-center p-6 rounded-t-xl">
        <div className="w-16 h-16 mx-auto bg-gray-300 rounded-full mb-3" />
        <p className="text-lg font-semibold">{nickname}</p>
        <p className="text-gray-400 text-sm">{user.email}</p>
        <div className="mt-3">
          <EditButton
            style={{
              padding: '6px 14px',
              border: '1.5px solid white',
              borderRadius: 9999,
              fontSize: 14,
              background: 'transparent',
              color: 'white',
            }}
          />
        </div>
      </div>

    <p className="text-xs uppercase text-gray-500 tracking-wider px-6 pt-6 pb-2">
      Collection
    </p>

      <div className="bg-gray-50 py-4 px-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <FiBookmark />
            <span>Articles sauvegardés</span>
          </div>
          <span className="text-gray-400">{'>'}</span>
        </div>
      </div>

    <p className="text-xs uppercase text-gray-500 tracking-wider px-6 pt-6 pb-2">
      Preference
    </p>

   <div className="bg-white px-6 py-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-800">
            <FiMoon />
            <span>Dark mode</span>
          </div>
          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            className={`${
              darkMode ? 'bg-black' : 'bg-gray-300'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-800">
            <FiBell />
            <span>Notifications</span>
          </div>
          <Switch
            checked={notifications}
            onChange={setNotifications}
            className={`${
              notifications ? 'bg-black' : 'bg-gray-300'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                notifications ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>

        <div className="flex items-center justify-between text-gray-800">
          <div className="flex items-center gap-2">
            <FiUser />
            <span>Account</span>
          </div>
          <span>{'>'}</span>
        </div>
      </div>

      <div className="px-6 py-4 bg-white border-t">
        <div className="text-red-500 flex items-center gap-2 cursor-pointer">
          <FiLogOut />
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}





// 'use client';

// import { useAuth } from '../../../context/AuthContext';
// import LogoutButton from '../../../components/LogoutButton';
// import EditButton from '../../../components/EditButton';
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import { supabase } from '../../../lib/supabase';

// export default function ProfilePage() {
//   const { user, loading } = useAuth();
//   const router = useRouter();
//   const [nickname, setNickname] = useState('');
//   const [loadingProfile, setLoadingProfile] = useState(true);

//   useEffect(() => {
//     if (!user) return;

//     async function fetchProfile() {
//       const { data: profile, error } = await supabase
//         .from('profils')
//         .select('nickname')
//         .eq('user_id', user.id)
//         .single();

//       if (!error && profile) {
//         setNickname(profile.nickname);
//       } else {
//         setNickname('Pseudo inconnu');
//       }
//       setLoadingProfile(false);
//     }

//     fetchProfile();
//   }, [user]);

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login');
//     }
//   }, [loading, user, router]);

//   if (loading || loadingProfile)
//     return (
//       <p style={{ textAlign: 'center', marginTop: 50, color: '#666' }}>
//         Chargement...
//       </p>
//     );

//   if (!user) return null;

//   const buttonStyle = {
//     padding: '10px 18px',
//     borderRadius: 8,
//     border: '1.5px solid #111',
//     backgroundColor: '#fff',
//     color: '#111',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.3s',
//   };

//   const buttonHover = (e) => {
//     e.currentTarget.style.backgroundColor = '#111';
//     e.currentTarget.style.color = '#fff';
//   };

//   const buttonLeave = (e) => {
//     e.currentTarget.style.backgroundColor = '#fff';
//     e.currentTarget.style.color = '#111';
//   };

//   return (
//     <main
//       style={{
//         maxWidth: 420,
//         margin: '50px auto',
//         padding: 30,
//         borderRadius: 12,
//         backgroundColor: '#fff',
//         boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//         color: '#111',
//         textAlign: 'center',
//         userSelect: 'none',
//       }}
//     >
//       <h1
//         style={{
//           fontWeight: '700',
//           fontSize: '2rem',
//           marginBottom: 10,
//           color: '#000',
//         }}
//       >
//         Bienvenue {nickname}
//       </h1>
//       <p style={{ fontSize: 16, color: '#333', margin: '10px 0' }}>
//         <strong>Email :</strong> {user.email}
//       </p>
//       {user?.is_admin && (
//         <p
//           style={{
//             color: '#444',
//             backgroundColor: '#e0e0e0',
//             padding: '8px 12px',
//             borderRadius: 8,
//             fontWeight: '600',
//             display: 'inline-block',
//             marginTop: 15,
//           }}
//         >
//           Vous êtes administrateur 🎉
//         </p>
//       )}

//       <div
//         style={{
//           marginTop: 35,
//           display: 'flex',
//           justifyContent: 'center',
//           gap: 25,
//         }}
//       >
//         <LogoutButton
//           style={buttonStyle}
//           onMouseEnter={buttonHover}
//           onMouseLeave={buttonLeave}
//         />
//         <EditButton
//           style={buttonStyle}
//           onMouseEnter={buttonHover}
//           onMouseLeave={buttonLeave}
//         />
//       </div>
//     </main>
//   );
// }
