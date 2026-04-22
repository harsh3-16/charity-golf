import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // 1. Get total count of active subscribers for dynamic jackpot calculation
  const { count: activeSubscribers, error: countError } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active');

  if (countError) {
    console.error('[draws_upcoming] Error counting subscribers:', countError);
    return NextResponse.json({ error: 'Failed to calculate draw metrics' }, { status: 500 });
  }

  // 2. Fetch the draw record if it exists
  const { data: drawData, error: drawError } = await supabase
    .from('draws')
    .select('*')
    .eq('month', currentMonth)
    .eq('year', currentYear)
    .single();

  // If no draw record yet, we'll return an estimated one
  const baseJackpot = 10000;
  const subscribers = activeSubscribers || 0;
  const estimatedJackpot = baseJackpot + subscribers * 1.5; // £1.50 per subscriber for the pool

  // The draw is usually at the end of the month
  const drawDate = new Date(currentYear, currentMonth, 0); // Last day of month

  return NextResponse.json({
    month: currentMonth,
    year: currentYear,
    status: drawData?.status || 'draft',
    jackpot_amount: drawData?.jackpot_amount || estimatedJackpot,
    total_prize_pool: drawData?.total_prize_pool || (estimatedJackpot * 1.8),
    draw_date: drawDate.toISOString(),
    active_entries: subscribers,
  });
}
