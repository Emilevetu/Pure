import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  User, 
  Mail, 
  Calendar, 
  Trash2, 
  Save, 
  AlertTriangle, 
  Shield,
  Database,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // État pour les informations du profil
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Fonction pour sauvegarder les modifications du profil
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: profileData.name
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la mise à jour du profil' });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour supprimer le compte
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    setMessage(null);
    
    try {
      console.log('🗑️ Suppression complète du compte utilisateur:', user.id);
      
      // Utiliser la fonction SQL qui supprime complètement l'utilisateur
      // y compris de auth.users
      const { error } = await supabase.rpc('delete_user_completely', {
        user_id: user.id
      });

      if (error) {
        console.error('Erreur suppression complète:', error);
        throw new Error('Erreur lors de la suppression du compte');
      }

      console.log('✅ Compte supprimé avec succès de toutes les tables');
      
      // Afficher le message de succès
      setMessage({ type: 'success', text: 'Compte supprimé avec succès ! Redirection...' });
      
      // Attendre un peu pour que l'utilisateur voie le message
      setTimeout(async () => {
        // Se déconnecter
        await logout();
        
        // Rediriger vers l'accueil
        navigate('/', { replace: true });
      }, 2000);
      
    } catch (error: any) {
      console.error('Erreur lors de la suppression du compte:', error);
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la suppression du compte' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* En-tête */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Paramètres du compte</h1>
              <p className="text-muted-foreground">
                Gérez vos informations personnelles et les paramètres de votre compte
              </p>
            </div>

            {/* Message de statut */}
            {message && (
              <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              
              {/* Informations du profil */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Informations du profil</span>
                  </CardTitle>
                  <CardDescription>
                    Modifiez vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Votre nom complet"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      L'email ne peut pas être modifié
                    </p>
                  </div>

                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Save className="mr-2 h-4 w-4 animate-spin" />
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Sauvegarder les modifications
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Informations du compte */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Informations du compte</span>
                  </CardTitle>
                  <CardDescription>
                    Détails de votre compte AstroGuide
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Membre depuis</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">ID du compte</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {user?.id ? `${user.id.slice(0, 8)}...` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Zone de danger */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Zone de danger</span>
                </CardTitle>
                <CardDescription>
                  Actions irréversibles pour votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Supprimer le compte</h4>
                  <p className="text-sm text-muted-foreground">
                    Cette action supprimera définitivement votre compte, tous vos thèmes astraux 
                    et toutes vos données. Cette action est irréversible.
                  </p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer mon compte
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-red-600">
                        Êtes-vous absolument sûr ?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-2">
                        <p>
                          Cette action ne peut pas être annulée. Cela supprimera définitivement :
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Votre compte utilisateur</li>
                          <li>Tous vos thèmes astraux sauvegardés</li>
                          <li>Toutes vos données personnelles</li>
                          <li>Votre historique d'utilisation</li>
                        </ul>
                        <p className="font-medium text-red-600">
                          Cette action est irréversible.
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting ? (
                          <>
                            <Trash2 className="mr-2 h-4 w-4 animate-spin" />
                            Suppression...
                          </>
                        ) : (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Oui, supprimer mon compte
                          </>
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            {/* Bouton de déconnexion */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Settings;
