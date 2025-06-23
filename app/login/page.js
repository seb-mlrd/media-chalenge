'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if(error){
            setMessage('Le compte n\'existe pas' + error)
            return
        }
        console.log(data);
        setMessage('Connexion réussie !')
        redirect('/')
    }

    return (
        <main style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
            <h1>Connexion</h1>
            <form onSubmit={handleLogin}>
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
                <button type="submit" style={{ padding: 10, width: '100%', cursor: 'pointer' }}>
                Se connecter
                </button>
                <p style={{ marginTop: 20, textAlign: 'center' }}>
                    Pas de compte ?{' '}
                    <span
                        onClick={() => router.push('/register')}
                        style={{ color: '#0070f3', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        S'inscrire
                    </span>
                </p>
            </form>
            {message && <p style={{ marginTop: 10 }}>{message}</p>}
        </main>
    );
}