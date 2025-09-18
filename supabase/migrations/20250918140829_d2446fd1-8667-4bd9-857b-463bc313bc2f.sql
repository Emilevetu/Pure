-- Configuration des mises à jour en temps réel pour la table friends
-- Cela permettra de recevoir les notifications uniquement quand la base de données change réellement

-- 1. Activer REPLICA IDENTITY FULL pour capturer tous les changements
ALTER TABLE public.friends REPLICA IDENTITY FULL;

-- 2. Ajouter la table à la publication realtime pour activer les mises à jour en temps réel  
ALTER PUBLICATION supabase_realtime ADD TABLE public.friends;