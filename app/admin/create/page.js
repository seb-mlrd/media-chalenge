'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './create.module.css';
import { useAuth } from '@/context/AuthContext';
import createArticle from '@/app/articles/CreateArticle';
import { getThemes } from '@/app/themes/ThemeService';
import { uploadMedia } from '@/app/media/MediaService';
import Image from 'next/image';

export default function ArticleForm() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [form, setForm] = useState({
    title: '',
    content: '',
    theme_id: '',
  });
  
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // État pour les médias
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  
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

  // Redirection si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Gestion de l'upload d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setMessage('❌ Veuillez sélectionner une image valide');
      return;
    }
    
    setSelectedImage(file);
    
    // Créer un aperçu de l'image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Gestion de l'upload de vidéo
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      setMessage('❌ Veuillez sélectionner une vidéo valide');
      return;
    }
    
    setSelectedVideo(file);
    
    // Créer un aperçu de la vidéo
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };
  
  // Fonction pour gérer l'upload des médias
  const handleMediaUpload = async () => {
    if (!user) return [];
    
    setIsUploading(true);
    const media = [];
    
    try {
      // Upload image si sélectionnée
      if (selectedImage) {
        setUploadProgress(25);
        console.log("Début upload image avec user_id:", user.user_id);
        const imageResult = await uploadMedia(selectedImage, user.user_id);
        if (imageResult.success) {
          media.push(imageResult.media);
          setUploadProgress(50);
        } else {
          setMessage('❌ Erreur lors de l\'upload de l\'image: ' + imageResult.message);
          setIsUploading(false);
          return null;
        }
      }
      
      // Upload vidéo si sélectionnée
      if (selectedVideo) {
        setUploadProgress(75);
        console.log("Début upload vidéo avec user_id:", user.user_id);
        const videoResult = await uploadMedia(selectedVideo, user.user_id);
        if (videoResult.success) {
          media.push(videoResult.media);
          setUploadProgress(100);
        } else {
          setMessage('❌ Erreur lors de l\'upload de la vidéo: ' + videoResult.message);
          setIsUploading(false);
          return null;
        }
      }
      
      setUploadedMedia(media);
      setIsUploading(false);
      setUploadProgress(0);
      return media;
    } catch (error) {
      console.error('Erreur d\'upload:', error);
      setMessage('❌ Une erreur est survenue lors de l\'upload des médias');
      setIsUploading(false);
      setUploadProgress(0);
      return null;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!form.theme_id) {
      setMessage('❌ Veuillez sélectionner un thème');
      return;
    }
    
    if (!user) {
      setMessage('❌ Vous devez être connecté pour créer un article');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    // 1. Upload des médias s'il y en a
    let mediaFiles = [];
    if (selectedImage || selectedVideo) {
      setMessage('⏳ Upload des médias en cours...');
      mediaFiles = await handleMediaUpload();
      if (!mediaFiles) {
        setLoading(false);
        return; // L'erreur a déjà été affichée dans handleMediaUpload
      }
    }
    
    // 2. Création de l'article avec les médias
    setMessage('⏳ Création de l\'article en cours...');
    const result = await createArticle(
      {
        ...form,
        theme_id: parseInt(form.theme_id),
        created_by: user.id,
        updated_by: user.id
      }, 
      mediaFiles
    );
    
    setLoading(false);
    
    if (result.success) {
      setMessage('✅ Article créé avec succès !');
      // Réinitialiser le formulaire
      setForm({
        title: '',
        content: '',
        theme_id: themes.length > 0 ? themes[0].id : '',
      });
      setSelectedImage(null);
      setImagePreview(null);
      setSelectedVideo(null);
      setVideoPreview(null);
      setUploadedMedia([]);
    } else {
      setMessage('❌ ' + result.message);
    }
  };

  return (
    <div className={styles['container-center']}>
      {authLoading ? (
        <div className={styles.loader}>Chargement de l'authentification...</div>
      ) : !user ? (
        <div className={styles.error}>Vous devez être connecté pour accéder à cette page.</div>
      ) : (
        <form onSubmit={handleSubmit} className={styles['form-article']}>
          <h2 className={styles['form-title']}>Créer un article</h2>
          
          {/* Champs textuels */}
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
          
          {/* Sélection du thème */}
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
          
          {/* Upload d'image */}
          <div className={styles['form-group']}>
            <label htmlFor="image" className={styles.label}>Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
              disabled={loading || isUploading}
            />
            
            {imagePreview && (
              <div className={styles.preview}>
                <Image 
                  src={imagePreview} 
                  alt="Aperçu de l'image" 
                  width={200} 
                  height={150} 
                  className={styles.imagePreview}
                />
                <button 
                  type="button" 
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  className={styles.removeButton}
                  disabled={loading || isUploading}
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>
          
          {/* Upload de vidéo */}
          <div className={styles['form-group']}>
            <label htmlFor="video" className={styles.label}>Vidéo</label>
            <input
              type="file"
              id="video"
              accept="video/*"
              onChange={handleVideoChange}
              className={styles.fileInput}
              disabled={loading || isUploading}
            />
            
            {videoPreview && (
              <div className={styles.preview}>
                <video 
                  src={videoPreview} 
                  controls 
                  width="200" 
                  height="150"
                  className={styles.videoPreview}
                />
                <button 
                  type="button" 
                  onClick={() => {
                    setSelectedVideo(null);
                    setVideoPreview(null);
                    URL.revokeObjectURL(videoPreview);
                  }}
                  className={styles.removeButton}
                  disabled={loading || isUploading}
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>
          
          {/* Barre de progression pour l'upload */}
          {isUploading && (
            <div className={styles.progressContainer}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <span className={styles.progressText}>{uploadProgress}%</span>
            </div>
          )}
          
          {/* Message d'erreur si aucun thème disponible */}
          {themes.length === 0 && !loading && (
            <p className={styles.warning}>
              Aucun thème disponible. <a href="/themes" className={styles.link}>Créer des thèmes</a>
            </p>
          )}
          
          {/* Bouton de soumission */}
          <button 
            type="submit" 
            className={styles['btn-submit']}
            disabled={loading || isUploading || themes.length === 0}
          >
            {loading || isUploading ? 'Traitement en cours...' : 'Créer l\'article'}
          </button>
          
          {/* Message de feedback */}
          {message && (
            <p className={message.startsWith('✅') ? styles.success : 
                         message.startsWith('⏳') ? styles.info : 
                         styles.error}>
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}