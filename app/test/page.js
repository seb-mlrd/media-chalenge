'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function TestConnection() {
  const [message, setMessage] = useState('Test en cours...');

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from('articles').select('*');

      if (error) {
        setMessage(`❌ Erreur de connexion : ${error.message}`);
      } else {
        setMessage(`✅ Connexion réussie (${data.length} article(s) trouvés)`);
        setArticles(data);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test de connexion Supabase</h1>
      <p className="mb-4">{message}</p>
    </div>
  );
}
