import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  LogOut, 
  Star, 
  History,
  Users,
  ChevronDown 
} from 'lucide-react';
import { FriendRequestNotification } from '@/components/friends/FriendRequestNotification';

interface UserMenuProps {
  className?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ className }) => {
  const { user, isAuthenticated } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center space-x-2">
      <FriendRequestNotification />
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`flex items-center space-x-2 px-3 py-2 h-auto ${className}`}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="w-fit text-xs">
              Membre depuis {new Date(user.createdAt).getFullYear()}
            </Badge>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => handleNavigation('/profile')}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Mon profil</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => handleNavigation('/charts')}
        >
          <Star className="mr-2 h-4 w-4" />
          <span>Mes thèmes astraux</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => handleNavigation('/friends')}
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
          onClick={() => handleNavigation('/settings')}
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
    </div>
  );
};
