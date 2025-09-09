// API simplifiée pour éviter les timeouts et la complexité
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Configuration Supabase manquante');
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// API simplifiée pour les amis
export const friendsAPI = {
  // Envoyer une demande d'amitié - VERSION ULTRA SIMPLIFIÉE
  async sendFriendRequest(email: string): Promise<ApiResponse<any>> {
    try {
      // Vérifier l'utilisateur connecté
      const { data: { user }, error: userAuthError } = await supabase.auth.getUser();
      
      if (userAuthError || !user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      // Rechercher l'utilisateur cible
      const { data: targetUser, error: userError } = await supabase
        .from('users')
        .select('id, email, name')
        .eq('email', email)
        .single();

      if (userError) {
        if (userError.code === 'PGRST116') {
          return { success: false, error: 'Aucun utilisateur trouvé avec cet email. Cette personne doit d\'abord s\'inscrire sur l\'application.' };
        }
        return { success: false, error: 'Erreur lors de la vérification de l\'utilisateur' };
      }

      if (!targetUser) {
        return { success: false, error: 'Utilisateur non trouvé' };
      }

      // Vérifier qu'on ne s'ajoute pas soi-même
      if (targetUser.id === user.id) {
        return { success: false, error: 'Vous ne pouvez pas vous ajouter comme ami' };
      }

      // Vérifier les demandes existantes
      const { data: existingRequests, error: checkError } = await supabase
        .from('friends')
        .select('id, status')
        .or(`and(requester_id.eq.${user.id},addressee_id.eq.${targetUser.id}),and(requester_id.eq.${targetUser.id},addressee_id.eq.${user.id})`);

      if (checkError) {
        return { success: false, error: 'Erreur lors de la vérification des demandes' };
      }

      if (existingRequests && existingRequests.length > 0) {
        const existingRequest = existingRequests[0];
        if (existingRequest.status === 'accepted') {
          return { success: false, error: 'Vous êtes déjà amis avec cette personne' };
        } else if (existingRequest.status === 'pending') {
          return { success: false, error: 'Une demande d\'amitié est déjà en attente' };
        }
      }

      // Créer la demande d'amitié
      const { data: newRequest, error: insertError } = await supabase
        .from('friends')
        .insert({
          requester_id: user.id,
          addressee_id: targetUser.id,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError || !newRequest) {
        return { success: false, error: 'Erreur lors de la création de la demande' };
      }

      return { 
        success: true, 
        data: {
          id: newRequest.id,
          requester_id: newRequest.requester_id,
          addressee_id: newRequest.addressee_id,
          status: newRequest.status,
          created_at: newRequest.created_at
        }
      };
      
    } catch (error: any) {
      return { 
        success: false, 
        error: 'Erreur inattendue: ' + (error.message || 'Erreur inconnue')
      };
    }
  },

  // Récupérer les amis - VERSION SIMPLIFIÉE
  async getUserFriends(): Promise<ApiResponse<any>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const { data, error } = await supabase.rpc('get_user_friends', {
        user_id: user.id
      });

      if (error) {
        return { success: false, error: 'Erreur lors de la récupération des amis' };
      }

      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: 'Erreur lors de la récupération des amis' };
    }
  },

  // Récupérer les demandes reçues - VERSION SIMPLIFIÉE
  async getFriendRequestsReceived(): Promise<ApiResponse<any>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const { data, error } = await supabase.rpc('get_friend_requests_received', {
        user_id: user.id
      });

      if (error) {
        return { success: false, error: 'Erreur lors de la récupération des demandes' };
      }

      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: 'Erreur lors de la récupération des demandes' };
    }
  },

  // Récupérer les demandes envoyées - VERSION SIMPLIFIÉE
  async getFriendRequestsSent(): Promise<ApiResponse<any>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const { data, error } = await supabase.rpc('get_friend_requests_sent', {
        user_id: user.id
      });

      if (error) {
        return { success: false, error: 'Erreur lors de la récupération des demandes' };
      }

      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: 'Erreur lors de la récupération des demandes' };
    }
  },

  // Accepter une demande d'amitié - VERSION SIMPLIFIÉE
  async acceptFriendRequest(requestId: string): Promise<ApiResponse<any>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const { data, error } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .eq('addressee_id', user.id)
        .select()
        .single();

      if (error || !data) {
        return { success: false, error: 'Erreur lors de l\'acceptation de la demande' };
      }

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: 'Erreur lors de l\'acceptation de la demande' };
    }
  },

  // Refuser une demande d'amitié - VERSION SIMPLIFIÉE
  async rejectFriendRequest(requestId: string): Promise<ApiResponse<any>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const { data, error } = await supabase
        .from('friends')
        .update({ status: 'rejected' })
        .eq('id', requestId)
        .eq('addressee_id', user.id)
        .select()
        .single();

      if (error || !data) {
        return { success: false, error: 'Erreur lors du refus de la demande' };
      }

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: 'Erreur lors du refus de la demande' };
    }
  },

  // Supprimer un ami - VERSION SIMPLIFIÉE
  async removeFriend(friendId: string): Promise<ApiResponse<any>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const { data, error } = await supabase
        .from('friends')
        .delete()
        .or(`and(requester_id.eq.${user.id},addressee_id.eq.${friendId}),and(requester_id.eq.${friendId},addressee_id.eq.${user.id})`)
        .eq('status', 'accepted')
        .select()
        .single();

      if (error || !data) {
        return { success: false, error: 'Erreur lors de la suppression de l\'ami' };
      }

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: 'Erreur lors de la suppression de l\'ami' };
    }
  }
};
