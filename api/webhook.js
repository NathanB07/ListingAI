// api/webhook.js
// Stripe webhook handler - lives at /api/webhook
// Listens for payment events and updates user plan in Supabase

import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Map Stripe price IDs to plan names
// YOU MUST UPDATE THESE WITH YOUR ACTUAL STRIPE PRICE IDs
const PRICE_TO_PLAN = {
  [process.env.STRIPE_PRICE_AGENT]: 'agent',       // $59/mo
  [process.env.STRIPE_PRICE_PRO]: 'pro',            // $99/mo  
  [process.env.STRIPE_PRICE_BROKERAGE]: 'brokerage' // $149/mo
};

export const config = {
  api: { bodyParser: false } // Required for Stripe webhook signature verification
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody = await getRawBody(req);
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  console.log('Webhook event received:', event.type);

  switch (event.type) {

    // ── Customer subscribed (new payment) ──────────────────────────────────
    case 'checkout.session.completed': {
      const session = event.data.object;
      const clerkUserId = session.metadata?.clerk_user_id;
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      if (!clerkUserId) {
        console.error('No clerk_user_id in session metadata');
        break;
      }

      // Get subscription to find price ID
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0]?.price?.id;
      const plan = PRICE_TO_PLAN[priceId] || 'agent';

      // Upsert user record with new plan
      const { error } = await supabase
        .from('users')
        .upsert({
          id: clerkUserId,
          plan,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          generation_count: 0,
          generation_reset_date: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) console.error('Supabase upsert error:', error);
      else console.log(`User ${clerkUserId} upgraded to ${plan}`);
      break;
    }

    // ── Subscription renewed (monthly) ─────────────────────────────────────
    case 'invoice.paid': {
      const invoice = event.data.object;
      const customerId = invoice.customer;

      // Find user by Stripe customer ID
      const { data: user, error } = await supabase
        .from('users')
        .select('id, plan')
        .eq('stripe_customer_id', customerId)
        .single();

      if (error || !user) break;

      // Reset monthly generation count
      await supabase
        .from('users')
        .update({
          generation_count: 0,
          generation_reset_date: new Date().toISOString()
        })
        .eq('id', user.id);

      console.log(`Monthly reset for user ${user.id}`);
      break;
    }

    // ── Subscription cancelled ──────────────────────────────────────────────
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

      if (!user) break;

      // Downgrade to free
      await supabase
        .from('users')
        .update({ plan: 'free', stripe_subscription_id: null })
        .eq('id', user.id);

      console.log(`User ${user.id} downgraded to free`);
      break;
    }

    // ── Payment failed ──────────────────────────────────────────────────────
    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      // Log it — after 7 days Stripe will cancel the subscription
      // which triggers customer.subscription.deleted above
      console.log('Payment failed for customer:', invoice.customer);
      break;
    }

    default:
      console.log('Unhandled event type:', event.type);
  }

  res.status(200).json({ received: true });
}
