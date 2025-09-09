import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { friendsAPI } from '@/lib/api-simple';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  Users, 
  Check, 
  X, 
  Mail,
  Loader2
} from 'lucide-react';

interface FriendRequest {
  requester_id: string;
  requester_email: string;
  requester_name: string;
  friendship_id: string;
  created_at: string;
}

export const FriendRequestNotification: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadFriendRequests();
  }, []);

  const loadFriendRequests = async () => {
    try {
      setIsLoading(true);
      const response = await friendsAPI.getFriendRequestsReceived();
      if (response.success) {
        setRequests(response.data || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (friendshipId: string) => {
    try {
      const response = await friendsAPI.acceptFriendRequest(friendshipId);
      if (response.success) {
        await loadFriendRequests(); // Recharger la liste
      }
    } catch (error) {
      console.error('Erreur lors de l\'acceptation:', error);
    }
  };

  const handleDeclineRequest = async (friendshipId: string) => {
    try {
      const response = await friendsAPI.rejectFriendRequest(friendshipId);
      if (response.success) {
        await loadFriendRequests(); // Recharger la liste
      }
    } catch (error) {
      console.error('Erreur lors du refus:', error);
    }
  };

  const handleViewAllRequests = () => {
    navigate('/friends');
    setIsOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  if (requests.length === 0) {
    return null; // Ne pas afficher le composant s'il n'y a pas de demandes
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {requests.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {requests.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Demandes d'amitié</h3>
            <Badge variant="secondary" className="text-xs">
              {requests.length} nouvelle{requests.length > 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <>
              {requests.slice(0, 3).map((request) => (
                <div key={request.friendship_id} className="p-3 border-b last:border-b-0">
                  <div className="flex items-start justify-between space-x-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {request.requester_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {request.requester_email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(request.created_at)}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => handleAcceptRequest(request.friendship_id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => handleDeclineRequest(request.friendship_id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {requests.length > 3 && (
                <div className="p-2 text-center">
                  <p className="text-xs text-muted-foreground">
                    +{requests.length - 3} autre{requests.length - 3 > 1 ? 's' : ''} demande{requests.length - 3 > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="p-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleViewAllRequests}
          >
            <Users className="mr-2 h-4 w-4" />
            Voir toutes les demandes
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
