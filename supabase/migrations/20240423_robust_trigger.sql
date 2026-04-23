-- Update handle_new_user trigger to be idempotent and handle all edge cases.
-- This version uses ON CONFLICT to prevent "Database error saving new user" 
-- when retrying signups or handling race conditions.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_charity_id UUID;
  v_plan public.subscription_plan;
  v_percentage INTEGER;
  v_full_name TEXT;
BEGIN
  -- 1. Safely extract metadata with defaults
  
  -- Full Name
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Member');

  -- Charity ID (handle invalid UUID strings)
  BEGIN
    v_charity_id := (NEW.raw_user_meta_data->>'charity_id')::uuid;
  EXCEPTION WHEN others THEN
    v_charity_id := NULL;
  END;

  -- Plan (default to monthly, handle invalid enum values)
  BEGIN
    v_plan := (COALESCE(NEW.raw_user_meta_data->>'plan', 'monthly'))::public.subscription_plan;
  EXCEPTION WHEN others THEN
    v_plan := 'monthly'::public.subscription_plan;
  END;

  -- Percentage (default to 10, handle non-integer strings)
  BEGIN
    v_percentage := COALESCE((NEW.raw_user_meta_data->>'charity_contribution_percentage')::integer, 10);
    IF v_percentage < 10 THEN v_percentage := 10; END IF;
  EXCEPTION WHEN others THEN
    v_percentage := 10;
  END;

  -- 2. Insert or Update public.users
  -- Using ON CONFLICT ensures that if the row already exists (e.g. from a previous failed attempt 
  -- that partially succeeded), we just update it instead of failing the whole signup.
  INSERT INTO public.users (
    id, 
    email, 
    full_name, 
    avatar_url, 
    charity_id, 
    subscription_plan, 
    subscription_status,
    charity_contribution_percentage
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    v_full_name, 
    NEW.raw_user_meta_data->>'avatar_url', 
    v_charity_id, 
    v_plan, 
    'active'::public.subscription_status,
    v_percentage
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    charity_id = EXCLUDED.charity_id,
    subscription_plan = EXCLUDED.subscription_plan,
    charity_contribution_percentage = EXCLUDED.charity_contribution_percentage;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply the trigger to ensure it's active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
