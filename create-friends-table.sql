-- =====================================================
-- CRÉATION DE LA TABLE FRIENDS POUR LE SYSTÈME D'AMIS
-- =====================================================

-- 1. Créer la table friends
CREATE TABLE IF NOT EXISTS public.friends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contrainte pour éviter les doublons
    UNIQUE(requester_id, addressee_id),
    
    -- Contrainte pour éviter qu'un utilisateur s'ajoute lui-même
    CHECK (requester_id != addressee_id)
);

-- 2. Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_friends_requester_id ON public.friends(requester_id);
CREATE INDEX IF NOT EXISTS idx_friends_addressee_id ON public.friends(addressee_id);
CREATE INDEX IF NOT EXISTS idx_friends_status ON public.friends(status);
CREATE INDEX IF NOT EXISTS idx_friends_created_at ON public.friends(created_at);

-- 3. Activer RLS (Row Level Security)
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- 4. Créer les politiques RLS
-- Les utilisateurs peuvent voir leurs propres demandes d'amitié (envoyées et reçues)
CREATE POLICY "Users can view their own friend requests" ON public.friends
    FOR SELECT USING (
        auth.uid() = requester_id OR 
        auth.uid() = addressee_id
    );

-- Les utilisateurs peuvent créer des demandes d'amitié
CREATE POLICY "Users can create friend requests" ON public.friends
    FOR INSERT WITH CHECK (
        auth.uid() = requester_id
    );

-- Les utilisateurs peuvent mettre à jour les demandes qui les concernent
CREATE POLICY "Users can update friend requests" ON public.friends
    FOR UPDATE USING (
        auth.uid() = requester_id OR 
        auth.uid() = addressee_id
    );

-- Les utilisateurs peuvent supprimer leurs propres demandes
CREATE POLICY "Users can delete their own friend requests" ON public.friends
    FOR DELETE USING (
        auth.uid() = requester_id OR 
        auth.uid() = addressee_id
    );

-- 5. Créer une fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Créer le trigger pour updated_at
DROP TRIGGER IF EXISTS update_friends_updated_at ON public.friends;
CREATE TRIGGER update_friends_updated_at
    BEFORE UPDATE ON public.friends
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Créer les fonctions utilitaires pour le système d'amis

-- Fonction pour récupérer les amis d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_friends(user_id UUID)
RETURNS TABLE (
    id UUID,
    email TEXT,
    name TEXT,
    friendship_id UUID,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email::TEXT,
        COALESCE(u.name, u.email::TEXT)::TEXT,
        f.id as friendship_id,
        f.created_at
    FROM public.friends f
    JOIN public.users u ON (
        CASE 
            WHEN f.requester_id = user_id THEN u.id = f.addressee_id
            ELSE u.id = f.requester_id
        END
    )
    WHERE (f.requester_id = user_id OR f.addressee_id = user_id)
    AND f.status = 'accepted'
    ORDER BY f.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour récupérer les demandes d'amitié reçues
CREATE OR REPLACE FUNCTION get_friend_requests_received(user_id UUID)
RETURNS TABLE (
    id UUID,
    email TEXT,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.id,
        u.email::TEXT,
        COALESCE(u.name, u.email::TEXT)::TEXT,
        f.created_at
    FROM public.friends f
    JOIN public.users u ON u.id = f.requester_id
    WHERE f.addressee_id = user_id
    AND f.status = 'pending'
    ORDER BY f.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour récupérer les demandes d'amitié envoyées
CREATE OR REPLACE FUNCTION get_friend_requests_sent(user_id UUID)
RETURNS TABLE (
    id UUID,
    email TEXT,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.id,
        u.email::TEXT,
        COALESCE(u.name, u.email::TEXT)::TEXT,
        f.created_at
    FROM public.friends f
    JOIN public.users u ON u.id = f.addressee_id
    WHERE f.requester_id = user_id
    AND f.status = 'pending'
    ORDER BY f.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour accepter une demande d'amitié
CREATE OR REPLACE FUNCTION accept_friend_request(friendship_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    friendship_record RECORD;
BEGIN
    -- Vérifier que la demande existe et que l'utilisateur est le destinataire
    SELECT * INTO friendship_record
    FROM public.friends
    WHERE id = friendship_id 
    AND addressee_id = user_id 
    AND status = 'pending';
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Mettre à jour le statut
    UPDATE public.friends
    SET status = 'accepted', updated_at = NOW()
    WHERE id = friendship_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour refuser une demande d'amitié
CREATE OR REPLACE FUNCTION decline_friend_request(friendship_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    friendship_record RECORD;
BEGIN
    -- Vérifier que la demande existe et que l'utilisateur est le destinataire
    SELECT * INTO friendship_record
    FROM public.friends
    WHERE id = friendship_id 
    AND addressee_id = user_id 
    AND status = 'pending';
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Mettre à jour le statut
    UPDATE public.friends
    SET status = 'declined', updated_at = NOW()
    WHERE id = friendship_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour supprimer un ami
CREATE OR REPLACE FUNCTION remove_friend(friendship_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    friendship_record RECORD;
BEGIN
    -- Vérifier que l'amitié existe et que l'utilisateur est concerné
    SELECT * INTO friendship_record
    FROM public.friends
    WHERE id = friendship_id 
    AND (requester_id = user_id OR addressee_id = user_id)
    AND status = 'accepted';
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Supprimer l'amitié
    DELETE FROM public.friends
    WHERE id = friendship_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Donner les permissions nécessaires
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.friends TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_friends(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_friend_requests_received(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_friend_requests_sent(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION accept_friend_request(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION decline_friend_request(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_friend(UUID, UUID) TO authenticated;

-- 9. Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Table friends créée avec succès !';
    RAISE NOTICE '✅ Politiques RLS configurées !';
    RAISE NOTICE '✅ Fonctions utilitaires créées !';
    RAISE NOTICE '✅ Permissions accordées !';
    RAISE NOTICE '🚀 Le système d''amis est maintenant opérationnel !';
END $$;
