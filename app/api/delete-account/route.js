import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'UserId manquant' }), { status: 400 });
    }

    // Supprimer le profil dans la table 'profils'
    const { error: deleteProfileError } = await supabaseAdmin
      .from('profils')
      .delete()
      .eq('user_id', userId);

    if (deleteProfileError) {
      return new Response(JSON.stringify({ error: deleteProfileError.message }), { status: 500 });
    }

    // Supprimer l'utilisateur Supabase (auth)
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      return new Response(JSON.stringify({ error: deleteUserError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Compte supprimé' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
