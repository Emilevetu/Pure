import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/AuthContext';
import { UserMenu } from '@/components/auth/UserMenu';
import { Button } from '@/components/ui/button';
import { User, LogIn } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
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
                alt="AstroGuide" 
                className="h-8 w-8"
              />
              <span className="text-xl font-semibold tracking-tight">AstroGuide</span>
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

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <UserMenu />
              ) : (
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

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                <span className={`block h-0.5 bg-foreground transition-all ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
                <span className={`block h-0.5 bg-foreground transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 bg-foreground transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-border/50 pt-4">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => scrollToSection('hero')}
                  className="text-left text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Aperçu
                </button>
                <button
                  onClick={() => scrollToSection('methode')}
                  className="text-left text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Méthode
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-left text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Contact
                </button>
                
                {/* Mobile Auth Section */}
                <div className="pt-4 border-t border-border/50">
                  {isAuthenticated ? (
                    <UserMenu className="w-full" />
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigate('/login');
                          setIsMenuOpen(false);
                        }}
                        className="justify-start"
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Connexion
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          navigate('/register');
                          setIsMenuOpen(false);
                        }}
                        className="justify-start"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Inscription
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;