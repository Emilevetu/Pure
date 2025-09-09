import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Types pour l'authentification
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  needsEmailConfirmation?: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Provider du contexte d'authentification
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Initialisation au chargement de l'application
  useEffect(() => {
    console.log('🔍 AuthContext: Initialisation Supabase...');
    
    // Récupérer la session existante
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erreur session:', error);
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        if (session?.user) {
          console.log('✅ Session trouvée:', session.user.email);
          await loadUserProfile(session.user, session);
        } else {
          console.log('ℹ️ Aucune session active');
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('❌ Erreur initialisation:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔍 Auth state change:', event, session?.user?.email);
        
        if (session?.user && !isLoadingProfile) {
          loadUserProfile(session.user, session);
        } else if (!session) {
          setAuthState({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          });
          setIsLoadingProfile(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fonction pour charger le profil utilisateur
  const loadUserProfile = async (supabaseUser: SupabaseUser, session: Session) => {
    if (isLoadingProfile) return; // Éviter les chargements multiples
    
    setIsLoadingProfile(true);
    try {
      console.log('🔍 Chargement profil:', supabaseUser.email);
      
      const user: User = {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('✅ Profil chargé:', user);
      setAuthState({
        user,
        session,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
      const user: User = {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAuthState({
        user,
        session,
        isAuthenticated: true,
        isLoading: false,
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Fonction de connexion
  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { 
          success: false, 
          error: error.message || 'Erreur de connexion' 
        };
      }

      if (data.user) {
        // La session sera gérée par onAuthStateChange
        return { success: true };
      }

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        error: 'Erreur de connexion' 
      };
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        error: error.message || 'Erreur de connexion' 
      };
    }
  };

  // Fonction d'inscription
  const register = async (data: RegisterData): Promise<AuthResult> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: data.name
          }
        }
      });

      if (error) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { 
          success: false, 
          error: error.message || 'Erreur d\'inscription' 
        };
      }

      if (signUpData.user) {
        console.log('🔍 Inscription réussie:', {
          user: signUpData.user.email,
          emailConfirmed: signUpData.user.email_confirmed_at
        });
        
        // Vérifier si une confirmation d'email est nécessaire
        if (!signUpData.session || !signUpData.user.email_confirmed_at) {
          console.log('📧 Confirmation d\'email nécessaire');
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return { 
            success: true, 
            needsEmailConfirmation: true 
          };
        }
        
        console.log('✅ Email déjà confirmé');
        return { success: true };
      }

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        error: 'Erreur d\'inscription' 
      };
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        error: error.message || 'Erreur d\'inscription' 
      };
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // L'état sera mis à jour par onAuthStateChange
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Fonction de rafraîchissement du profil utilisateur
  const refreshUser = async (): Promise<void> => {
    if (!authState.isAuthenticated) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user, session);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du profil:', error);
    }
  };

  // Valeur du contexte
  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour vérifier si l'utilisateur est authentifié
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    shouldRedirect: !isLoading && !isAuthenticated,
  };
};

// Hook pour obtenir les informations de l'utilisateur connecté
export const useUser = () => {
  const { user, isAuthenticated } = useAuth();
  
  return {
    user,
    isAuthenticated,
    isLoggedIn: isAuthenticated && !!user,
  };
};