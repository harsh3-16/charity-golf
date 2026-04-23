import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendRenewalReminderEmail } from '@/lib/email';

export async function GET(req: Request) {
  // 1. Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const supabaseAdmin = createAdminClient();

    // 2. Find users whose subscription renews in exactly 3 days
    // We'll look for active subscriptions where renewal date is 3 days from now
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const dateString = threeDaysFromNow.toISOString().split('T')[0];

    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('email, subscription_renewal_date')
      .eq('subscription_status', 'active')
      .gte('subscription_renewal_date', `${dateString}T00:00:00`)
      .lte('subscription_renewal_date', `${dateString}T23:59:59`);

    if (error) throw error;

    // 3. Send emails
    const results = await Promise.allSettled(
      (users || []).map(user => 
        sendRenewalReminderEmail(user.email, new Date(user.subscription_renewal_date).toLocaleDateString())
      )
    );

    const successCount = results.filter(r => r.status === 'fulfilled').length;

    return NextResponse.json({ 
      processed: users?.length || 0,
      success: successCount 
    });

  } catch (err: any) {
    console.error('[cron_renewal_reminders] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
