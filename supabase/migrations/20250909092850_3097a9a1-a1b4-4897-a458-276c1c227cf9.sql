-- Enable Row Level Security on user_stats table
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view only their own statistics
CREATE POLICY "Users can view own statistics" 
ON public.user_stats 
FOR SELECT 
USING (auth.uid() = id);

-- Create policy for users to update only their own statistics
CREATE POLICY "Users can update own statistics" 
ON public.user_stats 
FOR UPDATE 
USING (auth.uid() = id);

-- Create policy for users to insert only their own statistics
CREATE POLICY "Users can insert own statistics" 
ON public.user_stats 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create policy for users to delete only their own statistics
CREATE POLICY "Users can delete own statistics" 
ON public.user_stats 
FOR DELETE 
USING (auth.uid() = id);