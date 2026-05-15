'use server';

import Stripe from 'stripe';

import { createClient } from '@/utils/supabase/server';

export async function createStripePaymentIntent(orderId: string, amount: number) {
  const supabase = createClient();
  
  // 1. Get Secret Key from Settings
  const { data: stripeSecret } = await supabase
    .from('website_settings')
    .select('value')
    .eq('key', 'stripe_secret_key')
    .single();

  if (!stripeSecret?.value) {
    throw new Error('Stripe is not configured in settings.');
  }

  const stripe = new Stripe(stripeSecret.value, {
    apiVersion: '2024-04-10' as any,
  });

  // 2. Create Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Stripe expects amount in cents/paisa
    currency: 'pkr',
    metadata: { orderId },
    automatic_payment_methods: { enabled: true },
  });

  // 3. Update Order with Payment Intent ID
  await supabase
    .from('orders')
    .update({ 
      payment_reference: paymentIntent.id,
      payment_method: 'stripe'
    })
    .eq('id', orderId);

  return { clientSecret: paymentIntent.client_secret };
}

export async function verifyStripePayment(paymentIntentId: string) {
  const supabase = createClient();
  
  const { data: stripeSecret } = await supabase
    .from('website_settings')
    .select('value')
    .eq('key', 'stripe_secret_key')
    .single();

  if (!stripeSecret?.value) throw new Error('Stripe not configured');

  const stripe = new Stripe(stripeSecret.value, {
    apiVersion: '2024-04-10' as any,
  });

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === 'succeeded') {
    // Update order status
    await supabase
      .from('orders')
      .update({ payment_status: 'paid' })
      .eq('payment_reference', paymentIntentId);
    
    return { success: true };
  }

  return { success: false, status: paymentIntent.status };
}
