import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeleteUserRequest {
  user_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Vérifier l'authentification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header manquant');
    }

    // Créer le client Supabase avec les permissions admin
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Créer un client pour vérifier l'utilisateur actuel
    const userSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Vérifier que l'utilisateur est authentifié
    const { data: { user }, error: authError } = await userSupabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Utilisateur non authentifié');
    }

    const { user_id }: DeleteUserRequest = await req.json();
    
    // Vérifier que l'utilisateur supprime son propre compte
    if (user.id !== user_id) {
      throw new Error('Vous ne pouvez supprimer que votre propre compte');
    }

    console.log('🗑️ Début suppression utilisateur:', user_id);

    // 1. Supprimer les données utilisateur via la fonction RPC
    console.log('🔄 Suppression des données utilisateur...');
    const { error: rpcError } = await supabase.rpc('delete_user_completely', {
      user_id: user_id
    });

    if (rpcError) {
      console.error('Erreur RPC:', rpcError);
      throw new Error(`Erreur lors de la suppression des données: ${rpcError.message}`);
    }

    console.log('✅ Données utilisateur supprimées');

    // 2. Supprimer l'utilisateur de l'authentification avec les permissions admin
    console.log('🔄 Suppression du compte d\'authentification...');
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user_id);

    if (deleteError) {
      console.error('Erreur suppression auth:', deleteError);
      throw new Error(`Erreur lors de la suppression du compte d'authentification: ${deleteError.message}`);
    }

    console.log('✅ Compte d\'authentification supprimé');
    console.log('🎉 Suppression complète réussie !');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Compte supprimé avec succès de toutes les bases de données' 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('❌ Erreur dans delete-user function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erreur lors de la suppression du compte' 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);