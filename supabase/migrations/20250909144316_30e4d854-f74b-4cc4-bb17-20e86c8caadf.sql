-- Ajouter une politique pour permettre aux utilisateurs authentifiés 
-- de rechercher d'autres utilisateurs par email pour les demandes d'amitié
CREATE POLICY "Authenticated users can search others by email for friend requests" 
ON public.users 
FOR SELECT 
TO authenticated
USING (true);