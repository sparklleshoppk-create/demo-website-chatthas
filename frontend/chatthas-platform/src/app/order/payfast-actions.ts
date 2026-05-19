'use server';

import CryptoJS from 'crypto-js';

import { createClient } from '@/utils/supabase/server';

/**
 * PayFast (Pakistan) Integration
 * Supports Visa, Mastercard, JazzCash, EasyPaisa, etc.
 */

export async function generatePayFastRequest(orderId: string, amount: number, customer: any) {
  const supabase = createClient();

  // 1. Get credentials from settings
  const { data: settings } = await supabase
    .from('website_settings')
    .select('key, value')
    .in('key', ['payfast_merchant_id', 'payfast_secured_key', 'payfast_mode']);

  const config = settings?.reduce((acc: any, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {}) || {};

  // Default to empty strings if not configured to avoid crashes
  const merchantId = config.payfast_merchant_id || '';
  const securedKey = config.payfast_secured_key || '';
  const isSandbox = config.payfast_mode !== 'live';

  const baseUrl = isSandbox 
    ? 'https://sandbox.payfast.co/pay' 
    : 'https://ipg1.payfast.co/pay';

  // 2. Prepare payload for PayFast IPG
  // Fields based on PayFast Pakistan standard integration
  const payload: any = {
    merchant_id: merchantId,
    secured_key: securedKey,
    merchant_payment_id: orderId,
    amount: amount.toFixed(2),
    currency_code: 'PKR',
    order_id: orderId,
    item_name: `Order #${orderId}`,
    customer_name: customer.name || 'Valued Customer',
    customer_email: customer.email || 'customer@chatthas.pk',
    customer_mobile: customer.phone || '',
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order/callback?orderId=${orderId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order?error=cancelled`,
    notify_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/payfast-webhook`,
  };

  return {
    url: baseUrl,
    params: payload
  };
}


export async function createSafepayCheckout(orderId: string, amount: number) {
  const supabase = createClient();
  
  const { data: apiKey } = await supabase
    .from('website_settings')
    .select('value')
    .eq('key', 'safepay_api_key')
    .single();

  const isSandbox = true; // Hardcoded for demo, move to settings
  const baseUrl = isSandbox ? 'https://sandbox.api.getsafepay.com' : 'https://api.getsafepay.com';

  const response = await fetch(`${baseUrl}/checkout/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: amount,
      currency: 'PKR',
      merchant_api_key: apiKey?.value,
      intent: 'CYBERSOURCE',
      reference: orderId
    })
  });

  const data = await response.json();
  return data;
}
