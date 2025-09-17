import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/lib/api';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Star,
  Calendar,
  MapPin,
  Clock,
  Zap,
  Heart,
  Users,
  Target,
  Sun,
  Moon,
  Orbit,
  Edit,
  Settings,
  LogOut
} from 'lucide-react';
import { ProfileService, UserProfile } from '../lib/profile-service';
import { fetchAstroData } from '@/lib/astro';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { logout } = useAuth();
  const [chartsCount, setChartsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [astroLoading, setAstroLoading] = useState(false);

  // Cache configuration
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const CACHE_KEYS = {
    profile: 'profile_cache',
    chartsCount: 'charts_count_cache',
    timestamp: 'profile_cache_timestamp'
  };

  // Cache functions
  const isCacheValid = (): boolean => {
    const timestamp = localStorage.getItem(CACHE_KEYS.timestamp);
    if (!timestamp) return false;
    return (Date.now() - parseInt(timestamp)) < CACHE_DURATION;
  };

  const loadFromCache = (): boolean => {
    if (!isCacheValid()) return false;
    
    try {
      const cachedProfile = localStorage.getItem(CACHE_KEYS.profile);
      const cachedChartsCount = localStorage.getItem(CACHE_KEYS.chartsCount);
      
      if (cachedProfile) {
        setUserProfile(JSON.parse(cachedProfile));
        console.log('✅ [Profile] Profil chargé depuis le cache');
      }
      if (cachedChartsCount) {
        setChartsCount(JSON.parse(cachedChartsCount));
        console.log('✅ [Profile] Nombre de thèmes chargé depuis le cache');
      }
      
      return true;
    } catch (error) {
      console.error('❌ [Profile] Erreur lors du chargement du cache:', error);
      return false;
    }
  };

  const saveToCache = (profileData: UserProfile | null, chartsCountData: number) => {
    try {
      if (profileData) {
        localStorage.setItem(CACHE_KEYS.profile, JSON.stringify(profileData));
      }
      localStorage.setItem(CACHE_KEYS.chartsCount, JSON.stringify(chartsCountData));
      localStorage.setItem(CACHE_KEYS.timestamp, Date.now().toString());
      console.log('💾 [Profile] Données sauvegardées dans le cache');
    } catch (error) {
      console.error('❌ [Profile] Erreur lors de la sauvegarde du cache:', error);
    }
  };

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEYS.profile);
    localStorage.removeItem(CACHE_KEYS.chartsCount);
    localStorage.removeItem(CACHE_KEYS.timestamp);
    console.log('🗑️ [Profile] Cache vidé');
  };

  useEffect(() => {
    if (user) {
      console.log('🔍 [Profile] useEffect - user trouvé, chargement des données');
      
      // Essayer de charger depuis le cache d'abord
      if (loadFromCache()) {
        setIsLoading(false);
        setProfileLoading(false);
        // Charger en arrière-plan pour mettre à jour le cache
        loadProfileData(true);
      } else {
        // Pas de cache valide, charger normalement
        loadProfileData();
      }
    } else {
      console.log('🔍 [Profile] useEffect - pas de user, pas de chargement');
    }
  }, [user]);

  // Timeout de sécurité pour éviter le chargement infini
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading || profileLoading) {
        console.log('⏰ [Profile] Timeout de sécurité - arrêt du chargement après 10s');
        setIsLoading(false);
        setProfileLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [isLoading, profileLoading]);

  const loadProfileData = async (backgroundRefresh = false) => {
    if (!user?.id) {
      console.log('❌ [Profile] Pas d\'ID utilisateur disponible');
      return;
    }

    try {
      console.log('🔍 [Profile] loadProfileData DÉBUT', backgroundRefresh ? '(background refresh)' : '');
      
      if (!backgroundRefresh) {
        setIsLoading(true);
        setProfileLoading(true);
      }

      // Charger le profil et le nombre de thèmes en parallèle
      const [profile, chartsResponse] = await Promise.all([
        ProfileService.getUserProfile(user.id),
        userAPI.getSavedCharts()
      ]);

      console.log('📊 [Profile] Données reçues:');
      console.log('  - profile:', profile);
      console.log('  - chartsResponse:', chartsResponse);

      // Mettre à jour les états
      if (profile) {
        setUserProfile(profile);
        console.log('✅ [Profile] Profil chargé:', profile);
      }

      if (chartsResponse.success && chartsResponse.data) {
        const count = chartsResponse.data.length;
        setChartsCount(count);
        console.log('✅ [Profile] Nombre de thèmes chargé:', count);
      }

      // Sauvegarder dans le cache
      saveToCache(profile, chartsResponse.success && chartsResponse.data ? chartsResponse.data.length : 0);

    } catch (error) {
      console.error('❌ [Profile] Erreur dans loadProfileData:', error);
    } finally {
      if (!backgroundRefresh) {
        console.log('🏁 [Profile] loadProfileData FIN - isLoading: false');
        setIsLoading(false);
        setProfileLoading(false);
      }
    }
  };

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper pour obtenir l'icône de chaque planète
  const getPlanetIcon = (planetName: string) => {
    const icons: { [key: string]: React.ElementType } = {
      'soleil': Sun,
      'sun': Sun,
      'lune': Moon,
      'moon': Moon,
      'mercure': Orbit,
      'mercury': Orbit,
      'vénus': Heart,
      'venus': Heart,
      'mars': Target,
      'jupiter': Star,
      'saturne': Orbit,
      'saturn': Orbit
    };
    
    return icons[planetName.toLowerCase()] || Star;
  };

  // Helper pour obtenir le nom français des planètes
  const getPlanetDisplayName = (planetKey: string) => {
    const names: { [key: string]: string } = {
      'sun': 'Soleil',
      'moon': 'Lune', 
      'mercury': 'Mercure',
      'venus': 'Vénus',
      'mars': 'Mars',
      'jupiter': 'Jupiter',
      'saturn': 'Saturne'
    };
    
    return names[planetKey] || planetKey;
  };

  // Action: calculer et enregistrer le thème astral
  const handleCalculateAstro = async () => {
    if (!user || !userProfile) return;
    try {
      setAstroLoading(true);
      console.log('🧮 [Profile] Calcul du thème astral...');
      const astro = await fetchAstroData({
        date: userProfile.birth_date,
        time: userProfile.birth_time,
        place: userProfile.birth_place,
      });
      await ProfileService.updateAstroData(user.id, astro);
      setUserProfile((prev) => (prev ? { ...prev, astro_data: astro } : prev));
      console.log('✅ [Profile] Thème astral calculé et sauvegardé');
    } catch (error) {
      console.error('❌ [Profile] Erreur lors du calcul du thème:', error);
    } finally {
      setAstroLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 pt-2">
        <div className="container mx-auto px-6 py-8 pb-24">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* En-tête du profil avec bouton Settings */}
            <div className="flex items-center justify-between">
              <div className="flex-1"></div>
              <div className="text-center space-y-2 flex-1">
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    Membre depuis {new Date(user.createdAt).getFullYear()}
                  </Badge>
                </div>
              </div>
              <div className="flex-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-0 flex items-center justify-center"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Données d'onboarding */}
            {profileLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className="mt-4 text-muted-foreground">Chargement de votre profil...</p>
                </CardContent>
              </Card>
            ) : userProfile ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>Mon profil</span>
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="p-2"
                      onClick={() => {
                        clearCache();
                        navigate('/onboarding');
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    Vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Date - Heure */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 p-2.5 bg-muted/20 rounded-lg">
                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground truncate">Date</p>
                        <p className="font-medium text-sm truncate">
                          {userProfile.birth_date ? new Date(userProfile.birth_date).toLocaleDateString('fr-FR').replace(/\//g, '-') : userProfile.birth_date}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-2.5 bg-muted/20 rounded-lg">
                      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground truncate">Heure</p>
                        <p className="font-medium text-sm truncate">{userProfile.birth_time}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lieu (seul sur la ligne) */}
                  <div className="flex items-center space-x-2 p-2.5 bg-muted/20 rounded-lg">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground truncate">Lieu</p>
                      <p className="font-medium text-sm truncate">{userProfile.birth_place}</p>
                    </div>
                  </div>
                  
                  {/* Énergie - Ressource */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 p-2.5 bg-muted/20 rounded-lg">
                      <Zap className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground truncate">Énergie</p>
                        <p className="font-medium text-sm truncate">{userProfile.energy_time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-2.5 bg-muted/20 rounded-lg">
                      <Heart className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground truncate">Ressource</p>
                        <p className="font-medium text-sm truncate">{userProfile.resource}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rôle - Priorité */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 p-2.5 bg-muted/20 rounded-lg">
                      <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground truncate">Rôle</p>
                        <p className="font-medium text-sm truncate">{userProfile.group_role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-2.5 bg-muted/20 rounded-lg">
                      <Target className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground truncate">Priorité</p>
                        <p className="font-medium text-sm truncate">{userProfile.priority}</p>
                      </div>
                    </div>
                  </div>
                 </CardContent>
               </Card>
             ) : (
               <Card>
                 <CardContent className="p-8 text-center">
                   <p className="text-muted-foreground">Aucune donnée de profil trouvée. Veuillez compléter votre onboarding.</p>
                 </CardContent>
               </Card>
             )}

            {/* Thème astral */}
            {userProfile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Mon thème astral</span>
                  </CardTitle>
                  <CardDescription>
                    Vos positions planétaires principales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!userProfile.astro_data ? (
                    <div className="space-y-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Calcul en cours… Votre thème est en cours de calcul et apparaîtra bientôt.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Ascendant et MC */}
                      {userProfile.astro_data.houseSystem && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-600 font-medium mb-1">Ascendant</p>
                            <p className="text-lg font-bold text-blue-800">
                              {userProfile.astro_data.houseSystem.ascendant.sign} {userProfile.astro_data.houseSystem.ascendant.degrees}°{userProfile.astro_data.houseSystem.ascendant.minutes}'
                            </p>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                            <p className="text-sm text-purple-600 font-medium mb-1">Milieu du Ciel</p>
                            <p className="text-lg font-bold text-purple-800">
                              {userProfile.astro_data.houseSystem.mc.sign} {userProfile.astro_data.houseSystem.mc.degrees}°{userProfile.astro_data.houseSystem.mc.minutes}'
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Planètes principales */}
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Planètes principales</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {/* Soleil - priorité 1 */}
                          {userProfile.astro_data.sun && (
                            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                              <Sun className="h-5 w-5 text-amber-600 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-amber-800 text-sm">Soleil</p>
                                <p className="text-xs text-amber-700">
                                  {userProfile.astro_data.sun.sign} • {userProfile.astro_data.sun.house}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {/* Lune - priorité 2 */}
                          {userProfile.astro_data.moon && (
                            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
                              <Moon className="h-5 w-5 text-slate-600 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-slate-800 text-sm">Lune</p>
                                <p className="text-xs text-slate-700">
                                  {userProfile.astro_data.moon.sign} • {userProfile.astro_data.moon.house}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {/* Autres planètes principales */}
                          {['mercury', 'venus', 'mars', 'jupiter'].map((planetKey) => {
                            const planetData = userProfile.astro_data[planetKey as keyof typeof userProfile.astro_data];
                            if (!planetData || typeof planetData !== 'object' || !('sign' in planetData)) return null;
                            
                            const IconComponent = getPlanetIcon(planetKey);
                            const displayName = getPlanetDisplayName(planetKey);
                            
                            return (
                              <div key={planetKey} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                                <IconComponent className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-sm">{displayName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {planetData.sign} • {planetData.house}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => navigate('/charts')}
                        >
                          <Star className="mr-2 h-4 w-4" />
                          Voir le thème complet
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Mes thèmes astraux</span>
                </CardTitle>
                <CardDescription>
                  Vos analyses sauvegardées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {isLoading ? '...' : chartsCount}
                    </p>
                    <p className="text-sm text-muted-foreground">Thèmes sauvegardés</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">0</p>
                    <p className="text-sm text-muted-foreground">Analyses partagées</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate('/charts')}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Voir mes thèmes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bouton Se déconnecter */}
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  clearCache();
                  logout();
                }}
                className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Profile;
