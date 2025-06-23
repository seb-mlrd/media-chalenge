'use client';

import { useAuth } from '../context/AuthContext';
import LogoutButton from "../components/LogoutButton";
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes'
import { FaSun, FaMoon } from 'react-icons/fa'; 
import './globals.css'
export default function Home() {
    const { user, loading } = useAuth();
    const { theme, setTheme } = useTheme()
    const router = useRouter();
    if (loading) return <p>Chargement...</p>;

    const handleThemeToggle = () => {
      setTheme(theme === 'light' ? 'dark' : 'light');
    };
    return (
      <div>
        <h1>Bienvenue {user && user.nickname}</h1>
        {user?.is_admin && <p>Vous êtes administrateur 🎉</p>}
        {user ?
          <LogoutButton />
        :
          <div>
            <button onClick={() => router.push('/register')} style={{ padding: 10, marginInline: 20, marginTop: 20, cursor: 'pointer' }}>
              Inscription
            </button>
            <button onClick={() => router.push('/login')} style={{ padding: 10, marginInline: 20, marginTop: 20, cursor: 'pointer' }}>
              Connexion
            </button>
          </div>
        }
        <div style={{ marginTop: 30 }}>
          <input
            type="checkbox"
            id="checkbox"
            className="checkbox"
            onChange={handleThemeToggle}
            checked={theme === 'dark'}
          />
          <label htmlFor="checkbox" className="checkbox-label">
            <FaMoon className="fa-moon" />
            <FaSun className="fa-sun" />
            <span className="ball"></span>
          </label>
        </div>
      </div>
    );
}
