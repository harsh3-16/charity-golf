import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get the latest active subscription for the user
    const { data: sub, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError || !sub?.stripe_subscription_id) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    const stripe = getStripe();

    // 2. Cancel the subscription in Stripe
    // We'll set it to cancel at the end of the period
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // 3. Update status in our database
    const { error: updateError } = await supabase
      .from('users')
      .update({ subscription_status: 'inactive' }) // Or 'pending_cancellation' if you want to be precise
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ message: 'Subscription cancelled successfully' });
  } catch (err: any) {
    console.error('[sub_cancel] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
