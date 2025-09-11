import { supabase } from '../integrations/supabase/client';
import { AstroData } from './astro';

export interface UserProfile {
  id?: string;
  user_id: string;
  birth_date: string;
  birth_place: string;
  birth_time: string;
  energy_time: string; // moment de forme (firstName)
  resource: string; // ressource (lastName)
  group_role: string;
  priority: string;
  astro_data?: AstroData; // Données astrologiques complètes
  created_at?: string;
  updated_at?: string;
}

export class ProfileService {
  /**
   * Sauvegarde le profil utilisateur avec les données d'onboarding
   */
  static async saveUserProfile(profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> {
    try {
      console.log('💾 [ProfileService] Sauvegarde du profil utilisateur...', profileData);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: profileData.user_id,
          birth_date: profileData.birth_date,
          birth_place: profileData.birth_place,
          birth_time: profileData.birth_time,
          energy_time: profileData.energy_time,
          resource: profileData.resource,
          group_role: profileData.group_role,
          priority: profileData.priority,
          astro_data: profileData.astro_data,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [ProfileService] Erreur lors de la sauvegarde:', error);
        throw error;
      }

      console.log('✅ [ProfileService] Profil sauvegardé avec succès:', data);
      return data;
    } catch (error) {
      console.error('❌ [ProfileService] Erreur lors de la sauvegarde du profil:', error);
      throw error;
    }
  }

  /**
   * Met à jour les données astrologiques du profil
   */
  static async updateAstroData(userId: string, astroData: AstroData): Promise<void> {
    try {
      console.log('🔮 [ProfileService] Mise à jour des données astrologiques...', userId);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          astro_data: astroData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('❌ [ProfileService] Erreur lors de la mise à jour astro:', error);
        throw error;
      }

      console.log('✅ [ProfileService] Données astrologiques mises à jour');
    } catch (error) {
      console.error('❌ [ProfileService] Erreur lors de la mise à jour des données astrologiques:', error);
      throw error;
    }
  }

  /**
   * Récupère le profil utilisateur complet
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('📖 [ProfileService] Récupération du profil utilisateur...', userId);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('ℹ️ [ProfileService] Aucun profil trouvé pour cet utilisateur');
          return null;
        }
        console.error('❌ [ProfileService] Erreur lors de la récupération:', error);
        throw error;
      }

      console.log('✅ [ProfileService] Profil récupéré avec succès:', data);
      return data;
    } catch (error) {
      console.error('❌ [ProfileService] Erreur lors de la récupération du profil:', error);
      throw error;
    }
  }

  /**
   * Supprime le profil utilisateur
   */
  static async deleteUserProfile(userId: string): Promise<void> {
    try {
      console.log('🗑️ [ProfileService] Suppression du profil utilisateur...', userId);
      
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('❌ [ProfileService] Erreur lors de la suppression:', error);
        throw error;
      }

      console.log('✅ [ProfileService] Profil supprimé avec succès');
    } catch (error) {
      console.error('❌ [ProfileService] Erreur lors de la suppression du profil:', error);
      throw error;
    }
  }
}
