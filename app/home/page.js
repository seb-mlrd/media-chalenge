// 'use client';

// import { useAuth } from '../../context/AuthContext';
// import LogoutButton from '../../components/LogoutButton';
// import { useRouter } from 'next/navigation';

// export default function Home() {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   if (loading) return <p>Chargement...</p>;

//   if (!user) return <p>Non connecté</p>;

//   return (
//     <div>
//       <h1>Bienvenue, {user.nickname}</h1>
//       {user.is_admin && <p>Vous êtes administrateur 🎉</p>}

//       <button
//         onClick={() => router.push('/profile/edit')}
//         style={{
//           marginTop: '10px',
//           padding: '8px 12px',
//           backgroundColor: '#0070f3',
//           color: 'white',
//           border: 'none',
//           borderRadius: '5px',
//           cursor: 'pointer'
//         }}
//       >
//         Modifier mon profil
//       </button>

//       <LogoutButton />
//     </div>
//   );
// }



'use client';

import { useAuth } from '../../context/AuthContext';
import LogoutButton from '../../components/LogoutButton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function EmailConfirmationHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryMessage = searchParams.get('message');

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (queryMessage) {
      setMessage(queryMessage);
      if (
        queryMessage.includes('Confirmation link accepted') &&
        !queryMessage.includes('sent to the other email')
      ) {
        setTimeout(() => {
          router.push('/home');
        }, 1500);
      }
      return;
    }

    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#message=')) {
        const msg = decodeURIComponent(hash.substring(9));
        setMessage(msg);

        if (msg.includes('sent to the other email')) {
          // Affiche le message et ne redirige pas
          return;
        }

        if (msg.includes('Confirmation link accepted')) {
          setTimeout(() => {
            router.push('/home');
          }, 1500);
        }
      }
    }
  }, [queryMessage, router]);

  if (!message) return null;

  return (
    <div
      style={{
        padding: 15,
        margin: '20px auto',
        maxWidth: 600,
        backgroundColor: '#e0ffe0',
        border: '1px solid #0a0',
        borderRadius: 4,
        textAlign: 'center',
        fontWeight: 'bold',
      }}
    >
      {message.includes('sent to the other email')
        ? "✅ Confirmation de changement de l'email sur l'ancien mail."
        : message}
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Affiche EmailConfirmationHandler toujours, mais uniquement le message s'il y en a
  // Affiche un loader si loading true et pas de message à afficher
  return (
    <div>
      <EmailConfirmationHandler />

      {loading && <p>Chargement...</p>}

      {!loading && !user && <p>Non connecté</p>}

      {!loading && user && (
        <>
          <h1>Bienvenue, {user.nickname}</h1>
          {user.is_admin && <p>Vous êtes administrateur 🎉</p>}

          <button
            onClick={() => router.push('/profile/edit')}
            style={{
              marginTop: '10px',
              padding: '8px 12px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Modifier mon profil
          </button>

          <LogoutButton />
        </>
      )}
    </div>
  );
}
