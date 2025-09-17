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
  Heart
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

  useEffect(() => {
    if (user) {
      console.log('🔍 [Friends] useEffect - user trouvé, chargement des données');
      loadFriendsData();
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

  const loadFriendsData = async () => {
    try {
      console.log('🔍 [Friends] loadFriendsData DÉBUT');
      setIsLoading(true);
      setError(null);

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

      if (friendsResponse.success) {
        setFriends(friendsResponse.data || []);
        console.log('✅ [Friends] Amis chargés:', friendsResponse.data?.length || 0);
      } else {
        console.log('❌ [Friends] Erreur getFriends:', friendsResponse.error);
      }

      if (requestsReceivedResponse.success) {
        setRequestsReceived(requestsReceivedResponse.data || []);
        console.log('✅ [Friends] Demandes reçues chargées:', requestsReceivedResponse.data?.length || 0);
      } else {
        console.log('❌ [Friends] Erreur getFriendRequestsReceived:', requestsReceivedResponse.error);
      }

      if (requestsSentResponse.success) {
        setRequestsSent(requestsSentResponse.data || []);
        console.log('✅ [Friends] Demandes envoyées chargées:', requestsSentResponse.data?.length || 0);
      } else {
        console.log('❌ [Friends] Erreur getFriendRequestsSent:', requestsSentResponse.error);
      }

      // Vérifier s'il y a des erreurs
      if (!friendsResponse.success || !requestsReceivedResponse.success || !requestsSentResponse.success) {
        console.log('⚠️ [Friends] Certaines APIs ont échoué, mais on continue');
        setError('Certaines données n\'ont pas pu être chargées');
      }
    } catch (error: any) {
      console.error('❌ [Friends] Erreur dans loadFriendsData:', error);
      setError(error.message || 'Erreur lors du chargement');
    } finally {
      console.log('🏁 [Friends] loadFriendsData FIN - isLoading: false');
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (friendshipId: string) => {
    try {
      const response = await friendsAPI.acceptFriendRequest(friendshipId);
      if (response.success) {
        await loadFriendsData(); // Recharger les données
      } else {
        setError(response.error || 'Erreur lors de l\'acceptation');
      }
    } catch (error: any) {
      setError(error.message || 'Erreur lors de l\'acceptation');
    }
  };

  const handleDeclineRequest = async (friendshipId: string) => {
    try {
      const response = await friendsAPI.rejectFriendRequest(friendshipId);
      if (response.success) {
        await loadFriendsData(); // Recharger les données
      } else {
        setError(response.error || 'Erreur lors du refus');
      }
    } catch (error: any) {
      setError(error.message || 'Erreur lors du refus');
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    try {
      const response = await friendsAPI.removeFriend(friendshipId);
      if (response.success) {
        await loadFriendsData(); // Recharger les données
      } else {
        setError(response.error || 'Erreur lors de la suppression');
      }
    } catch (error: any) {
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
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 pt-2">
          <div className="container mx-auto px-6 py-8 pb-24">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Chargement de vos amis...</p>
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
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 pt-2">
        <div className="container mx-auto px-6 py-8 pb-24">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Stories des amis - Style Instagram */}
            {friends.length > 0 && (
              <div className="mb-8">
                <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
                  {friends.map((friend) => (
                    <div key={friend.friend_id} className="flex flex-col items-center space-y-2 flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-black border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                        <span className="text-white text-lg font-semibold">
                          {friend.friend_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-center text-black max-w-16 truncate">
                        {friend.friend_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* En-tête */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <Users className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold">Mes Amis</h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Connectez-vous avec vos proches et partagez vos expériences astrologiques
              </p>
            </div>

            {/* Erreur */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Bouton d'ajout d'ami */}
            <div className="flex justify-center">
              <Button onClick={() => setIsAddFriendOpen(true)} size="lg">
                <UserPlus className="mr-2 h-5 w-5" />
                Ajouter un ami
              </Button>
            </div>

            {/* Onglets */}
            <Tabs defaultValue="friends" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
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
              <TabsContent value="friends" className="space-y-4">
                {friends.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Aucun ami pour le moment</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Commencez par ajouter des amis pour partager vos thèmes astraux
                      </p>
                      <Button onClick={() => setIsAddFriendOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Ajouter un ami
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {friends.map((friend) => (
                      <Card key={friend.friendship_id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{friend.friend_name}</CardTitle>
                              <CardDescription>{friend.friend_email}</CardDescription>
                            </div>
                            <Badge variant="secondary">Ami</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                              Amis depuis le {formatDate(friend.created_at)}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveFriend(friend.friendship_id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Onglet Demandes reçues */}
              <TabsContent value="received" className="space-y-4">
                {requestsReceived.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Aucune demande reçue</h3>
                      <p className="text-muted-foreground text-center">
                        Les demandes d'amitié que vous recevez apparaîtront ici
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {requestsReceived.map((request) => (
                      <Card key={request.friendship_id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{request.requester_name}</h3>
                              <p className="text-sm text-muted-foreground">{request.requester_email}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Demande reçue le {formatDate(request.created_at)}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleAcceptRequest(request.friendship_id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Accepter
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeclineRequest(request.friendship_id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Refuser
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Onglet Demandes envoyées */}
              <TabsContent value="sent" className="space-y-4">
                {requestsSent.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Aucune demande envoyée</h3>
                      <p className="text-muted-foreground text-center">
                        Les demandes d'amitié que vous envoyez apparaîtront ici
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {requestsSent.map((request) => (
                      <Card key={request.friendship_id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{request.addressee_name}</h3>
                              <p className="text-sm text-muted-foreground">{request.addressee_email}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Demande envoyée le {formatDate(request.created_at)}
                              </p>
                            </div>
                            <Badge variant="outline">En attente</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Dialog d'ajout d'ami */}
      <AddFriendDialog 
        open={isAddFriendOpen} 
        onOpenChange={setIsAddFriendOpen}
        onFriendAdded={loadFriendsData}
      />
    </AuthGuard>
  );
};

export default Friends;
