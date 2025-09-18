import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook personnalisé pour gérer les mises à jour en temps réel des amis
 * Écoute les changements sur la table `friends` et invalide le cache seulement si nécessaire
 */
export const useFriendsRealtime = (onFriendsChange: () => void) => {
  const { user } = useAuth();

  const handleRealtimeUpdate = useCallback((payload: any) => {
    console.log('🔔 [FriendsRealtime] Changement détecté dans la table friends:', payload);
    
    // Vérifier si le changement concerne l'utilisateur actuel
    if (!user) return;
    
    const { eventType, new: newRecord, old: oldRecord } = payload;
    const userId = user.id;
    
    // Vérifier si l'utilisateur est concerné par ce changement
    const isUserConcerned = (record: any) => {
      return record?.requester_id === userId || record?.addressee_id === userId;
    };
    
    let shouldUpdate = false;
    
    switch (eventType) {
      case 'INSERT':
        if (isUserConcerned(newRecord)) {
          console.log('📥 [FriendsRealtime] Nouvelle demande d\'amitié détectée');
          shouldUpdate = true;
        }
        break;
        
      case 'UPDATE':
        if (isUserConcerned(newRecord)) {
          console.log('🔄 [FriendsRealtime] Mise à jour d\'une demande d\'amitié détectée');
          shouldUpdate = true;
        }
        break;
        
      case 'DELETE':
        if (isUserConcerned(oldRecord)) {
          console.log('🗑️ [FriendsRealtime] Suppression d\'une relation d\'amitié détectée');
          shouldUpdate = true;
        }
        break;
    }
    
    if (shouldUpdate) {
      console.log('✨ [FriendsRealtime] Mise à jour des données nécessaire');
      onFriendsChange();
    } else {
      console.log('⏩ [FriendsRealtime] Changement ne concernant pas cet utilisateur, ignoré');
    }
  }, [user, onFriendsChange]);

  useEffect(() => {
    if (!user) {
      console.log('🚫 [FriendsRealtime] Pas d\'utilisateur connecté, pas d\'écoute real-time');
      return;
    }

    console.log('🎧 [FriendsRealtime] Démarrage de l\'écoute des changements en temps réel');
    
    // Créer le canal d'écoute pour les changements sur la table friends
    const channel = supabase
      .channel('friends-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'friends'
        },
        handleRealtimeUpdate
      )
      .subscribe((status) => {
        console.log(`🔌 [FriendsRealtime] Statut de la souscription: ${status}`);
      });

    // Cleanup
    return () => {
      console.log('🔇 [FriendsRealtime] Arrêt de l\'écoute des changements en temps réel');
      supabase.removeChannel(channel);
    };
  }, [user, handleRealtimeUpdate]);
};