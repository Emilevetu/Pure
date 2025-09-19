import { supabase } from '../integrations/supabase/client';
import { AstroData } from './astro';
import { ChatGPTService } from './chatgpt-service';

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
      
      // Construire le payload en excluant les champs undefined pour éviter d'écraser astro_data
      const payload: any = {
        user_id: profileData.user_id,
        birth_date: profileData.birth_date,
        birth_place: profileData.birth_place,
        birth_time: profileData.birth_time,
        energy_time: profileData.energy_time,
        resource: profileData.resource,
        group_role: profileData.group_role,
        priority: profileData.priority,
        updated_at: new Date().toISOString()
      };

      // N'ajouter astro_data que s'il est fourni pour ne pas le remettre à null
      if (typeof profileData.astro_data !== 'undefined') {
        payload.astro_data = profileData.astro_data;
      }

      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .upsert(payload, {
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
      
      const { error } = await (supabase as any)
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
      
      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

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
   * Sauvegarde le profil utilisateur et lance l'analyse LLM en arrière-plan
   */
  static async saveUserProfileWithAnalysis(
    profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>,
    onAnalysisComplete?: (analysis: string) => void
  ): Promise<UserProfile> {
    try {
      console.log('💾 [ProfileService] Sauvegarde du profil avec analyse LLM...', profileData);
      
      // 1. Sauvegarder le profil
      const savedProfile = await this.saveUserProfile(profileData);
      
      // 2. Lancer l'analyse LLM en arrière-plan
      console.log('🤖 [ProfileService] Lancement de l\'analyse LLM en arrière-plan...');
      this.generateProfileAnalysisInBackground(savedProfile, onAnalysisComplete);
      
      return savedProfile;
    } catch (error) {
      console.error('❌ [ProfileService] Erreur lors de la sauvegarde avec analyse:', error);
      throw error;
    }
  }

  /**
   * Génère l'analyse de profil en arrière-plan
   */
  private static async generateProfileAnalysisInBackground(
    profile: UserProfile,
    onComplete?: (analysis: string) => void
  ): Promise<void> {
    try {
      // Attendre que les données astrologiques soient disponibles
      let astroData = profile.astro_data;
      
      // Si pas de données astrologiques, attendre un peu et réessayer
      if (!astroData) {
        console.log('⏳ [ProfileService] Attente des données astrologiques...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2 secondes
        
        // Récupérer le profil mis à jour
        const updatedProfile = await this.getUserProfile(profile.user_id);
        astroData = updatedProfile?.astro_data;
      }
      
      if (astroData) {
        // Préparer les données de profil pour l'analyse
        const profileData = {
          energy: profile.energy_time,
          resources: profile.resource,
          role: profile.group_role,
          priority: profile.priority
        };
        
        console.log('🔍 [ProfileService] Lancement de l\'analyse de profil...');
        const analysis = await ChatGPTService.generateProfileAnalysis(astroData, profileData);
        
        if (analysis.content && onComplete) {
          console.log('✅ [ProfileService] Analyse de profil terminée');
          onComplete(analysis.content);
        } else {
          console.error('❌ [ProfileService] Erreur analyse profil:', analysis.error);
        }
      } else {
        console.log('⚠️ [ProfileService] Pas de données astrologiques disponibles pour l\'analyse');
      }
    } catch (error) {
      console.error('❌ [ProfileService] Erreur lors de l\'analyse de profil en arrière-plan:', error);
    }
  }

  /**
   * Supprime le profil utilisateur
   */
  static async deleteUserProfile(userId: string): Promise<void> {
    try {
      console.log('🗑️ [ProfileService] Suppression du profil utilisateur...', userId);
      
      const { error } = await (supabase as any)
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
