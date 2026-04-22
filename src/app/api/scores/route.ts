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

  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('[scores_get] Error fetching scores:', error);
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { score, date } = await req.json();

    // Basic validation
    if (!score || !date) {
      return NextResponse.json({ error: 'Score and date are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('scores')
      .insert({
        user_id: user.id,
        score,
        date,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A score already exists for this date' }, { status: 400 });
      }
      console.error('[scores_post] Error creating score:', error);
      return NextResponse.json({ error: 'Failed to create score' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('[scores_post] Parse error:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
