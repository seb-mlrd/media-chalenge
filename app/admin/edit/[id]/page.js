'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import styles from '../../create/create.module.css';
import { fetchThemesService } from "@/services/articlesService";
import { uploadMedia, saveMediaMetadata, deleteMedia } from "@/app/media/MediaService";

export default function EditArticle() {
  const { id } = useParams();
  const router = useRouter();
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState();
  const [existingMedia, setExistingMedia] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState({
    title: '',
    theme: '',
    content: '',
  });

  const fetchThemes = async () => {
    const { data: themesData, error } = await fetchThemesService();
    if (error) {
        console.error('Erreur lors du chargement des thèmes:', error);
    } else {
        setThemes(themesData);
    }
  };

    useEffect(() => {
    const fetchArticle = async () => {
      const { data: articleData, error } = await supabase
        .from("articles")
        .select("*, media(*), themes(name)")
        .eq("id", id)
        .single();

      if (!error) {
        setArticle(articleData);
        setSelectedTheme(articleData.theme_id);
        setExistingMedia(articleData.media || []);
      }

        setLoading(false);
    };

    if (id) fetchArticle();
    fetchThemes();
    }, [id]);

  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase
            .from("articles")
            .update({
            title: article.title,
            theme_id: selectedTheme,
            content: article.content,
            updated_at: new Date(),
            })
            .eq("id", id);

        if (selectedImage) {
          const result = await uploadMedia(selectedImage, article.updated_by);
          if (result.success) {
            await saveMediaMetadata(id, result.media);
          }
        }

        // Si vidéo sélectionnée
        if (selectedVideo) {
          const result = await uploadMedia(selectedVideo, article.updated_by);
          if (result.success) {
            await saveMediaMetadata(id, result.media);
          }
        }

        if (error) {
            console.error("Erreur de mise à jour :", error);
        } else {
            router.push("/admin/articles");
        }
    };

  if (loading) return <p className="text-center mt-10 text-gray-600">Chargement...</p>;

  const handleSelectChange = async (e) => {
      const theme = e.target.value;
      setSelectedTheme(theme);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("video/")) {
      setSelectedVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteMedia = async (media) => {
    const confirmed = window.confirm("Confirmer la suppression de ce média ?");
    if (!confirmed) return;

    // 1. Supprimer le fichier du bucket
    const deleteResult = await deleteMedia(media.file_path);

    if (!deleteResult.success) {
      console.error("Erreur lors de la suppression du fichier :", deleteResult.message);
      return;
    }

    // 2. Supprimer l'entrée dans la table media
    const { error } = await supabase
      .from("media")
      .delete()
      .eq("id", media.id);

    if (error) {
      console.error("Erreur lors de la suppression du média de la BDD :", error.message);
      return;
    }

    // 3. Mettre à jour l'état local pour retirer le média supprimé
    setExistingMedia((prev) => prev.filter((m) => m.id !== media.id));
  };


  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-md rounded-lg">
      <button
        type="button"
        onClick={() => router.back()}
        className={styles.backButton}
      >
        <FaArrowLeft className={styles.icon} />
      </button>
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Modifier l’article</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-600">Titre</label>
          <input
            type="text"
            id="title"
            name="title"
            value={article.title}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
            <select
            className="border rounded-md p-2 bg-white text-gray-700 text-sm w-full"
            value={selectedTheme}
            onChange={handleSelectChange}
            >
            <option value="">-- Choisir un thème --</option>
            {themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                {theme.name}
                </option>
            ))}
            </select>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-600">Contenu</label>
          <textarea
            id="content"
            name="content"
            rows="6"
            value={article.content}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-600">Médias actuels</p>

          {existingMedia.map(media => (
            <div key={media.id} className="border p-2 rounded-md bg-gray-50 relative">
              {media.type === 'image' ? (
                <img src={media.url} alt="media" className="h-32 w-full object-cover rounded" />
              ) : (
                <video src={media.url} controls className="h-32 w-full rounded" />
              )}
              <button
                type="button"
                onClick={() => handleDeleteMedia(media)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          ))}
          
          <label className="block text-sm font-medium text-gray-600">Nouvelle image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {imagePreview && (
            <img src={imagePreview} alt="Prévisualisation" className="h-32 mt-2 rounded" />
          )}

          <label className="block text-sm font-medium text-gray-600 mt-4">Nouvelle vidéo</label>
          <input type="file" accept="video/*" onChange={handleVideoChange} />

          {videoPreview && (
            <video src={videoPreview} controls className="h-32 mt-2 rounded" />
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            <FaSave /> Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
}
