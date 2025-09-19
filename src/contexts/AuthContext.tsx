import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { userAPI } from '@/lib/api';
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
  const lastHandledUserId = useRef<string | null>(null);
  const profileEnsuredForUserId = useRef<string | null>(null);

  // Fonction pour récupérer les données utilisateur depuis la base de données
  const getUserFromDatabase = async (userId: string): Promise<Partial<User>> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, created_at')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Erreur récupération utilisateur DB:', error);
        return {};
      }

      if (data) {
        return {
          id: data.id,
          email: data.email,
          name: data.name,
          createdAt: data.created_at,
          updatedAt: new Date().toISOString(),
        };
      }

      return {};
    } catch (error) {
      console.error('❌ Erreur getUserFromDatabase:', error);
      return {};
    }
  };

  // Initialisation au chargement de l'application
  useEffect(() => {
    console.log('🔍 AuthContext: Initialisation Supabase...');

    const handleSessionChange = (event: string, session: Session | null) => {
      const currentUserId = session?.user?.id ?? null;
      const lastUserId = lastHandledUserId.current;

      // 🧹 NETTOYAGE: Si changement d'utilisateur, nettoyer les caches de l'ancien utilisateur
      if (lastUserId && currentUserId !== lastUserId) {
        console.log('🗑️ [AuthContext] Changement d\'utilisateur détecté, nettoyage des caches de l\'ancien utilisateur:', lastUserId);
        
        // Nettoyer le cache des amis de l'ancien utilisateur
        localStorage.removeItem(`friends_cache_${lastUserId}`);
        localStorage.removeItem(`requests_received_cache_${lastUserId}`);
        localStorage.removeItem(`requests_sent_cache_${lastUserId}`);
        localStorage.removeItem(`friends_cache_timestamp_${lastUserId}`);
        
        // Nettoyer le cache du profil de l'ancien utilisateur
        localStorage.removeItem(`profile_cache_${lastUserId}`);
        localStorage.removeItem(`charts_count_cache_${lastUserId}`);
        localStorage.removeItem(`profile_cache_timestamp_${lastUserId}`);
        
        console.log('✅ [AuthContext] Caches de l\'ancien utilisateur nettoyés');
      }

      // Éviter les doublons pour le même utilisateur lors de l'initialisation
      if (currentUserId && lastHandledUserId.current === currentUserId) {
        return;
      }
      lastHandledUserId.current = currentUserId;
      
      console.log('🔍 Auth state change:', event, session?.user?.email);

      if (session?.user) {
        console.log('✅ Profil chargé:', session.user.email);
        
        // 🚀 SOLUTION COMPLÈTE: Récupération depuis la base de données
        const createUserFromSession = async () => {
          // Tenter de récupérer les données depuis la DB
          const dbUserData = await getUserFromDatabase(session.user.id);
          
          // Utiliser les données DB si disponibles, sinon fallback sur session
          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            name: dbUserData.name || session.user.user_metadata?.name || session.user.email!.split('@')[0],
            createdAt: dbUserData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setAuthState({
            user,
            session,
            isAuthenticated: true,
            isLoading: false,
          });
          
          console.log('✅ [AuthContext] Utilisateur créé avec données DB:', { 
            fromDB: !!dbUserData.name, 
            name: user.name 
          });
        };

        // Exécution asynchrone pour récupérer les données DB
        createUserFromSession();

        // Assurer que le profil existe dans public.users (éviter les doublons)
        if (profileEnsuredForUserId.current !== session.user.id) {
          profileEnsuredForUserId.current = session.user.id;
          setTimeout(async () => {
            try {
              await userAPI.getProfile();
              console.log('✅ Profil synchronisé dans public.users');
            } catch (error) {
              console.error('❌ Erreur synchronisation profil:', error);
            }
          }, 0);
        }
      } else {
        setAuthState({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        });
        lastHandledUserId.current = null;
        profileEnsuredForUserId.current = null;
        
        // Rediriger vers la page de login si on n'y est pas déjà
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
    };

    // Configurer le listener - il gérera automatiquement la session initiale
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      handleSessionChange(event, session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);


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
      // Nettoyer tous les caches liés à l'utilisateur actuel
      const currentUserId = authState.user?.id;
      if (currentUserId) {
        console.log('🗑️ [AuthContext] Nettoyage des caches pour l\'utilisateur:', currentUserId);
        
        // Nettoyer le cache des amis
        localStorage.removeItem(`friends_cache_${currentUserId}`);
        localStorage.removeItem(`requests_received_cache_${currentUserId}`);
        localStorage.removeItem(`requests_sent_cache_${currentUserId}`);
        localStorage.removeItem(`friends_cache_timestamp_${currentUserId}`);
        
        // Nettoyer le cache du profil
        localStorage.removeItem(`profile_cache_${currentUserId}`);
        localStorage.removeItem(`charts_count_cache_${currentUserId}`);
        localStorage.removeItem(`profile_cache_timestamp_${currentUserId}`);
        
        console.log('✅ [AuthContext] Caches nettoyés');
      }
      
      await supabase.auth.signOut();
      // L'état sera mis à jour par onAuthStateChange
      // Rediriger vers la page de login
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // 🚀 SOLUTION COMPLÈTE: Rafraîchissement depuis la base de données
  const refreshUser = async (): Promise<void> => {
    if (!authState.isAuthenticated) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Récupérer les données actuelles depuis la DB
        const dbUserData = await getUserFromDatabase(session.user.id);
        
        // Forcer la mise à jour en réinitialisant le ref
        lastHandledUserId.current = null;
        
        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          name: dbUserData.name || session.user.user_metadata?.name || session.user.email!.split('@')[0],
          createdAt: dbUserData.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setAuthState({
          user,
          session,
          isAuthenticated: true,
          isLoading: false,
        });
        
        console.log('✅ [AuthContext] Utilisateur rafraîchi avec données DB:', { 
          fromDB: !!dbUserData.name, 
          name: user.name 
        });
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