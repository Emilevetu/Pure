export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      astrology_charts: {
        Row: {
          astro_interpretation: Json | null
          birth_data: Json
          created_at: string | null
          description: string | null
          id: string
          is_favorite: boolean | null
          is_public: boolean | null
          last_viewed_at: string | null
          name: string
          planetary_positions: Json | null
          share_count: number | null
          tags: string[] | null
          type: string | null
          updated_at: string | null
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          astro_interpretation?: Json | null
          birth_data: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          is_public?: boolean | null
          last_viewed_at?: string | null
          name: string
          planetary_positions?: Json | null
          share_count?: number | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          astro_interpretation?: Json | null
          birth_data?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          is_public?: boolean | null
          last_viewed_at?: string | null
          name?: string
          planetary_positions?: Json | null
          share_count?: number | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "astrology_charts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      friends: {
        Row: {
          addressee_id: string
          created_at: string | null
          id: string
          requester_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          addressee_id: string
          created_at?: string | null
          id?: string
          requester_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          addressee_id?: string
          created_at?: string | null
          id?: string
          requester_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          astro_data: Json | null
          birth_date: string
          birth_place: string
          birth_time: string
          created_at: string
          energy_time: string
          group_role: string
          id: string
          priority: string
          resource: string
          updated_at: string
          user_id: string
        }
        Insert: {
          astro_data?: Json | null
          birth_date: string
          birth_place: string
          birth_time: string
          created_at?: string
          energy_time: string
          group_role: string
          id?: string
          priority: string
          resource: string
          updated_at?: string
          user_id: string
        }
        Update: {
          astro_data?: Json | null
          birth_date?: string
          birth_place?: string
          birth_time?: string
          created_at?: string
          energy_time?: string
          group_role?: string
          id?: string
          priority?: string
          resource?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login: string | null
          location: string | null
          login_count: number | null
          name: string
          timezone: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          email: string
          id: string
          is_active?: boolean | null
          last_login?: string | null
          location?: string | null
          login_count?: number | null
          name: string
          timezone?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          location?: string | null
          login_count?: number | null
          name?: string
          timezone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
