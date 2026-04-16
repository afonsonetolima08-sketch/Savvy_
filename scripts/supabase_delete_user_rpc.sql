-- Run this SQL in your Supabase project's SQL Editor (Dashboard → SQL Editor)
-- It creates a PostgreSQL function that the authenticated user can call via supabase.rpc("delete_user")
-- The function deletes the caller's own auth.users record (requires SECURITY DEFINER to access auth schema)

CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete the currently authenticated user from Supabase Auth
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user() TO authenticated;
