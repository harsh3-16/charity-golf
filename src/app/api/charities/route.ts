import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createAdminClient();

  // Fetching via service role bypasses RLS and solves the infinite recursion issue
  const { data, error } = await supabase
    .from('charities')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('name');

  if (error) {
    console.error('[charities_get] Error Details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    return NextResponse.json({ 
      error: 'Failed to fetch charities',
      details: error.message 
    }, { status: 500 });
  }

  return NextResponse.json(data);
}
