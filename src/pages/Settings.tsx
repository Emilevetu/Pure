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
      
      // Appeler l'edge function pour supprimer le compte complètement
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: user.id }
      });

      if (error) {
        console.error('Erreur edge function:', error);
        throw new Error(error.message || 'Erreur lors de la suppression du compte');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Erreur lors de la suppression du compte');
      }

      console.log('✅ Réponse function:', data.message);
      
      // Afficher le message de succès
      setMessage({ type: 'success', text: 'Compte supprimé avec succès de toutes les bases de données ! Redirection...' });
      
      // Attendre un peu pour que l'utilisateur voie le message
      setTimeout(async () => {
        // Se déconnecter
        await logout();
        
        // Rediriger vers la page de login
        navigate('/login', { replace: true });
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
      <div className="min-h-screen bg-dark-blue">
        <div className="container mx-auto px-4 py-8 pb-24">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* En-tête */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">Paramètres du compte</h1>
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

            {/* Informations du profil */}
            <Card className="bg-dark-blue border-gray-600">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <User className="h-5 w-5" />
                  <span>Informations du profil</span>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Modifiez vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Nom complet</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Votre nom complet"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    value={profileData.email}
                    disabled
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <p className="text-xs text-gray-400">
                    L'email ne peut pas être modifié
                  </p>
                </div>

                <Button 
                  onClick={handleSaveProfile} 
                  disabled={isLoading}
                  className="w-full bg-white text-dark-blue hover:bg-gray-100"
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

            {/* Zone de danger */}
            <Card className="bg-dark-blue border-red-500">
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-red-400">Supprimer le compte</h4>
                  <p className="text-sm text-gray-300">
                    Cette action supprimera définitivement votre compte, tous vos thèmes astraux 
                    et toutes vos données. Cette action est irréversible.
                  </p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700 text-white">
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
            <Card className="bg-dark-blue border-gray-600">
              <CardContent className="pt-6">
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="w-full border-gray-600 text-black hover:bg-gray-700 hover:text-white"
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
