-- Create custom types
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'lapsed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_plan') THEN
        CREATE TYPE subscription_plan AS ENUM ('monthly', 'yearly');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'draw_status') THEN
        CREATE TYPE draw_status AS ENUM ('draft', 'simulated', 'published');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'draw_mode') THEN
        CREATE TYPE draw_mode AS ENUM ('random', 'hot', 'cold');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status') THEN
        CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('pending', 'paid');
    END IF;
END $$;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Charities table
CREATE TABLE IF NOT EXISTS public.charities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  website TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  upcoming_events JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extension of auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_status subscription_status DEFAULT 'inactive',
  subscription_plan subscription_plan,
  subscription_renewal_date TIMESTAMP WITH TIME ZONE,
  charity_id UUID REFERENCES public.charities(id),
  charity_contribution_percentage INTEGER DEFAULT 10 CHECK (charity_contribution_percentage >= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scores table
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Draws table
CREATE TABLE IF NOT EXISTS public.draws (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  status draw_status DEFAULT 'draft',
  draw_mode draw_mode DEFAULT 'hot',
  drawn_numbers INTEGER[] CHECK (array_length(drawn_numbers, 1) = 5),
  total_prize_pool NUMERIC(12, 2) DEFAULT 0,
  jackpot_amount NUMERIC(12, 2) DEFAULT 0,
  pool_4match NUMERIC(12, 2) DEFAULT 0,
  pool_3match NUMERIC(12, 2) DEFAULT 0,
  jackpot_rolled_over BOOLEAN DEFAULT FALSE,
  rolled_over_amount NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(month, year)
);

-- Draw entries
CREATE TABLE IF NOT EXISTS public.draw_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_id UUID REFERENCES public.draws NOT NULL,
  user_id UUID REFERENCES public.users NOT NULL,
  user_scores INTEGER[], -- Snapshot of user's 5 scores at draw time
  matched_numbers INTEGER[],
  match_count INTEGER CHECK (match_count IN (3, 4, 5)),
  prize_amount NUMERIC(12, 2),
  payment_status payment_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan subscription_plan,
  status TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Winner verifications
CREATE TABLE IF NOT EXISTS public.winner_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_entry_id UUID REFERENCES public.draw_entries NOT NULL,
  user_id UUID REFERENCES public.users NOT NULL,
  proof_screenshot_url TEXT,
  admin_status verification_status DEFAULT 'pending',
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- FUNCTION: handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, charity_id, subscription_plan, subscription_status)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url', (NEW.raw_user_meta_data->>'charity_id')::uuid, (NEW.raw_user_meta_data->>'plan')::subscription_plan, 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER: handle_new_user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- FUNCTION: manage_rolling_scores
CREATE OR REPLACE FUNCTION public.manage_rolling_scores()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.scores
  WHERE id NOT IN (
    SELECT id FROM public.scores
    WHERE user_id = NEW.user_id
    ORDER BY date DESC, created_at DESC
    LIMIT 5
  ) AND user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER: manage_rolling_scores
DROP TRIGGER IF EXISTS trigger_manage_rolling_scores ON public.scores;
CREATE TRIGGER trigger_manage_rolling_scores
AFTER INSERT ON public.scores
FOR EACH ROW EXECUTE FUNCTION public.manage_rolling_scores();

-- FUNCTION: is_admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS POLICIES

-- Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own row" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own row" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can read all users" ON public.users FOR SELECT USING (is_admin(auth.uid()));

-- Scores
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD their own scores" ON public.scores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all scores" ON public.scores FOR SELECT USING (is_admin(auth.uid()));

-- Charities
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read charities" ON public.charities FOR SELECT USING (true);
CREATE POLICY "Only admins can modify charities" ON public.charities FOR ALL USING (is_admin(auth.uid()));

-- Draws
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published draws" ON public.draws FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can CRUD all draws" ON public.draws FOR ALL USING (is_admin(auth.uid()));

-- Draw Entries
ALTER TABLE public.draw_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own entries" ON public.draw_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all entries" ON public.draw_entries FOR SELECT USING (is_admin(auth.uid()));

-- Subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all subscriptions" ON public.subscriptions FOR SELECT USING (is_admin(auth.uid()));

-- Winner Verifications
ALTER TABLE public.winner_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read/insert their own verifications" ON public.winner_verifications 
FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can read/update all verifications" ON public.winner_verifications 
FOR ALL USING (is_admin(auth.uid()));
