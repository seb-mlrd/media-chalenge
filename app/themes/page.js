"use client";
import React, { useState, useEffect } from 'react';
import { createTheme, getThemes } from './ThemeService';
import styles from '../page.module.css';

export default function ThemesManager() {
  const [themes, setThemes] = useState([]);
  const [newTheme, setNewTheme] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Charger les thèmes au chargement de la page
  useEffect(() => {
    async function loadThemes() {
      const result = await getThemes();
      if (result.success) {
        setThemes(result.themes || []);
      } else {
        setMessage('❌ Erreur: ' + result.message);
      }
      setLoading(false);
    }
    
    loadThemes();
  }, []);

  // Gérer la soumission du formulaire pour créer un nouveau thème
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTheme.trim()) {
      setMessage('❌ Le nom du thème ne peut pas être vide');
      return;
    }

    setLoading(true);
    const result = await createTheme(newTheme);
    
    if (result.success) {
      setThemes([...themes, result.theme]);
      setNewTheme('');
      setMessage('✅ Thème créé avec succès !');
    } else {
      setMessage('❌ ' + result.message);
    }
    setLoading(false);
  };

  return (
    <div className={styles['container-center']}>
      <div className={styles['form-article']}>
        <h2 className={styles['form-title']}>Gestion des thèmes</h2>
        
        {/* Formulaire pour créer un nouveau thème */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTheme}
            onChange={(e) => setNewTheme(e.target.value)}
            placeholder="Nom du nouveau thème"
            className={styles.input}
            disabled={loading}
          />
          <button 
            type="submit" 
            className={styles['btn-submit']}
            disabled={loading}
          >
            Ajouter un thème
          </button>
        </form>
        
        {/* Affichage du message de succès/erreur */}
        {message && (
          <p className={styles.message + ' ' + (message.startsWith('✅') ? styles.success : styles.error)}>
            {message}
          </p>
        )}
        
        {/* Liste des thèmes existants */}
        <h3>Thèmes existants</h3>
        {loading ? (
          <p>Chargement...</p>
        ) : themes.length > 0 ? (
          <ul className={styles['theme-list']}>
            {themes.map(theme => (
              <li key={theme.id} className={styles['theme-item']}>
                {theme.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun thème n'est défini. Créez-en un nouveau !</p>
        )}
      </div>
    </div>
  );
}
