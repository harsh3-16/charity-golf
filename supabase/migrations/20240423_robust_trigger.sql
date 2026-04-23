-- Update handle_new_user trigger to handle charity_contribution_percentage 
-- and be more resilient to missing/null metadata.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_charity_id UUID;
  v_plan subscription_plan;
  v_percentage INTEGER;
BEGIN
  -- 1. Safely extract and cast metadata
  -- Charity ID (null if missing or invalid)
  BEGIN
    v_charity_id := (NEW.raw_user_meta_data->>'charity_id')::uuid;
  EXCEPTION WHEN others THEN
    v_charity_id := NULL;
  END;

  -- Plan (default to monthly if missing or invalid)
  BEGIN
    v_plan := (COALESCE(NEW.raw_user_meta_data->>'plan', 'monthly'))::subscription_plan;
  EXCEPTION WHEN others THEN
    v_plan := 'monthly'::subscription_plan;
  END;

  -- Percentage (default to 10 if missing or invalid)
  BEGIN
    v_percentage := COALESCE((NEW.raw_user_meta_data->>'charity_contribution_percentage')::integer, 10);
  EXCEPTION WHEN others THEN
    v_percentage := 10;
  END;

  -- 2. Insert into public.users
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
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Member'), 
    NEW.raw_user_meta_data->>'avatar_url', 
    v_charity_id, 
    v_plan, 
    'active',
    v_percentage
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
