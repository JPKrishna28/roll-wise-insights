
-- Create a function to verify admin login credentials
CREATE OR REPLACE FUNCTION public.verify_admin_login(input_email TEXT, input_password TEXT)
RETURNS TABLE(id UUID, email TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT au.id, au.email
  FROM public.admin_users au
  WHERE au.email = input_email
    AND au.password_hash = crypt(input_password, au.password_hash);
END;
$$;
