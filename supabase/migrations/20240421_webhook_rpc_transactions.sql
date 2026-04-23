-- B8 — Atomic RPC functions for Stripe webhook handlers.
-- Both functions run inside an implicit transaction; if any statement fails,
-- the entire operation rolls back, preventing partial/corrupted state.

-- ============================================================
-- 1. handle_checkout_completed
--    Called when Stripe fires checkout.session.completed.
--    Atomically updates the users table AND inserts a subscriptions row.
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_checkout_completed(
  p_user_id              UUID,
  p_plan                 TEXT,   -- 'monthly' | 'yearly'
  p_charity_id           UUID,
  p_renewal_date         TIMESTAMPTZ,
  p_stripe_subscription_id TEXT,
  p_stripe_customer_id   TEXT,
  p_period_start         TIMESTAMPTZ,
  p_period_end           TIMESTAMPTZ
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 1. Update user subscription status
  UPDATE public.users
  SET
    subscription_status      = 'active'::public.subscription_status,
    subscription_plan        = p_plan::public.subscription_plan,
    charity_id               = p_charity_id,
    subscription_renewal_date = p_renewal_date
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found', p_user_id;
  END IF;

  -- 2. Insert subscription record
  INSERT INTO public.subscriptions (
    user_id,
    stripe_subscription_id,
    stripe_customer_id,
    plan,
    status,
    current_period_start,
    current_period_end
  ) VALUES (
    p_user_id,
    p_stripe_subscription_id,
    p_stripe_customer_id,
    p_plan,
    'active'::public.subscription_status,
    p_period_start,
    p_period_end
  );
END;
$$;

-- ============================================================
-- 2. handle_subscription_deleted
--    Called when Stripe fires customer.subscription.deleted.
--    Atomically marks both the user and subscription as lapsed.
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_subscription_deleted(
  p_user_id                UUID,
  p_stripe_subscription_id TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 1. Update user status
  UPDATE public.users
  SET subscription_status = 'lapsed'::public.subscription_status
  WHERE id = p_user_id;

  -- 2. Update subscription record
  UPDATE public.subscriptions
  SET status = 'lapsed'::public.subscription_status
  WHERE stripe_subscription_id = p_stripe_subscription_id;
END;
$$;

-- Grant execute to the service role used by the webhook handler
GRANT EXECUTE ON FUNCTION public.handle_checkout_completed TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_subscription_deleted TO service_role;
