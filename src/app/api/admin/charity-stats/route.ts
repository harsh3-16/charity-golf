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

    // 2. Fetch Charity Split
    // Count active users per charity
    const { data: userSplits, error } = await supabase
      .from('users')
      .select(`
        charity_id,
        charity_contribution_percentage,
        charities (name)
      `)
      .eq('subscription_status', 'active')
      .not('charity_id', 'is', null);

    if (error) throw error;

    const charityMap: Record<string, { name: string, totalWeight: number, color: string }> = {};
    const colors = ['emerald', 'rose', 'blue', 'amber', 'purple', 'cyan'];

    userSplits?.forEach((u, i) => {
      const name = (u.charities as any)?.[0]?.name || 'Unknown';
      if (!charityMap[name]) {
        charityMap[name] = { 
          name, 
          totalWeight: 0, 
          color: colors[Object.keys(charityMap).length % colors.length] 
        };
      }
      charityMap[name].totalWeight += u.charity_contribution_percentage;
    });

    const totalWeight = Object.values(charityMap).reduce((sum, c) => sum + c.totalWeight, 0);
    
    // Calculate hypothetical amounts based on total charity pool (e.g. £120,450 from the overview)
    const mockTotalCharityPaid = 120450; 

    const result = Object.values(charityMap).map(c => ({
      name: c.name,
      perc: totalWeight > 0 ? Math.round((c.totalWeight / totalWeight) * 100) : 0,
      amount: `£${Math.round((c.totalWeight / (totalWeight || 1)) * mockTotalCharityPaid).toLocaleString()}`,
      color: c.color
    })).sort((a, b) => b.perc - a.perc);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[admin_charity_stats_get] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
