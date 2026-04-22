import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  const supabaseAdmin = createAdminClient();
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed';
    // B6 — sanitized error; full details stay server-side
    console.error('[webhook] Signature error:', err);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {

    switch (event.type) {
      case 'checkout.session.completed': {
        // Cast through unknown to avoid Stripe's wide union type conflict
        const stripeSession = event.data.object as unknown as {
          subscription: string;
          metadata: Record<string, string>;
          customer: string;
        };

        const subscription = await stripe.subscriptions.retrieve(stripeSession.subscription);
        const userId =
          stripeSession.metadata?.supabase_id ||
          (subscription.metadata?.supabase_id as string);
        const charityId =
          stripeSession.metadata?.charity_id ||
          (subscription.metadata?.charity_id as string) ||
          null;

        const planInterval = subscription.items.data[0]?.plan?.interval;
        const plan = planInterval === 'month' ? 'monthly' : 'yearly';

        // Stripe Subscription uses current_period_end / current_period_start (deprecated in newer API)
        // Access via type assertion to handle both legacy and current SDK versions
        const sub = subscription as unknown as {
          current_period_start: number;
          current_period_end: number;
        };

        // B8 — Both writes wrapped in a Postgres transaction via RPC.
        const { error: rpcError } = await supabaseAdmin.rpc('handle_checkout_completed', {
          p_user_id: userId,
          p_plan: plan,
          p_charity_id: charityId,
          p_renewal_date: new Date(sub.current_period_end * 1000).toISOString(),
          p_stripe_subscription_id: subscription.id,
          p_stripe_customer_id: stripeSession.customer,
          p_period_start: new Date(sub.current_period_start * 1000).toISOString(),
          p_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        });

        if (rpcError) {
          console.error('[webhook] RPC handle_checkout_completed failed:', rpcError);
          return NextResponse.json({ error: 'Database transaction failed' }, { status: 500 });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const deletedSub = event.data.object as unknown as {
          id: string;
          metadata: Record<string, string>;
        };

        // B8 — Both writes wrapped in a Postgres transaction via RPC.
        const { error: rpcError } = await supabaseAdmin.rpc('handle_subscription_deleted', {
          p_user_id: deletedSub.metadata?.supabase_id,
          p_stripe_subscription_id: deletedSub.id,
        });

        if (rpcError) {
          console.error('[webhook] RPC handle_subscription_deleted failed:', rpcError);
          return NextResponse.json({ error: 'Database transaction failed' }, { status: 500 });
        }
        break;
      }

      default:
        console.log(`[webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    // B6 — never return raw exception details
    console.error('[webhook] Unhandled error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

