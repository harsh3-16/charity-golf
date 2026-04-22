import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const { notes } = await req.json();

    // 2. Update verification status
    const { error: verError } = await supabase
      .from('winner_verifications')
      .update({
        admin_status: 'rejected',
        admin_notes: notes,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', id);

    if (verError) throw verError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[admin_winnings_reject] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
