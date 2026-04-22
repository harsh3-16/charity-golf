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

    // 2. Fetch Revenue Data (Mocking monthly trend based on active users for now, 
    // since we don't have a payments table yet. In production, this would query Stripe or a Transactions table)
    const { data: activeUsers } = await supabase
      .from('users')
      .select('subscription_plan, created_at')
      .eq('subscription_status', 'active');

    // Group by month for the last 7 months
    const now = new Date();
    const months = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
      return {
        label: d.toLocaleString('default', { month: 'short' }),
        month: d.getMonth(),
        year: d.getFullYear(),
        value: 0
      };
    });

    activeUsers?.forEach(user => {
      const created = new Date(user.created_at);
      const planValue = user.subscription_plan === 'yearly' ? 120 : 12; // Example amounts
      
      months.forEach(m => {
        // If user was created before or during this month, they contribute to revenue
        if (created.getFullYear() < m.year || (created.getFullYear() === m.year && created.getMonth() <= m.month)) {
          m.value += planValue;
        }
      });
    });

    const totalRevenue = months.reduce((sum, m) => sum + m.value, 0);

    return NextResponse.json({
      chartData: months,
      mrr: activeUsers?.reduce((sum, u) => sum + (u.subscription_plan === 'yearly' ? 10 : 12), 0) || 0,
      yearlyRevenue: totalRevenue
    });
  } catch (err: any) {
    console.error('[admin_revenue_get] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
