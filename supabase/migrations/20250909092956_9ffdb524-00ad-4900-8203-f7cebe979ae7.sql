-- Fix the search_path issue for our new function by being more explicit
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
    FROM public.users u
    LEFT JOIN public.astrology_charts ac ON (u.id = ac.user_id)
    WHERE u.id = auth.uid()  -- Only return stats for the current authenticated user
    GROUP BY u.id, u.name, u.email, u.created_at, u.last_login, u.login_count;
$$;