-- Create RLS policy to allow accepted friends to view each other's profiles
CREATE POLICY "Friends can view each other's profiles" ON public.user_profiles
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.friends 
    WHERE status = 'accepted' 
    AND (
      (requester_id = auth.uid() AND addressee_id = user_profiles.user_id) 
      OR 
      (addressee_id = auth.uid() AND requester_id = user_profiles.user_id)
    )
  )
);