import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Admin check
    const { data: { user: adminUser } } = await supabase.auth.getUser();
    if (!adminUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: adminProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', adminUser.id)
      .single();

    if (adminProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Fetch Aggregated Stats
    // Total Users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Active Subscriptions
    const { count: activeSubs } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active');

    // Current Prize Pool (from upcoming draw)
    const { data: upcomingDraw } = await supabase
      .from('draws')
      .select('jackpot_amount, total_prize_pool')
      .eq('status', 'published')
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(1)
      .single();

    // Total Charity Paid (sum of past draws' distributions - hypothetical calculation for now)
    // In a real app, this would be a separate ledger. Here we sum a percentage of prize pools.
    const { data: pastDraws } = await supabase
      .from('draws')
      .select('total_prize_pool')
      .eq('status', 'published');
    
    const totalPrizePoolSum = pastDraws?.reduce((sum, draw) => sum + (Number(draw.total_prize_pool) || 0), 0) || 0;
    const totalCharityPaid = totalPrizePoolSum * 0.25; // Example: 25% of pool goes to charity

    // Pending Verifications
    const { count: pendingVerifications } = await supabase
      .from('winner_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('admin_status', 'pending');

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      activeSubs: activeSubs || 0,
      prizePool: upcomingDraw?.jackpot_amount || 0,
      charityPaid: totalCharityPaid,
      pendingVerifications: pendingVerifications || 0,
      lastSync: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('[admin_stats_get] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
