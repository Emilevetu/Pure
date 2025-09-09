import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Créer le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types TypeScript pour la base de données
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          password_hash: string
          birth_date: string | null
          birth_time: string | null
          birth_place: string | null
          birth_coordinates: string | null
          age: number | null
          gender: string | null
          country: string | null
          city: string | null
          hobbies: any | null
          sports: any | null
          work_field: string | null
          work_status: string | null
          relationship_status: string | null
          social_circle: any | null
          current_challenges: any | null
          goals: any | null
          language: string
          timezone: string | null
          notification_preferences: any | null
          created_at: string
          last_login: string | null
          login_count: number
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          name: string
          password_hash: string
          birth_date?: string | null
          birth_time?: string | null
          birth_place?: string | null
          birth_coordinates?: string | null
          age?: number | null
          gender?: string | null
          country?: string | null
          city?: string | null
          hobbies?: any | null
          sports?: any | null
          work_field?: string | null
          work_status?: string | null
          relationship_status?: string | null
          social_circle?: any | null
          current_challenges?: any | null
          goals?: any | null
          language?: string
          timezone?: string | null
          notification_preferences?: any | null
          created_at?: string
          last_login?: string | null
          login_count?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          name?: string
          password_hash?: string
          birth_date?: string | null
          birth_time?: string | null
          birth_place?: string | null
          birth_coordinates?: string | null
          age?: number | null
          gender?: string | null
          country?: string | null
          city?: string | null
          hobbies?: any | null
          sports?: any | null
          work_field?: string | null
          work_status?: string | null
          relationship_status?: string | null
          social_circle?: any | null
          current_challenges?: any | null
          goals?: any | null
          language?: string
          timezone?: string | null
          notification_preferences?: any | null
          created_at?: string
          last_login?: string | null
          login_count?: number
          is_active?: boolean
        }
      }
      astrology_charts: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          type: string
          birth_data: any | null
          planetary_positions: any | null
          astro_interpretation: any | null
          is_public: boolean
          view_count: number
          share_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          type?: string
          birth_data?: any | null
          planetary_positions?: any | null
          astro_interpretation?: any | null
          is_public?: boolean
          view_count?: number
          share_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          type?: string
          birth_data?: any | null
          planetary_positions?: any | null
          astro_interpretation?: any | null
          is_public?: boolean
          view_count?: number
          share_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_connections: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: string
          created_at?: string
        }
      }
      user_recommendations: {
        Row: {
          id: string
          user_id: string
          type: string | null
          title: string | null
          content: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type?: string | null
          title?: string | null
          content?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string | null
          title?: string | null
          content?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      user_analytics: {
        Row: {
          id: string
          user_id: string
          event_type: string | null
          event_data: any | null
          page_url: string | null
          device_info: any | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_type?: string | null
          event_data?: any | null
          page_url?: string | null
          device_info?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: string | null
          event_data?: any | null
          page_url?: string | null
          device_info?: any | null
          created_at?: string
        }
      }
    }
  }
}

// Types exportés pour l'utilisation dans l'application
export type User = Database['public']['Tables']['users']['Row']
export type AstrologyChart = Database['public']['Tables']['astrology_charts']['Row']
export type UserConnection = Database['public']['Tables']['user_connections']['Row']
export type UserRecommendation = Database['public']['Tables']['user_recommendations']['Row']
export type UserAnalytics = Database['public']['Tables']['user_analytics']['Row']
