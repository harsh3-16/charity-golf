import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendDrawPublishedEmail } from '@/lib/email';

export async function POST(req: Request) {
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

    const { numbers, metrics, mode } = await req.json();

    // 2. Upsert the draw record (allows re-publishing for the same month)
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .upsert({
        month,
        year,
        status: 'published',
        draw_mode: mode,
        drawn_numbers: numbers,
        total_prize_pool: metrics.totalPool,
        jackpot_amount: metrics.jackpot,
        pool_4match: metrics.pool4match,
        pool_3match: metrics.pool3match,
      }, { onConflict: 'month,year' })
      .select()
      .single();

    if (drawError) throw drawError;

    // 2b. Clear any existing entries for this draw if re-publishing
    await supabase
      .from('draw_entries')
      .delete()
      .eq('draw_id', draw.id);

    // 3. Match calculation for all active users
    // Fetch active users with their latest 5 scores
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, scores(score)')
      .eq('subscription_status', 'active');

    if (usersError) throw usersError;

    const winningNumbers = new Set(numbers);
    const winners: any[] = [];
    const winnerEmails: string[] = [];

    users.forEach((u: any) => {
      const userScores = u.scores?.map((s: any) => s.score) || [];
      const matched = userScores.filter((s: any) => winningNumbers.has(s));
      const matchCount = matched.length;

      if (matchCount >= 3) {
        winners.push({
          draw_id: draw.id,
          user_id: u.id,
          user_scores: userScores,
          matched_numbers: matched,
          match_count: matchCount,
          // Prize splitting would happen here in a real scenario
          // For now we assign the tier pool (placeholder)
          prize_amount: matchCount === 5 ? metrics.jackpot : (matchCount === 4 ? metrics.pool4match : metrics.pool3match),
        });
        winnerEmails.push(u.email);
      }
    });

    // 4. Batch insert draw entries
    if (winners.length > 0) {
      const { error: entryError } = await supabase
        .from('draw_entries')
        .insert(winners);
      
      if (entryError) console.error('[draws_publish] Error creating entries:', entryError);
    }

    // 5. Notify all subscribers (not just winners)
    const allEmails = users.map(u => u.email);
    if (allEmails.length > 0) {
      await sendDrawPublishedEmail(allEmails, now.toLocaleString('default', { month: 'long' }));
    }

    return NextResponse.json({ 
      success: true, 
      draw_id: draw.id,
      winners_count: winners.length 
    });

  } catch (err: any) {
    console.error('[draws_publish] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
