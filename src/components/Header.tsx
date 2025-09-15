import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, LogIn } from 'lucide-react';

const Header = () => {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthClick = (mode: 'login' | 'register') => {
    if (mode === 'login') {
      navigate('/login');
    } else {
      navigate('/register');
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img 
                src="/placeholder.svg" 
                alt="Pure" 
                className="h-8 w-8"
              />
              <span className="text-xl font-semibold tracking-tight">Pure</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                Aperçu
              </button>
              <button
                onClick={() => scrollToSection('methode')}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                Méthode
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                Contact
              </button>
            </nav>

            {/* Auth Section - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {!isAuthenticated && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAuthClick('login')}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Connexion
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAuthClick('register')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Inscription
                  </Button>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>
    </>
  );
};

export default Header;