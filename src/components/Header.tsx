import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { User, LogIn, Star, Settings, LogOut, History, Users } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);


  // Fonction pour gérer l'ouverture du menu hamburger
  const handleMenuToggle = () => {
    const newMenuState = !isMenuOpen;
    setIsMenuOpen(newMenuState);
    if (newMenuState) {
      setIsUserMenuOpen(false); // Fermer le menu utilisateur si on ouvre le menu hamburger
    }
  };

  // Fonction pour gérer l'ouverture du menu utilisateur
  const handleUserMenuToggle = (open: boolean) => {
    setIsUserMenuOpen(open);
    if (open) {
      setIsMenuOpen(false); // Fermer le menu hamburger si on ouvre le menu utilisateur
    }
  };
  const { isAuthenticated, user } = useUser();
  const { logout } = useAuth();
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

  const handleUserMenuNavigation = (path: string) => {
    navigate(path);
    setIsUserMenuOpen(false);
    setIsMenuOpen(false); // Fermer aussi le menu hamburger
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false); // Fermer aussi le menu hamburger
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

            {/* Menu Button and Avatar - Visible on all screens */}
            <div className="flex items-center space-x-3">
              <button
                className="p-2 md:hidden"
                onClick={handleMenuToggle}
                aria-label="Menu"
              >
                <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                  <span className={`block h-0.5 bg-foreground transition-all ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
                  <span className={`block h-0.5 bg-foreground transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-0.5 bg-foreground transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
                </div>
              </button>
              
              {/* Avatar rond noir interactif avec première lettre - Visible sur tous les écrans */}
              {isAuthenticated ? (
                <DropdownMenu open={isUserMenuOpen} onOpenChange={handleUserMenuToggle}>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-white font-semibold text-sm">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent align="end" className="w-56 z-[60]">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.name || 'Utilisateur'}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        <Badge variant="secondary" className="w-fit text-xs">
                          Membre depuis {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2025'}
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => handleUserMenuNavigation('/profile')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Mon profil</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => handleUserMenuNavigation('/charts')}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      <span>Mes thèmes astraux</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => handleUserMenuNavigation('/friends')}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      <span>Mes amis</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="cursor-pointer">
                      <History className="mr-2 h-4 w-4" />
                      <span>Historique</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => handleUserMenuNavigation('/settings')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Se déconnecter</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAuthClick('login')}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center p-0"
                >
                  <User className="h-4 w-4" />
                </Button>
              )}
            </div>
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
                
                {/* Mobile Auth Section - Only for non-authenticated users */}
                {!isAuthenticated && (
                  <div className="pt-4 border-t border-border/50">
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
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;