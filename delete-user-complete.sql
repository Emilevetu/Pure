-- =====================================================
-- FONCTION POUR SUPPRIMER COMPLÈTEMENT UN UTILISATEUR
-- =====================================================
-- À exécuter dans Supabase Dashboard > SQL Editor

-- Fonction pour supprimer complètement un utilisateur et toutes ses données
CREATE OR REPLACE FUNCTION delete_user_completely(user_id_to_delete UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Vérifier que l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_id_to_delete) THEN
        RAISE EXCEPTION 'Utilisateur non trouvé';
    END IF;

    -- 1. Supprimer tous les thèmes astraux de l'utilisateur
    DELETE FROM public.astrology_charts WHERE user_id = user_id_to_delete;
    
    -- 2. Supprimer le profil utilisateur de la table public.users
    DELETE FROM public.users WHERE id = user_id_to_delete;
    
    -- 3. Supprimer l'utilisateur de auth.users (cascade automatique)
    -- Note: Cette opération doit être faite avec les permissions appropriées
    DELETE FROM auth.users WHERE id = user_id_to_delete;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        -- En cas d'erreur, on log l'erreur et on retourne false
        RAISE EXCEPTION 'Erreur lors de la suppression: %', SQLERRM;
        RETURN FALSE;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION delete_user_completely(UUID) TO authenticated;

-- Message de confirmation
SELECT 'Fonction delete_user_completely créée avec succès!' as message;
