import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateDrawNumbers, calculatePoolDistribution } from '@/lib/draw-engine';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // 1. Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { mode } = await req.json();

    // 2. Generate simulated numbers
    const drawnNumbers = await generateDrawNumbers(mode);

    // 3. Calculate pool metrics
    // Get active subscriber count
    const { count: activeSubscribers, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active');

    if (countError) throw countError;

    // Get rolled over amount from last draw
    const { data: lastDraw } = await supabase
      .from('draws')
      .select('jackpot_amount, status')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const rolledOverAmount = (lastDraw && lastDraw.status !== 'published') ? lastDraw.jackpot_amount : 0;
    
    const poolMetrics = await calculatePoolDistribution(activeSubscribers || 0, Number(rolledOverAmount) || 0);

    // 4. Simulate winners (this would be expensive to run on all users, so we'll do a sample or mock the count for simulation)
    // In a real prod environment, this would be a background job.
    // For simulation, we'll provide a realistic breakdown based on probability.
    const mockWinners = {
      match5: Math.random() > 0.9 ? 1 : 0,
      match4: Math.floor(Math.random() * 10) + 2,
      match3: Math.floor(Math.random() * 100) + 50,
    };

    return NextResponse.json({
      numbers: drawnNumbers,
      winners: mockWinners,
      metrics: poolMetrics,
      activeSubscribers: activeSubscribers || 0,
      draw_date: new Date().toISOString(), // Next draw date would be end of month usually
    });

  } catch (err: any) {
    console.error('[draws_simulate] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
