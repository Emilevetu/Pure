-- =====================================================
-- SCHEMA SUPABASE PARFAIT POUR ASTRO-ALIGNEMENT
-- =====================================================
-- À exécuter dans Supabase Dashboard > SQL Editor

-- Supprimer les tables existantes si elles existent (pour repartir à zéro)
DROP TABLE IF EXISTS astrology_charts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS delete_user_completely(UUID) CASCADE;

-- =====================================================
-- 1. TABLE USERS (Profil utilisateur)
-- =====================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  birth_date DATE,
  location TEXT,
  timezone VARCHAR(50) DEFAULT 'Europe/Paris',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  login_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Contraintes de validation
  CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT check_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 255),
  CONSTRAINT check_bio_length CHECK (char_length(bio) <= 500)
);

-- =====================================================
-- 2. TABLE ASTROLOGY_CHARTS (Thèmes astraux)
-- =====================================================
CREATE TABLE public.astrology_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'natal',
  birth_data JSONB NOT NULL,
  planetary_positions JSONB,
  astro_interpretation JSONB,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes de validation
  CONSTRAINT check_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 255),
  CONSTRAINT check_description_length CHECK (char_length(description) <= 1000),
  CONSTRAINT check_type_valid CHECK (type IN ('natal', 'solar', 'lunar', 'synastry', 'composite')),
  CONSTRAINT check_view_count_positive CHECK (view_count >= 0),
  CONSTRAINT check_share_count_positive CHECK (share_count >= 0)
);

-- =====================================================
-- 3. FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Fonction pour supprimer complètement un utilisateur
CREATE OR REPLACE FUNCTION delete_user_completely(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Supprimer les thèmes astraux de l'utilisateur
    DELETE FROM public.astrology_charts WHERE user_id = delete_user_completely.user_id;
    
    -- Supprimer le profil utilisateur
    DELETE FROM public.users WHERE id = delete_user_completely.user_id;
    
    -- Supprimer l'utilisateur de auth.users (cascade automatique)
    DELETE FROM auth.users WHERE id = delete_user_completely.user_id;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- =====================================================
-- 4. TRIGGERS
-- =====================================================

-- Trigger pour updated_at automatique sur astrology_charts
CREATE TRIGGER update_astrology_charts_updated_at 
    BEFORE UPDATE ON public.astrology_charts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astrology_charts ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les utilisateurs
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON public.users
  FOR DELETE USING (auth.uid() = id);

-- Politiques RLS pour les thèmes astraux
CREATE POLICY "Users can view own charts" ON public.astrology_charts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public charts" ON public.astrology_charts
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert own charts" ON public.astrology_charts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own charts" ON public.astrology_charts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own charts" ON public.astrology_charts
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 6. INDEX POUR LES PERFORMANCES
-- =====================================================

-- Index pour les utilisateurs
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON public.users(last_login);

-- Index pour les thèmes astraux
CREATE INDEX IF NOT EXISTS idx_astrology_charts_user_id ON public.astrology_charts(user_id);
CREATE INDEX IF NOT EXISTS idx_astrology_charts_created_at ON public.astrology_charts(created_at);
CREATE INDEX IF NOT EXISTS idx_astrology_charts_user_created ON public.astrology_charts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_astrology_charts_public ON public.astrology_charts(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_astrology_charts_favorite ON public.astrology_charts(user_id, is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_astrology_charts_type ON public.astrology_charts(type);

-- Index GIN pour les recherches JSONB
CREATE INDEX IF NOT EXISTS idx_astrology_charts_birth_data ON public.astrology_charts USING GIN (birth_data);
CREATE INDEX IF NOT EXISTS idx_astrology_charts_planetary_positions ON public.astrology_charts USING GIN (planetary_positions);
CREATE INDEX IF NOT EXISTS idx_astrology_charts_tags ON public.astrology_charts USING GIN (tags);

-- =====================================================
-- 7. VUES UTILITAIRES
-- =====================================================

-- Vue pour les statistiques utilisateur
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.created_at,
    u.last_login,
    u.login_count,
    COUNT(ac.id) as total_charts,
    COUNT(CASE WHEN ac.is_public THEN 1 END) as public_charts,
    COUNT(CASE WHEN ac.is_favorite THEN 1 END) as favorite_charts,
    COALESCE(SUM(ac.view_count), 0) as total_views,
    COALESCE(SUM(ac.share_count), 0) as total_shares
FROM public.users u
LEFT JOIN public.astrology_charts ac ON u.id = ac.user_id
GROUP BY u.id, u.name, u.email, u.created_at, u.last_login, u.login_count;

-- =====================================================
-- 8. PERMISSIONS
-- =====================================================

-- Donner les permissions nécessaires
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.astrology_charts TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.astrology_charts TO service_role;

-- =====================================================
-- 9. MESSAGE DE CONFIRMATION
-- =====================================================
SELECT '🎉 Schema Supabase parfait créé avec succès!' as message,
       'Tables: users, astrology_charts' as tables,
       'Fonctions: update_updated_at_column, delete_user_completely' as functions,
       'Triggers: updated_at automatique' as triggers,
       'Index: 12 index optimisés' as indexes,
       'RLS: Politiques de sécurité complètes' as security;
