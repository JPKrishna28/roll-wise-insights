
-- Create a table for admin users
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Enable the pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert a default super admin (password will be 'admin123' - change this!)
INSERT INTO public.admin_users (email, password_hash) 
VALUES ('jaswanth@gmail.com', crypt('Jaswanth@123', gen_salt('bf')));

-- Create policy that only allows authenticated admins to access admin_users table
CREATE POLICY "Only authenticated admins can access admin_users" 
  ON public.admin_users 
  FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.admin_users));
