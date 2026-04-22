-- Delete existing to avoid conflicts during full re-seed
DELETE FROM public.winner_verifications;
DELETE FROM public.draw_entries;
DELETE FROM public.scores;
DELETE FROM public.subscriptions;
DELETE FROM public.draws;
DELETE FROM public.users WHERE role != 'admin'; -- Keep the admin user if one exists
DELETE FROM public.charities;

-- 1. Seed Charities
INSERT INTO public.charities (id, name, description, image_url, website, is_featured)
VALUES 
('e8bd21c2-c6e3-474a-856b-d4a3714bba48', 'Cancer Research UK', 'The world’s leading cancer charity dedicated to saving lives through research, influence and information.', 'https://images.unsplash.com/photo-1579152276511-73678224c581?q=80&w=2070&auto=format&fit=crop', 'https://www.cancerresearchuk.org/', true),
('4f531e66-e4d5-4c5b-aa24-d3be7384177e', 'The Golf Foundation', 'Helping young people from all backgrounds enjoy the personal and social benefits of golf.', 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2070&auto=format&fit=crop', 'https://www.golf-foundation.org/', true),
('8e2c1a55-5cc6-4691-8bd2-8fde5b9bca5a', 'British Heart Foundation', 'Funding research to keep hearts beating and blood flowing.', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop', 'https://www.bhf.org.uk/', false),
('f7478d96-5201-4e53-853d-f73d650f0606', 'Macmillan Cancer Support', 'Providing physical, financial and emotional support to help people live life as fully as they can.', 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop', 'https://www.macmillan.org.uk/', true),
('63bf6168-61b1-4b3a-b4e1-f2e2d214ae5c', 'Save the Children', 'Working in more than 100 countries to help children stay safe, healthy and keep learning.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop', 'https://www.savethechildren.org.uk/', false);

-- 2. Seed Draws
-- Past 5 months
INSERT INTO public.draws (month, year, status, draw_mode, drawn_numbers, total_prize_pool, jackpot_amount)
VALUES 
(11, 2025, 'published', 'random', ARRAY[1, 15, 22, 33, 44], 10000.00, 4000.00),
(12, 2025, 'published', 'hot', ARRAY[5, 12, 19, 28, 41], 12000.00, 5000.00),
(1, 2026, 'published', 'cold', ARRAY[8, 16, 25, 32, 45], 11500.00, 4800.00),
(2, 2026, 'published', 'random', ARRAY[12, 24, 31, 38, 42], 12500.00, 5200.00),
(3, 2026, 'published', 'hot', ARRAY[3, 11, 22, 35, 40], 14000.00, 6000.00),
(4, 2026, 'published', 'random', ARRAY[7, 14, 21, 28, 35], 15240.00, 8000.00); -- Current month

-- 3. Seed Mock Users (Only public.users for stats visibility)
-- We use static UUIDs for these mock users to maintain consistency in relationships
DO $$ 
DECLARE
    user1_id UUID := '11111111-1111-1111-1111-111111111111';
    user2_id UUID := '22222222-2222-2222-2222-222222222222';
    user3_id UUID := '33333333-3333-3333-3333-333333333333';
    user4_id UUID := '44444444-4444-4444-4444-444444444444';
    charity1_id UUID := 'e8bd21c2-c6e3-474a-856b-d4a3714bba48';
    charity2_id UUID := '4f531e66-e4d5-4c5b-aa24-d3be7384177e';
    charity3_id UUID := '8e2c1a55-5cc6-4691-8bd2-8fde5b9bca5a';
BEGIN
    -- Insert into public.users (Note: Normally these would be created via auth.users trigger)
    -- We're bypassing the foreign key to auth.users for SEED ONLY by disabling triggers if needed, 
    -- but usually we should have real auth users. 
    -- Since we can't create auth users here, we'll assume the environment allows public.users 
    -- without active auth sessions for dashboard "view only" stats.
    
    INSERT INTO public.users (id, email, full_name, role, subscription_status, subscription_plan, charity_id, charity_contribution_percentage, created_at)
    VALUES 
    (user1_id, 'tiger.woods@mock.com', 'Tiger Woods', 'user', 'active', 'yearly', charity1_id, 25, NOW() - INTERVAL '6 months'),
    (user2_id, 'rory.mcilroy@mock.com', 'Rory McIlroy', 'user', 'active', 'monthly', charity2_id, 15, NOW() - INTERVAL '4 months'),
    (user3_id, 'jon.rahm@mock.com', 'Jon Rahm', 'user', 'active', 'yearly', charity1_id, 10, NOW() - INTERVAL '8 months'),
    (user4_id, 'scottie.scheffler@mock.com', 'Scottie Scheffler', 'user', 'active', 'monthly', charity3_id, 20, NOW() - INTERVAL '2 months')
    ON CONFLICT (id) DO NOTHING;

    -- Seed Scores for User 1
    INSERT INTO public.scores (user_id, score, date) VALUES 
    (user1_id, 38, CURRENT_DATE - INTERVAL '1 day'),
    (user1_id, 42, CURRENT_DATE - INTERVAL '5 days'),
    (user1_id, 35, CURRENT_DATE - INTERVAL '10 days'),
    (user1_id, 40, CURRENT_DATE - INTERVAL '15 days'),
    (user1_id, 39, CURRENT_DATE - INTERVAL '20 days');

    -- Seed Draw Entries (Past Winnings)
    INSERT INTO public.draw_entries (draw_id, user_id, user_scores, matched_numbers, match_count, prize_amount, payment_status)
    VALUES 
    ((SELECT id FROM public.draws WHERE month = 3 AND year = 2026), user1_id, ARRAY[3, 11, 22, 35, 40], ARRAY[3, 11, 22], 3, 250.00, 'paid'),
    ((SELECT id FROM public.draws WHERE month = 2 AND year = 2026), user2_id, ARRAY[12, 24, 31, 38, 42], ARRAY[12, 24, 31, 38], 4, 1200.00, 'paid');

    -- Seed Winner Verifications
    INSERT INTO public.winner_verifications (draw_entry_id, user_id, proof_screenshot_url, admin_status, admin_notes)
    VALUES 
    ((SELECT id FROM public.draw_entries WHERE prize_amount = 1200.00), user2_id, 'https://placehold.co/600x400/000000/FFFFFF?text=Proof+Screenshot', 'approved', 'Verified scorecard matches entries.');
END $$;
