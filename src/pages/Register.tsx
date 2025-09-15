import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { PublicRoute } from '@/components/auth/AuthGuard';
import { Button } from '@/components/ui/button';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from || '/';

  const handleSuccess = () => {
    navigate('/', { replace: true });
    // Scroll vers le haut de la page après la navigation
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
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
