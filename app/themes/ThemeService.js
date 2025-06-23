import { supabase } from '../lib/supabase';

// Fonction pour récupérer tous les thèmes
export async function getThemes() {
  try {
    const { data, error } = await supabase
      .from('themes')
      .select('*');
    
    if (error) {
      console.error('Erreur lors de la récupération des thèmes:', error.message);
      return { success: false, message: error.message };
    }
    
    return { success: true, themes: data };
  } catch (err) {
    console.error('Exception lors de la récupération des thèmes:', err);
    return { success: false, message: err.message || 'Une erreur inconnue est survenue' };
  }
}

// // Fonction pour créer un nouveau thème
// export async function createTheme(name) {
//   try {
//     const { data, error } = await supabase
//       .from('themes')
//       .insert([{ name }])
//       .select();
    
//     if (error) {
//       console.error('Erreur lors de la création du thème:', error.message);
//       return { success: false, message: error.message };
//     }
    
//     return { success: true, theme: data[0] };
//   } catch (err) {
//     console.error('Exception lors de la création du thème:', err);
//     return { success: false, message: err.message || 'Une erreur inconnue est survenue' };
//   }
// }
