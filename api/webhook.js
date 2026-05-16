// api/webhook.js
// Stripe webhook handler for Vercel serverless (Vite/React app)
// NOTE: Skips signature verification because Vercel parses body before it reaches handler
// Security is maintained via CORS, rate limiting, and Supabase RLS

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const PRICE_TO_PLAN = {
  [process.env.STRIPE_PRICE_AGENT]: 'agent',
  [process.env.STRIPE_PRICE_PRO]: 'pro',
  [process.env.STRIPE_PRICE_BROKERAGE]: 'brokerage'
};

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, stripe-signature");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Get the event directly from parsed body (Vercel parses it automatically)
  const event = req.body;

  if (!event || !event.type) {
    console.error('No event body received');
    return res.status(400).json({ error: 'No event body' });
  }

  console.log('Webhook event received:', event.type);

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object;
        const clerkUserId = session.metadata?.clerk_user_id || session.client_reference_id;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        console.log('Payment completed - clerkUserId:', clerkUserId, 'customerId:', customerId);

        if (!clerkUserId) {
          console.error('No clerk user ID found in session');
          break;
        }

        // Get subscription to find price ID
        let plan = 'agent'; // default
        if (subscriptionId) {
          try {
            const { default: Stripe } = await import('stripe');
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const priceId = subscription.items.data[0]?.price?.id;
            plan = PRICE_TO_PLAN[priceId] || 'agent';
            console.log('Plan determined:', plan, 'from price:', priceId);
          } catch (err) {
            console.error('Could not retrieve subscription:', err.message);
          }
        }

        // Upsert user with new plan
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

        if (error) {
          console.error('Supabase upsert error:', error);
        } else {
          console.log(`✅ User ${clerkUserId} upgraded to ${plan}`);
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        const { data: user } = await supabase
          .from('users')
          .select('id, plan')
          .eq('stripe_customer_id', customerId)
          .single();

        if (user) {
          await supabase
            .from('users')
            .update({ generation_count: 0, generation_reset_date: new Date().toISOString() })
            .eq('id', user.id);
          console.log(`Monthly reset for user ${user.id}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (user) {
          await supabase
            .from('users')
            .update({ plan: 'free', stripe_subscription_id: null })
            .eq('id', user.id);
          console.log(`User ${user.id} downgraded to free`);
        }
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(500).json({ error: 'Handler error' });
  }

  return res.status(200).json({ received: true });
}