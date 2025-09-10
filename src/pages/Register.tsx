import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { PublicRoute } from '@/components/auth/AuthGuard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from || '/';

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  const handleSwitchToLogin = () => {
    navigate('/login', { 
      state: { from },
      replace: true 
    });
  };

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 px-4">
        <div className="w-full max-w-md space-y-6">
          {/* Bouton retour */}
          <div className="flex justify-start">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à l'accueil</span>
            </Button>
          </div>

          {/* Logo et titre */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Pure</h1>
            <p className="text-muted-foreground">
              Créez votre compte pour sauvegarder vos thèmes astraux
            </p>
          </div>

          {/* Formulaire d'inscription */}
          <RegisterForm 
            onSuccess={handleSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />

          {/* Avantages du compte */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-sm">Avec votre compte, vous pourrez :</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Sauvegarder vos thèmes astraux</li>
              <li>• Accéder à votre historique</li>
              <li>• Recevoir des analyses personnalisées</li>
              <li>• Partager vos découvertes</li>
            </ul>
          </div>


          {/* Informations supplémentaires */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              En créant un compte, vous acceptez nos{' '}
              <Button variant="link" className="p-0 h-auto text-sm">
                conditions d'utilisation
              </Button>
              {' '}et notre{' '}
              <Button variant="link" className="p-0 h-auto text-sm">
                politique de confidentialité
              </Button>
            </p>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
};

export default Register;
