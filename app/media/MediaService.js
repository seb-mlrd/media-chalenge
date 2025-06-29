import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Fonction pour uploader un fichier vers Supabase Storage
export async function uploadMedia(file, userId) {
  try {
    if (!file) {
      return { success: false, message: 'Aucun fichier fourni' };
    }

    // Vérifier que userId est bien défini
    if (!userId) {
      console.error('ID utilisateur manquant pour l\'upload');
      return { success: false, message: 'Erreur: ID utilisateur non fourni pour l\'upload' };
    }

    // Générer un nom de fichier unique pour éviter les collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Créer un chemin d'accès sans sous-dossier pour simplifier les permissions
    // const filePath = `${userId}/${fileName}`;
    const filePath = fileName; // Utiliser uniquement le nom du fichier sans sous-dossier
    
    console.log(`Tentative d'upload vers Supabase Storage:`);
    console.log(`- Bucket: media`);
    console.log(`- Fichier: ${fileName}`);
    console.log(`- Chemin: ${filePath}`);
    console.log(`- User ID: ${userId}`);
    console.log(`- Type: ${file.type}`);
    console.log(`- Taille: ${(file.size / 1024).toFixed(2)} KB`);

    // Upload du fichier - essai avec configuration simplifiée
    const { data, error } = await supabase.storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Erreur détaillée lors de l\'upload:', error);
      
      // Tenter de diagnostiquer le problème
      if (error.message.includes('security policy')) {
        return { 
          success: false, 
          message: `Erreur de permission: Vérifiez les politiques de sécurité du bucket. ` +
            `Ajoutez une policy de type INSERT simple: (auth.role() = 'authenticated')` 
        };
      }
      
      return { 
        success: false, 
        message: `Erreur d'upload (${error.statusCode}): ${error.message}. ` +
          `Vérifiez que le bucket 'media' existe et que l'utilisateur est authentifié.` 
      };
    }

    // Récupérer l'URL publique du fichier
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return { 
      success: true, 
      media: {
        url: publicUrl,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        mime_type: file.type,
        file_name: fileName,
        file_path: filePath,
        user_id: userId
      }
    };
  } catch (err) {
    console.error('Exception lors de l\'upload du média:', err);
    return { success: false, message: err.message || 'Une erreur inconnue est survenue' };
  }
}

// Fonction pour sauvegarder les métadonnées du média dans la base de données
export async function saveMediaMetadata(articleId, mediaData) {
  try {
    const { data, error } = await supabase
      .from('media')
      .insert([{
        article_id: articleId,
        type: mediaData.type,
        url: mediaData.url,
        mime_type: mediaData.mime_type,
      }])
      .select();

    if (error) {
      console.error('Erreur lors de l\'enregistrement des métadonnées:', error.message);
      return { success: false, message: error.message };
    }

    return { success: true, media: data[0] };
  } catch (err) {
    console.error('Exception lors de l\'enregistrement des métadonnées:', err);
    return { success: false, message: err.message || 'Une erreur inconnue est survenue' };
  }
}

// Fonction pour supprimer un média
export async function deleteMedia(filePath) {
  try {
    const { error } = await supabase.storage
      .from('media')
      .remove([filePath]);

    if (error) {
      console.error('Erreur lors de la suppression du média:', error.message);
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Exception lors de la suppression du média:', err);
    return { success: false, message: err.message || 'Une erreur inconnue est survenue' };
  }
}