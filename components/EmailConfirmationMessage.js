'use client';

import { useEffect, useState } from 'react';

export default function EmailConfirmationMessage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes('message=')) {
      const extracted = hash.split('message=')[1];
      const decoded = decodeURIComponent(extracted);

      // Supabase message typique pour changement d'email
      if (decoded.includes('Confirmation link accepted')) {
        setMessage(
          "✅ Lien confirmé. Veuillez également cliquer sur le lien envoyé à votre nouvel e-mail pour finaliser le changement."
        );
      } else {
        setMessage(decoded);
      }

      // Nettoyer l’URL pour retirer le hash
      history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  if (!message) return null;

  return (
    <div
      style={{
        margin: '20px auto',
        padding: '15px',
        backgroundColor: '#f1f8e9',
        border: '1px solid #cddc39',
        borderRadius: '5px',
        maxWidth: '600px',
        textAlign: 'center',
        fontSize: '16px',
      }}
    >
      📩 {message}
    </div>
  );
}
