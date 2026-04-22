import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { charity_id, charity_contribution_percentage } = await req.json();

    // B4 — Input validation: Ensure percentage is at least 10%
    if (charity_contribution_percentage && charity_contribution_percentage < 10) {
      return NextResponse.json({ error: 'Minimum charity contribution is 10%' }, { status: 400 });
    }

    const updateData: any = {};
    if (charity_id) updateData.charity_id = charity_id;
    if (charity_contribution_percentage) updateData.charity_contribution_percentage = charity_contribution_percentage;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('[users_charity_patch] Error updating user:', error);
      return NextResponse.json({ error: 'Failed to update charity settings' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
