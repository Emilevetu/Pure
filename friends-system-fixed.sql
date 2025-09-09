-- =====================================================
-- SYSTÈME D'AMIS CORRIGÉ POUR ASTROGUIDE
-- =====================================================

-- 1. SUPPRIMER LES ANCIENNES FONCTIONS SI ELLES EXISTENT
-- =====================================================
DROP FUNCTION IF EXISTS get_user_friends(UUID);
DROP FUNCTION IF EXISTS get_friend_requests_received(UUID);
DROP FUNCTION IF EXISTS get_friend_requests_sent(UUID);

-- 2. TABLE FRIENDS (si elle n'existe pas déjà)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.friends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte pour éviter les doublons
  UNIQUE(requester_id, addressee_id),
  
  -- Contrainte pour éviter qu'un utilisateur soit ami avec lui-même
  CHECK (requester_id != addressee_id)
);

-- 3. INDEX POUR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_friends_requester ON public.friends(requester_id);
CREATE INDEX IF NOT EXISTS idx_friends_addressee ON public.friends(addressee_id);
CREATE INDEX IF NOT EXISTS idx_friends_status ON public.friends(status);
CREATE INDEX IF NOT EXISTS idx_friends_requester_addressee ON public.friends(requester_id, addressee_id);

-- 4. ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view their own friendships" ON public.friends;
DROP POLICY IF EXISTS "Users can create friend requests" ON public.friends;
DROP POLICY IF EXISTS "Users can update their friend requests" ON public.friends;
DROP POLICY IF EXISTS "Users can delete their friendships" ON public.friends;

-- Politique : Les utilisateurs peuvent voir leurs propres relations d'amitié
CREATE POLICY "Users can view their own friendships" ON public.friends
  FOR SELECT USING (
    auth.uid() = requester_id OR 
    auth.uid() = addressee_id
  );

-- Politique : Les utilisateurs peuvent créer des demandes d'amitié
CREATE POLICY "Users can create friend requests" ON public.friends
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

-- Politique : Les utilisateurs peuvent mettre à jour leurs demandes d'amitié
CREATE POLICY "Users can update their friend requests" ON public.friends
  FOR UPDATE USING (
    auth.uid() = requester_id OR 
    auth.uid() = addressee_id
  );

-- Politique : Les utilisateurs peuvent supprimer leurs relations d'amitié
CREATE POLICY "Users can delete their friendships" ON public.friends
  FOR DELETE USING (
    auth.uid() = requester_id OR 
    auth.uid() = addressee_id
  );

-- 5. FONCTIONS UTILITAIRES CORRIGÉES
-- =====================================================

-- Fonction pour obtenir la liste des amis d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_friends(user_id UUID)
RETURNS TABLE (
  friend_id UUID,
  friend_email TEXT,
  friend_name TEXT,
  friendship_id UUID,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN f.requester_id = user_id THEN f.addressee_id
      ELSE f.requester_id
    END as friend_id,
    CASE 
      WHEN f.requester_id = user_id THEN COALESCE(u2.email, '')::TEXT
      ELSE COALESCE(u1.email, '')::TEXT
    END as friend_email,
    CASE 
      WHEN f.requester_id = user_id THEN COALESCE(u2.name, u2.email, 'Utilisateur')::TEXT
      ELSE COALESCE(u1.name, u1.email, 'Utilisateur')::TEXT
    END as friend_name,
    f.id as friendship_id,
    f.created_at
  FROM public.friends f
  LEFT JOIN public.users u1 ON u1.id = f.requester_id
  LEFT JOIN public.users u2 ON u2.id = f.addressee_id
  WHERE f.status = 'accepted' 
    AND (f.requester_id = user_id OR f.addressee_id = user_id)
  ORDER BY f.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les demandes d'amitié reçues
CREATE OR REPLACE FUNCTION get_friend_requests_received(user_id UUID)
RETURNS TABLE (
  requester_id UUID,
  requester_email TEXT,
  requester_name TEXT,
  friendship_id UUID,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.requester_id,
    COALESCE(u.email, '')::TEXT as requester_email,
    COALESCE(u.name, u.email, 'Utilisateur')::TEXT as requester_name,
    f.id as friendship_id,
    f.created_at
  FROM public.friends f
  LEFT JOIN public.users u ON u.id = f.requester_id
  WHERE f.addressee_id = user_id 
    AND f.status = 'pending'
  ORDER BY f.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les demandes d'amitié envoyées
CREATE OR REPLACE FUNCTION get_friend_requests_sent(user_id UUID)
RETURNS TABLE (
  addressee_id UUID,
  addressee_email TEXT,
  addressee_name TEXT,
  friendship_id UUID,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.addressee_id,
    COALESCE(u.email, '')::TEXT as addressee_email,
    COALESCE(u.name, u.email, 'Utilisateur')::TEXT as addressee_name,
    f.id as friendship_id,
    f.created_at
  FROM public.friends f
  LEFT JOIN public.users u ON u.id = f.addressee_id
  WHERE f.requester_id = user_id 
    AND f.status = 'pending'
  ORDER BY f.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. TRIGGER POUR MISE À JOUR AUTOMATIQUE
-- =====================================================
CREATE OR REPLACE FUNCTION update_friends_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS trigger_update_friends_updated_at ON public.friends;

CREATE TRIGGER trigger_update_friends_updated_at
  BEFORE UPDATE ON public.friends
  FOR EACH ROW
  EXECUTE FUNCTION update_friends_updated_at();

-- 7. MESSAGE DE CONFIRMATION
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Système d''amis corrigé avec succès !';
  RAISE NOTICE '📊 Table friends créée/mise à jour';
  RAISE NOTICE '🔒 RLS activé avec politiques de sécurité';
  RAISE NOTICE '⚡ Index créés pour les performances';
  RAISE NOTICE '🔧 Fonctions utilitaires corrigées :';
  RAISE NOTICE '   - get_user_friends(user_id)';
  RAISE NOTICE '   - get_friend_requests_received(user_id)';
  RAISE NOTICE '   - get_friend_requests_sent(user_id)';
  RAISE NOTICE '🎯 Types de retour corrigés pour Supabase';
END $$;
