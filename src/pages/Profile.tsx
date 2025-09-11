import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/AuthContext';
import { userAPI } from '@/lib/api';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Star,
  Calendar,
  MapPin,
  Clock,
  Zap,
  Heart,
  Users,
  Target
} from 'lucide-react';
import { ProfileService, UserProfile } from '../lib/profile-service';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [chartsCount, setChartsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadChartsCount();
      loadUserProfile();
    }
  }, [user]);

  const loadChartsCount = async () => {
    try {
      const response = await userAPI.getSavedCharts();
      if (response.success && response.data) {
        setChartsCount(response.data.length);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du nombre de thèmes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      console.log('📖 [Profile] Chargement du profil utilisateur...');
      const profile = await ProfileService.getUserProfile(user.id);
      setUserProfile(profile);
      console.log('✅ [Profile] Profil chargé:', profile);
    } catch (error) {
      console.error('❌ [Profile] Erreur lors du chargement du profil:', error);
    } finally {
      setProfileLoading(false);
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

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* En-tête du profil */}
            <div className="text-center space-y-4">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <Badge variant="secondary" className="mt-2">
                  Membre depuis {new Date(user.createdAt).getFullYear()}
                </Badge>
              </div>
            </div>

            {/* Données d'onboarding */}
            {userProfile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Mon profil</span>
                  </CardTitle>
                  <CardDescription>
                    Vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Né(e) le</p>
                        <p className="font-medium">{userProfile.birth_date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Lieu de naissance</p>
                        <p className="font-medium">{userProfile.birth_place}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Heure de naissance</p>
                        <p className="font-medium">{userProfile.birth_time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Zap className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Énergie</p>
                        <p className="font-medium">{userProfile.energy_time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Heart className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Ressource</p>
                        <p className="font-medium">{userProfile.resource}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Rôle en groupe</p>
                        <p className="font-medium">{userProfile.group_role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg col-span-1 md:col-span-2">
                      <Target className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Priorité</p>
                        <p className="font-medium">{userProfile.priority}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Thème astral */}
            {userProfile?.astro_data && (
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {userProfile.astro_data.planets?.slice(0, 6).map((planet) => (
                      <div key={planet.planetId} className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">{planet.planet}</p>
                        <p className="text-sm font-medium">{planet.sign}</p>
                        <p className="text-xs text-muted-foreground">{planet.house}</p>
                      </div>
                    ))}
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
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Profile;
