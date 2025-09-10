/**
 * Client API centralisé pour l'application
 * Gère tous les appels vers le backend avec gestion d'erreur et configuration
 */

import { config } from './config';
import { supabase } from '@/integrations/supabase/client';

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Configuration de l'API
const API_CONFIG = {
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Classe pour gérer les erreurs API
 */
class ApiErrorHandler extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Classe principale pour les appels API
 */
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
    this.headers = { ...API_CONFIG.headers };
  }

  /**
   * Ajoute un token d'authentification aux headers
   */
  setAuthToken(token: string): void {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Supprime le token d'authentification
   */
  clearAuthToken(): void {
    delete this.headers['Authorization'];
  }

  /**
   * Effectue un appel API avec gestion d'erreur et timeout
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Configuration de la requête
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    };

    try {
      // Gestion du timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Vérification du statut HTTP
      if (!response.ok) {
        throw new ApiErrorHandler(
          `Erreur HTTP: ${response.status}`,
          response.status
        );
      }

      // Parsing de la réponse
      const data = await response.json();
      
      return {
        success: true,
        data,
      };

    } catch (error) {
      if (error instanceof ApiErrorHandler) {
        throw error;
      }

      if (error.name === 'AbortError') {
        throw new ApiErrorHandler(
          'Délai d\'attente dépassé',
          408
        );
      }

      throw new ApiErrorHandler(
        error.message || 'Erreur réseau inconnue',
        500
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Instance singleton du client API
export const apiClient = new ApiClient();

// Configuration automatique du token d'authentification
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('pure_token');
  if (token) {
    apiClient.setAuthToken(token);
  }
}

/**
 * Fonctions utilitaires pour les appels API spécifiques
 */

// API Astrologie
export const astroAPI = {
  /**
   * Récupère les données astrologiques
   */
  async getAstroData(birthData: {
    date: string;
    time: string;
    place: string;
  }): Promise<ApiResponse<any>> {
    return apiClient.post('/astro/calculate', birthData);
  },

  /**
   * Récupère l'interprétation d'un thème astral
   */
  async getInterpretation(astroData: any): Promise<ApiResponse<any>> {
    return apiClient.post('/astro/interpret', astroData);
  },

  /**
   * Récupère les aspects entre planètes
   */
  async getAspects(planets: string[]): Promise<ApiResponse<any>> {
    return apiClient.post('/astro/aspects', { planets });
  },
};

// API OpenAI/ChatGPT
export const openaiAPI = {
  /**
   * Génère une interprétation avec ChatGPT
   */
  async generateInterpretation(prompt: string): Promise<ApiResponse<any>> {
    return apiClient.post('/openai/generate', { prompt });
  },

  /**
   * Analyse un thème astral avec IA
   */
  async analyzeChart(chartData: any): Promise<ApiResponse<any>> {
    return apiClient.post('/openai/analyze', chartData);
  },
};

// API Utilisateur
export const userAPI = {
  // Note: login and register are now handled by AuthContext, these functions are deprecated

  /**
   * Récupère le profil utilisateur
   */
  async getProfile(): Promise<ApiResponse<any>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // L'utilisateur n'existe pas dans la table users, le créer
        console.log('🔍 Création de l\'utilisateur dans la table users...');
                     const { data: newUser, error: createUserError } = await supabase
               .from('users')
               .insert({
                 id: user.id,
                 email: user.email!,
                 name: user.user_metadata?.name || user.email!.split('@')[0]
               })
               .select()
               .single();

        if (createUserError) {
          console.error('❌ Erreur lors de la création de l\'utilisateur:', createUserError);
          return { success: false, error: `Erreur lors de la création du profil: ${createUserError.message}` };
        }
        
        console.log('✅ Utilisateur créé dans la table users');
        return { success: true, data: newUser };
      } else if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: userData };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erreur lors de la récupération du profil' };
    }
  },

  /**
   * Sauvegarde un thème astral
   */
  async saveChart(chartData: any): Promise<ApiResponse<any>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      // Vérifier si l'utilisateur existe dans la table users, sinon le créer
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (userCheckError && userCheckError.code === 'PGRST116') {
        // L'utilisateur n'existe pas, le créer
        console.log('🔍 Création de l\'utilisateur dans la table users...');
        const { error: createUserError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name || user.email!.split('@')[0]
          });

        if (createUserError) {
          console.error('❌ Erreur lors de la création de l\'utilisateur:', createUserError);
          return { success: false, error: `Erreur lors de la création du profil: ${createUserError.message}` };
        }
        console.log('✅ Utilisateur créé dans la table users');
      } else if (userCheckError) {
        console.error('❌ Erreur lors de la vérification de l\'utilisateur:', userCheckError);
        return { success: false, error: `Erreur lors de la vérification du profil: ${userCheckError.message}` };
      }

      // Maintenant sauvegarder le thème astral
      const { data, error } = await supabase
        .from('astrology_charts')
        .insert({
          user_id: user.id,
          name: chartData.name || 'Thème astral',
          description: chartData.description || '',
          type: 'natal',
          birth_data: chartData.birthData,
          planetary_positions: chartData.planetaryData,
          astro_interpretation: chartData.astroData,
          is_public: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur lors de la sauvegarde du thème:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Thème astral sauvegardé avec succès');
      return { success: true, data };
    } catch (error: any) {
      console.error('❌ Erreur générale lors de la sauvegarde:', error);
      return { success: false, error: error.message || 'Erreur lors de la sauvegarde' };
    }
  },

  /**
   * Récupère les thèmes sauvegardés
   */
  async getSavedCharts(): Promise<ApiResponse<any>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const { data, error } = await supabase
        .from('astrology_charts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur lors de la récupération des thèmes:', error);
        return { success: false, error: error.message };
      }

      console.log('📊 Thèmes récupérés de la base de données:', data);
      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erreur lors de la récupération des thèmes' };
    }
  },
};

/**
 * Hook pour gérer les erreurs API globalement
 */
export function handleApiError(error: ApiErrorHandler): void {
  if (config.features.enableDebugMode) {
    console.error('🚨 Erreur API:', {
      message: error.message,
      status: error.status,
      code: error.code,
    });
  }

  // Ici vous pouvez ajouter la logique pour afficher les erreurs à l'utilisateur
  // Par exemple, avec un système de toast ou de notification
}
