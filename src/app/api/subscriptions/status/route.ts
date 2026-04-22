import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. Get user profile and charity share
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*, charities(*)')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('[sub_status_get] Error fetching profile:', profileError);
    return NextResponse.json({ error: 'Failed to fetch subscription status' }, { status: 500 });
  }

  // 2. Get latest subscription record for dates
  const { data: sub, error: subError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // Dynamic calculation for "Total Donated"
  // Since we don't have a transaction history table, we'll estimate based on time active
  let totalDonated = 0;
  let monthsActive = 0;

  if (profile.subscription_status === 'active' && sub) {
    const startDate = new Date(sub.current_period_start || profile.created_at);
    const now = new Date();
    
    // Difference in months
    monthsActive = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
    monthsActive = Math.max(1, monthsActive); // At least 1 month if active

    const monthlyPrice = profile.subscription_plan === 'yearly' ? 100 / 12 : 10;
    const charityPercentage = (profile.charity_contribution_percentage || 10) / 100;
    
    totalDonated = monthsActive * monthlyPrice * charityPercentage;
  }

  // 3. Get total winnings
  const { data: winningsData } = await supabase
    .from('draw_entries')
    .select('prize_amount')
    .eq('user_id', user.id)
    .not('prize_amount', 'is', null);

  const totalWinnings = winningsData?.reduce((sum, entry) => sum + (Number(entry.prize_amount) || 0), 0) || 0;

  return NextResponse.json({
    status: profile.subscription_status,
    plan: profile.subscription_plan,
    renewal_date: profile.subscription_renewal_date,
    total_donated: totalDonated,
    total_winnings: totalWinnings,
    charity: profile.charities,
    percentage: profile.charity_contribution_percentage,
  });
}
