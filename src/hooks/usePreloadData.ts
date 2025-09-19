import { useEffect } from 'react';
import { ProfileService } from '../lib/profile-service';
import { friendsAPI } from '../lib/api-simple';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook personnalisé pour précharger les données utilisateur en arrière-plan
 * Se déclenche dès que l'utilisateur est connecté pour optimiser la navigation
 */
export const usePreloadData = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    console.log('🚀 [Preload] Démarrage du préchargement pour:', user.id);

    // Fonction pour charger les données des amis
    const loadFriendsData = async () => {
      try {
        console.log('👥 [Preload] Chargement des données des amis...');
        
        // Utiliser les mêmes API que le code existant
        const [friendsResponse, requestsReceivedResponse, requestsSentResponse] = await Promise.all([
          friendsAPI.getUserFriends(),
          friendsAPI.getFriendRequestsReceived(),
          friendsAPI.getFriendRequestsSent()
        ]);

        // Extraire les données des réponses
        const friendsData = friendsResponse.success ? (friendsResponse.data || []) : [];
        const requestsReceivedData = requestsReceivedResponse.success ? (requestsReceivedResponse.data || []) : [];
        const requestsSentData = requestsSentResponse.success ? (requestsSentResponse.data || []) : [];

        // Sauvegarder dans le cache
        const CACHE_KEYS = {
          friends: `friends_cache_${user.id}`,
          requestsReceived: `requests_received_cache_${user.id}`,
          requestsSent: `requests_sent_cache_${user.id}`,
          timestamp: `friends_cache_timestamp_${user.id}`
        };

        localStorage.setItem(CACHE_KEYS.friends, JSON.stringify(friendsData));
        localStorage.setItem(CACHE_KEYS.requestsReceived, JSON.stringify(requestsReceivedData));
        localStorage.setItem(CACHE_KEYS.requestsSent, JSON.stringify(requestsSentData));
        localStorage.setItem(CACHE_KEYS.timestamp, Date.now().toString());

        console.log('✅ [Preload] Données des amis préchargées et mises en cache:', {
          friends: friendsData.length,
          requestsReceived: requestsReceivedData.length,
          requestsSent: requestsSentData.length
        });
      } catch (error) {
        console.error('❌ [Preload] Erreur lors du chargement des amis:', error);
      }
    };

    // Précharger TOUT en parallèle (plus rapide)
    Promise.allSettled([
      // Précharger le profil utilisateur
      ProfileService.getUserProfile(user.id).then(profile => {
        console.log('✅ [Preload] Profil utilisateur préchargé');
        return profile;
      }),
      
      // Précharger les données des amis
      loadFriendsData()
    ]).then(results => {
      const [profileResult, friendsResult] = results;
      
      console.log('✅ [Preload] Préchargement terminé:', {
        profile: profileResult.status === 'fulfilled' ? '✅' : '❌',
        friends: friendsResult.status === 'fulfilled' ? '✅' : '❌'
      });
    }).catch(error => {
      console.error('❌ [Preload] Erreur globale du préchargement:', error);
      // On continue normalement, pas d'impact utilisateur
    });

  }, [user]);
};
