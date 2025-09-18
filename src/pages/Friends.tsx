import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { friendsAPI } from '@/lib/api-simple';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  UserPlus, 
  Check, 
  X, 
  Trash2, 
  Mail, 
  Clock,
  Loader2,
  AlertCircle,
  Heart,
  Bell
} from 'lucide-react';
import { AddFriendDialog } from '@/components/friends/AddFriendDialog';

interface Friend {
  friend_id: string;
  friend_email: string;
  friend_name: string;
  friendship_id: string;
  created_at: string;
}

interface FriendRequest {
  requester_id?: string;
  addressee_id?: string;
  requester_email?: string;
  addressee_email?: string;
  requester_name?: string;
  addressee_name?: string;
  friendship_id: string;
  created_at: string;
}

const Friends: React.FC = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requestsReceived, setRequestsReceived] = useState<FriendRequest[]>([]);
  const [requestsSent, setRequestsSent] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [isNotificationOverlayOpen, setIsNotificationOverlayOpen] = useState(false);

  // Cache configuration
  const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes (optimisé vs 5 min)
  const CACHE_KEYS = {
    friends: 'friends_cache',
    requestsReceived: 'requests_received_cache',
    requestsSent: 'requests_sent_cache',
    timestamp: 'friends_cache_timestamp'
  };

  // Cache functions
  const isCacheValid = (): boolean => {
    const timestamp = localStorage.getItem(CACHE_KEYS.timestamp);
    if (!timestamp) return false;
    return (Date.now() - parseInt(timestamp)) < CACHE_DURATION;
  };

  const loadFromCache = (): boolean => {
    if (!isCacheValid()) return false;
    
    try {
      const cachedFriends = localStorage.getItem(CACHE_KEYS.friends);
      const cachedRequestsReceived = localStorage.getItem(CACHE_KEYS.requestsReceived);
      const cachedRequestsSent = localStorage.getItem(CACHE_KEYS.requestsSent);
      
      if (cachedFriends) setFriends(JSON.parse(cachedFriends));
      if (cachedRequestsReceived) setRequestsReceived(JSON.parse(cachedRequestsReceived));
      if (cachedRequestsSent) setRequestsSent(JSON.parse(cachedRequestsSent));
      
      console.log('✅ [Friends] Données chargées depuis le cache');
      return true;
    } catch (error) {
      console.error('❌ [Friends] Erreur lors du chargement du cache:', error);
      return false;
    }
  };

  const saveToCache = (friendsData: Friend[], requestsReceivedData: FriendRequest[], requestsSentData: FriendRequest[]) => {
    try {
      localStorage.setItem(CACHE_KEYS.friends, JSON.stringify(friendsData));
      localStorage.setItem(CACHE_KEYS.requestsReceived, JSON.stringify(requestsReceivedData));
      localStorage.setItem(CACHE_KEYS.requestsSent, JSON.stringify(requestsSentData));
      localStorage.setItem(CACHE_KEYS.timestamp, Date.now().toString());
      console.log('💾 [Friends] Données sauvegardées dans le cache');
    } catch (error) {
      console.error('❌ [Friends] Erreur lors de la sauvegarde du cache:', error);
    }
  };

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEYS.friends);
    localStorage.removeItem(CACHE_KEYS.requestsReceived);
    localStorage.removeItem(CACHE_KEYS.requestsSent);
    localStorage.removeItem(CACHE_KEYS.timestamp);
    console.log('🗑️ [Friends] Cache vidé');
  };

  useEffect(() => {
    if (user) {
      console.log('🔍 [Friends] useEffect - user trouvé, chargement des données');
      
      // Essayer de charger depuis le cache d'abord
      if (loadFromCache()) {
        setIsLoading(false);
        console.log('✅ [Friends] Données chargées depuis le cache, pas de background refresh');
      } else {
        // Pas de cache valide, charger normalement
        loadFriendsData();
      }
    } else {
      console.log('🔍 [Friends] useEffect - pas de user, pas de chargement');
    }
  }, [user]);

  // Timeout de sécurité pour éviter le chargement infini
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('⏰ [Friends] Timeout de sécurité - arrêt du chargement après 10s');
        setIsLoading(false);
        setError('Timeout: Le chargement a pris trop de temps');
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  const loadFriendsData = async (backgroundRefresh = false) => {
    try {
      console.log('🔍 [Friends] loadFriendsData DÉBUT', backgroundRefresh ? '(background refresh)' : '');
      
      if (!backgroundRefresh) {
        setIsLoading(true);
        setError(null);
      }

      console.log('🔍 [Friends] Appel des APIs...');
      const [friendsResponse, requestsReceivedResponse, requestsSentResponse] = await Promise.all([
        friendsAPI.getUserFriends(),
        friendsAPI.getFriendRequestsReceived(),
        friendsAPI.getFriendRequestsSent()
      ]);

      console.log('📊 [Friends] Réponses reçues:');
      console.log('  - friendsResponse:', friendsResponse);
      console.log('  - requestsReceivedResponse:', requestsReceivedResponse);
      console.log('  - requestsSentResponse:', requestsSentResponse);

      const friendsData = friendsResponse.success ? (friendsResponse.data || []) : [];
      const requestsReceivedData = requestsReceivedResponse.success ? (requestsReceivedResponse.data || []) : [];
      const requestsSentData = requestsSentResponse.success ? (requestsSentResponse.data || []) : [];

      // Mettre à jour les états
      if (friendsResponse.success) {
        setFriends(friendsData);
        console.log('✅ [Friends] Amis chargés:', friendsData.length);
      } else {
        console.log('❌ [Friends] Erreur getFriends:', friendsResponse.error);
      }

      if (requestsReceivedResponse.success) {
        setRequestsReceived(requestsReceivedData);
        console.log('✅ [Friends] Demandes reçues chargées:', requestsReceivedData.length);
      } else {
        console.log('❌ [Friends] Erreur getFriendRequestsReceived:', requestsReceivedResponse.error);
      }

      if (requestsSentResponse.success) {
        setRequestsSent(requestsSentData);
        console.log('✅ [Friends] Demandes envoyées chargées:', requestsSentData.length);
      } else {
        console.log('❌ [Friends] Erreur getFriendRequestsSent:', requestsSentResponse.error);
      }

      // Sauvegarder dans le cache
      saveToCache(friendsData, requestsReceivedData, requestsSentData);

      // Vérifier s'il y a des erreurs
      if (!friendsResponse.success || !requestsReceivedResponse.success || !requestsSentResponse.success) {
        console.log('⚠️ [Friends] Certaines APIs ont échoué, mais on continue');
        if (!backgroundRefresh) {
          setError('Certaines données n\'ont pas pu être chargées');
        }
      }
    } catch (error: any) {
      console.error('❌ [Friends] Erreur dans loadFriendsData:', error);
      if (!backgroundRefresh) {
        setError(error.message || 'Erreur lors du chargement');
      }
    } finally {
      if (!backgroundRefresh) {
        console.log('🏁 [Friends] loadFriendsData FIN - isLoading: false');
        setIsLoading(false);
      }
    }
  };

  const handleAcceptRequest = async (friendshipId: string) => {
    try {
      // 🚀 Update optimiste local - Supprimer de la liste des demandes reçues
      const requestToAccept = requestsReceived.find(req => req.friendship_id === friendshipId);
      if (requestToAccept) {
        setRequestsReceived(prev => prev.filter(req => req.friendship_id !== friendshipId));
        // Ajouter aux amis localement
        if (requestToAccept.requester_id && requestToAccept.requester_name && requestToAccept.requester_email) {
          const newFriend: Friend = {
            friend_id: requestToAccept.requester_id,
            friend_name: requestToAccept.requester_name,
            friend_email: requestToAccept.requester_email,
            friendship_id: friendshipId,
            created_at: new Date().toISOString()
          };
          setFriends(prev => [newFriend, ...prev]);
        }
      }

      const response = await friendsAPI.acceptFriendRequest(friendshipId);
      if (response.success) {
        // Mettre à jour le cache avec les nouvelles données locales
        saveToCache(friends, requestsReceived, requestsSent);
        console.log('✅ [Friends] Demande acceptée avec succès - update local effectué');
      } else {
        // Reverter les changements optimistes en cas d'erreur
        await loadFriendsData();
        setError(response.error || 'Erreur lors de l\'acceptation');
      }
    } catch (error: any) {
      // Reverter les changements optimistes en cas d'erreur
      await loadFriendsData();
      setError(error.message || 'Erreur lors de l\'acceptation');
    }
  };

  const handleDeclineRequest = async (friendshipId: string) => {
    try {
      // 🚀 Update optimiste local - Supprimer de la liste des demandes reçues
      setRequestsReceived(prev => prev.filter(req => req.friendship_id !== friendshipId));

      const response = await friendsAPI.rejectFriendRequest(friendshipId);
      if (response.success) {
        // Mettre à jour le cache avec les nouvelles données locales
        saveToCache(friends, requestsReceived, requestsSent);
        console.log('✅ [Friends] Demande refusée avec succès - update local effectué');
      } else {
        // Reverter les changements optimistes en cas d'erreur
        await loadFriendsData();
        setError(response.error || 'Erreur lors du refus');
      }
    } catch (error: any) {
      // Reverter les changements optimistes en cas d'erreur
      await loadFriendsData();
      setError(error.message || 'Erreur lors du refus');
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    try {
      // 🚀 Update optimiste local - Supprimer de la liste des amis
      setFriends(prev => prev.filter(friend => friend.friendship_id !== friendshipId));

      const response = await friendsAPI.removeFriend(friendshipId);
      if (response.success) {
        // Mettre à jour le cache avec les nouvelles données locales
        saveToCache(friends, requestsReceived, requestsSent);
        console.log('✅ [Friends] Ami supprimé avec succès - update local effectué');
      } else {
        // Reverter les changements optimistes en cas d'erreur
        await loadFriendsData();
        setError(response.error || 'Erreur lors de la suppression');
      }
    } catch (error: any) {
      // Reverter les changements optimistes en cas d'erreur
      await loadFriendsData();
      setError(error.message || 'Erreur lors de la suppression');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-dark-blue pt-2">
          <div className="container mx-auto px-6 py-8 pb-24">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-gray-300">Chargement de vos amis...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-dark-blue pt-2">
        <div className="container mx-auto px-6 py-8 pb-24">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Stories des amis - Style Instagram */}
            {friends.length > 0 && (
              <div className="mb-8">
                {/* En-tête style Instagram */}
                <div className="mb-3">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-white text-lg font-bold tracking-tight">Mes proches</h2>
                    {/* Cloche de notifications */}
                    <div className="relative -mt-1 -mr-2">
                      <Bell 
                        className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white transition-colors" 
                        onClick={() => setIsNotificationOverlayOpen(true)}
                      />
                      {/* Point de notification (optionnel) */}
                      {requestsReceived.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  {/* Trait aligné avec les bulles */}
                  <div className="px-4">
                    <div className="h-px bg-gray-600 mt-2"></div>
                  </div>
                </div>
                
                {/* Stories */}
                <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide px-4">
                  {/* Bulle "Ajouter un ami" */}
                  <div className="flex flex-col items-center space-y-2 flex-shrink-0">
                    <div 
                      className="w-16 h-16 rounded-full bg-gray-50 border-2 border-dashed border-muted-foreground flex items-center justify-center cursor-pointer hover:scale-105 transition-transform hover:bg-gray-100"
                      onClick={() => setIsAddFriendOpen(true)}
                    >
                      <span className="text-muted-foreground text-2xl font-bold leading-none">+</span>
                    </div>
                    <span className="text-xs text-center text-white max-w-16 truncate">
                      Nouvel ami
                    </span>
                  </div>
                  
                  {/* Bulles des amis */}
                  {friends.map((friend) => (
                    <div key={friend.friend_id} className="flex flex-col items-center space-y-2 flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-black border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                        <span className="text-white text-lg font-semibold">
                          {friend.friend_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-center text-white max-w-16 truncate">
                        {friend.friend_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Boutons d'action style Headspace */}
            <div className="space-y-4">
              {/* Bouton Compatibilité */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-3 cursor-pointer hover:scale-[1.02] transition-transform duration-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-white text-lg font-semibold">
                      Compatibilité avec un proche
                    </h3>
                  </div>
                  <div className="relative w-20 h-20 flex-shrink-0">
                    {/* Illustration abstraite style Headspace */}
                    <div className="absolute inset-0">
                      <div className="absolute top-2 right-2 w-8 h-8 bg-blue-300 rounded-full opacity-80"></div>
                      <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full opacity-60"></div>
                      <div className="absolute top-6 left-2 w-6 h-6 bg-white rounded-full opacity-40"></div>
                      <div className="absolute bottom-2 left-4 w-4 h-4 bg-blue-200 rounded-full opacity-70"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton Apprendre à connaître */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 p-3 cursor-pointer hover:scale-[1.02] transition-transform duration-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-gray-800 text-lg font-semibold">
                      Apprendre à connaître un proche
                    </h3>
                  </div>
                  <div className="relative w-20 h-20 flex-shrink-0">
                    {/* Illustration abstraite style Headspace */}
                    <div className="absolute inset-0">
                      <div className="absolute top-3 right-3 w-10 h-10 bg-orange-200 rounded-full opacity-80"></div>
                      <div className="absolute bottom-3 right-2 w-8 h-8 bg-yellow-300 rounded-full opacity-70"></div>
                      <div className="absolute top-1 left-3 w-6 h-6 bg-white rounded-full opacity-50"></div>
                      <div className="absolute bottom-1 left-1 w-4 h-4 bg-orange-300 rounded-full opacity-60"></div>
                      <div className="absolute top-8 left-6 w-3 h-3 bg-yellow-200 rounded-full opacity-80"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>

      {/* Dialog d'ajout d'ami */}
      <AddFriendDialog 
        open={isAddFriendOpen} 
        onOpenChange={setIsAddFriendOpen}
        onFriendAdded={() => {
          // 🚀 Update optimiste local - Pas de clearCache + loadFriendsData
          console.log('✅ [Friends] Nouvel ami ajouté - pas de rechargement, sera mis à jour par les real-time updates');
        }}
      />

      {/* Overlay de notifications */}
      {isNotificationOverlayOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsNotificationOverlayOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête avec titre et croix */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-black">Notifications</h2>
              <button
                onClick={() => setIsNotificationOverlayOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Contenu avec onglets */}
            <div className="p-6">
              <Tabs defaultValue="friends" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="friends" className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Amis ({friends.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="received" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Reçues ({requestsReceived.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="sent" className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Envoyées ({requestsSent.length})</span>
                  </TabsTrigger>
                </TabsList>

                {/* Onglet Amis */}
                <TabsContent value="friends" className="space-y-3">
                  {friends.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">Aucun ami pour le moment</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {friends.map((friend) => (
                        <div key={friend.friendship_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h3 className="font-semibold text-sm">{friend.friend_name}</h3>
                            <p className="text-xs text-muted-foreground">{friend.friend_email}</p>
                            <p className="text-xs text-muted-foreground">
                              Amis depuis le {formatDate(friend.created_at)}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFriend(friend.friendship_id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Onglet Demandes reçues */}
                <TabsContent value="received" className="space-y-3">
                  {requestsReceived.length === 0 ? (
                    <div className="text-center py-8">
                      <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">Aucune demande reçue</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {requestsReceived.map((request) => (
                        <div key={request.friendship_id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="mb-3">
                            <h3 className="font-semibold text-sm">{request.requester_name}</h3>
                            <p className="text-xs text-muted-foreground">{request.requester_email}</p>
                            <p className="text-xs text-muted-foreground">
                              Demande reçue le {formatDate(request.created_at)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleAcceptRequest(request.friendship_id)}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Accepter
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleDeclineRequest(request.friendship_id)}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Refuser
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Onglet Demandes envoyées */}
                <TabsContent value="sent" className="space-y-3">
                  {requestsSent.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">Aucune demande envoyée</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {requestsSent.map((request) => (
                        <div key={request.friendship_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h3 className="font-semibold text-sm">{request.addressee_name}</h3>
                            <p className="text-xs text-muted-foreground">{request.addressee_email}</p>
                            <p className="text-xs text-muted-foreground">
                              Demande envoyée le {formatDate(request.created_at)}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">En attente</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
};

export default Friends;
