'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '../../components/Loader'; // Import du Loader

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // état loading

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true); // démarrer loader

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false); // arrêter loader

    if (error) {
      setMessage("Une erreur est survenue : " + error.message);
    } else {
      setMessage("Un lien de réinitialisation a été envoyé à votre adresse e-mail.");
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: '50px auto', padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <FaArrowLeft
          onClick={() => router.push('/login')}
          style={{ marginRight: 10, cursor: 'pointer', color: '#000' }}
          size={20}
        />
        <h1
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000',
            flex: 1,
            textAlign: 'center',
          }}
        >
          Mot de passe oublié
        </h1>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={handleResetPassword}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <input
            type="email"
            placeholder="Entrez votre e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: 10,
              border: '1px solid #ccc',
              borderRadius: 4,
            }}
          />
          <button
            type="submit"
            style={{
              padding: 10,
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Envoyer le lien
          </button>
          {message && (
            <p style={{ textAlign: 'center', color: 'gray' }}>{message}</p>
          )}
        </form>
      )}
    </main>
  );
}



// 'use client';

// import { useState } from 'react';
// import { supabase } from '../../lib/supabase';
// import { useRouter } from 'next/navigation';
// import { FaArrowLeft } from 'react-icons/fa';

// export default function ForgotPasswordPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setMessage('');

//     const { error } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: `${window.location.origin}/reset-password`,
//     });

//     if (error) {
//       setMessage("Une erreur est survenue : " + error.message);
//     } else {
//       setMessage("Un lien de réinitialisation a été envoyé à votre adresse e-mail.");
//     }
//   };

//   return (
//     <main style={{ maxWidth: 400, margin: '50px auto', padding: 20 }}>
//       <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
//         <FaArrowLeft
//   onClick={() => router.push('/login')}
//   style={{ marginRight: 10, cursor: 'pointer', color: '#000' }}
//   size={20}
// />

//         <h1 style={{ fontSize: 20, fontWeight: 'bold', color: '#000', flex: 1, textAlign: 'center' }}>
//           Mot de passe oublié
//         </h1>
//       </div>
//       <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//         <input
//           type="email"
//           placeholder="Entrez votre e-mail"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{
//             padding: 10,
//             border: '1px solid #ccc',
//             borderRadius: 4,
//           }}
//         />
//         <button
//           type="submit"
//           style={{
//             padding: 10,
//             background: '#000',
//             color: '#fff',
//             border: 'none',
//             borderRadius: 4,
//             cursor: 'pointer',
//           }}
//         >
//           Envoyer le lien
//         </button>
//         {message && <p style={{ textAlign: 'center', color: 'gray' }}>{message}</p>}
//       </form>
//     </main>
//   );
// }
