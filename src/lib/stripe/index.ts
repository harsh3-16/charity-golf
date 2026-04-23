import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      // Don't throw at build time, only when actually trying to use Stripe
      // Next.js static evaluation will evaluate this file, but only functions that are called will run.
      // If we throw here, we should ensure it only happens at runtime.
      console.warn('STRIPE_SECRET_KEY is not defined');
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
      typescript: true,
    });
  }
  return stripeClient;
}
