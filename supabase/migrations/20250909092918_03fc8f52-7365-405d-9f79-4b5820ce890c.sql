-- Drop the existing insecure user_stats view
DROP VIEW IF EXISTS public.user_stats;

-- Create a secure function to get user statistics for the current user only
CREATE OR REPLACE FUNCTION public.get_user_stats()
RETURNS TABLE (
    id uuid,
    name character varying,
    email character varying,
    created_at timestamp with time zone,
    last_login timestamp with time zone,
    login_count integer,
    total_charts bigint,
    public_charts bigint,
    favorite_charts bigint,
    total_views bigint,
    total_shares bigint
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT 
        u.id,
        u.name,
        u.email,
        u.created_at,
        u.last_login,
        u.login_count,
        count(ac.id) AS total_charts,
        count(
            CASE
                WHEN ac.is_public THEN 1
                ELSE NULL::integer
            END) AS public_charts,
        count(
            CASE
                WHEN ac.is_favorite THEN 1
                ELSE NULL::integer
            END) AS favorite_charts,
        COALESCE(sum(ac.view_count), 0::bigint) AS total_views,
        COALESCE(sum(ac.share_count), 0::bigint) AS total_shares
    FROM users u
    LEFT JOIN astrology_charts ac ON (u.id = ac.user_id)
    WHERE u.id = auth.uid()  -- Only return stats for the current authenticated user
    GROUP BY u.id, u.name, u.email, u.created_at, u.last_login, u.login_count;
$$;

-- Create a secure view that only shows the current user's statistics
CREATE VIEW public.user_stats 
WITH (security_invoker = true) AS
SELECT * FROM public.get_user_stats();

-- Grant usage permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.user_stats TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_stats() TO authenticated;