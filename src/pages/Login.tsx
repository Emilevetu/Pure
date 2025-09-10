import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { PublicRoute } from '@/components/auth/AuthGuard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const from = (location.state as any)?.from || '/';

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  const handleSwitchToRegister = () => {
    navigate('/register', { 
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
              Connectez-vous pour accéder à vos thèmes astraux
            </p>
          </div>

          {/* Formulaire de connexion */}
          <LoginForm 
            onSuccess={handleSuccess}
            onSwitchToRegister={handleSwitchToRegister}
          />

          {/* Informations supplémentaires */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              En vous connectant, vous acceptez nos{' '}
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

export default Login;
