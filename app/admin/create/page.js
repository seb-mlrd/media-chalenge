"use client";
import React, { useState, useEffect } from 'react';
import createArticle from '../../articles/CreateArticle';
import { supabase } from '@/lib/supabase';
import { getThemes } from '../../themes/ThemeService';
import styles from '../../page.module.css';

export default function ArticleForm() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    theme_id: '',
    created_by: '', // Champ modifiable
    updated_by: ''  // Champ modifiable
  });
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Charger les thèmes au chargement du composant
  useEffect(() => {
    async function loadThemes() {
      const result = await getThemes();
      if (result.success) {
        setThemes(result.themes || []);
        // Si des thèmes existent, sélectionner le premier par défaut
        if (result.themes && result.themes.length > 0) {
          setForm(prev => ({ ...prev, theme_id: result.themes[0].id }));
        }
      } else {
        setMessage('❌ Erreur lors du chargement des thèmes: ' + result.message);
      }
      setLoading(false);
    }
    
    loadThemes();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.theme_id) {
      setMessage('❌ Veuillez sélectionner un thème');
      return;
    }
    if (!form.created_by) {
      setMessage('❌ Veuillez saisir un id de profil valide');
      return;
    }
    setLoading(true);
    const result = await createArticle({
      ...form,
      theme_id: parseInt(form.theme_id),
      created_by: parseInt(form.created_by),
      updated_by: parseInt(form.created_by)
    });
    setLoading(false);
    if (result.success) {
      setMessage('✅ Article créé avec succès !');
      setForm({
        title: '',
        content: '',
        theme_id: themes.length > 0 ? themes[0].id : '',
        created_by: '',
        updated_by: ''
      });
    } else {
      setMessage('❌ ' + result.message);
    }
  };

  return (
    <div className={styles['container-center']}>
      <form onSubmit={handleSubmit} className={styles['form-article']}>
        <h2 className={styles['form-title']}>Créer un article</h2>
        <input
          name="title"
          placeholder="Titre"
          value={form.title}
          onChange={handleChange}
          className={styles.input}
          required
          disabled={loading}
        />
        <textarea
          name="content"
          placeholder="Contenu"
          value={form.content}
          onChange={handleChange}
          className={styles.textarea}
          required
          disabled={loading}
        />
        <div className={styles['form-group']}>
          <label htmlFor="theme_id" className={styles.label}>Thème</label>
          <select
            id="theme_id"
            name="theme_id"
            value={form.theme_id}
            onChange={handleChange}
            className={styles.select}
            required
            disabled={loading}
          >
            <option value="">Sélectionnez un thème</option>
            {themes.map(theme => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="created_by" className={styles.label}>ID du profil (créateur)</label>
          <input
            type="number"
            name="created_by"
            id="created_by"
            placeholder="Ex: 1"
            value={form.created_by}
            onChange={handleChange}
            className={styles.input}
            required
            disabled={loading}
          />
        </div>
        {themes.length === 0 && !loading && (
          <p className={styles.warning}>
            Aucun thème disponible. <a href="/themes" className={styles.link}>Créer des thèmes</a>
          </p>
        )}
        <button 
          type="submit" 
          className={styles['btn-submit']}
          disabled={loading || themes.length === 0}
        >
          {loading ? 'Création en cours...' : 'Créer l\'article'}
        </button>
        {message && (
          <p className={styles.message + ' ' + (message.startsWith('✅') ? styles.success : styles.error)}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}