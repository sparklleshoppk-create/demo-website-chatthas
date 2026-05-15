import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oswimqzfbikzufckvhby.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-WFpyqUojnTAl4TRGqhZRA_w2fgWx3j';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  console.log("Testing order insert...");
  const orderNumber = `CH-${Math.floor(100000 + Math.random() * 900000)}`;
  
  const payload = {
    order_number: orderNumber,
    delivery_address: "Test Address",
    customer_notes: `Phone: 1234567 | Name: Test User`,
    total: 500,
    subtotal: 500,
    delivery_fee: 0,
    discount_amount: 0,
    promo_code: null,
    tax_amount: 0,
    delivery_instructions: null,
    status: 'pending',
    type: 'delivery',
    payment_method: 'cod',
    payment_status: 'pending'
  };

  const { data, error } = await supabase
    .from('orders')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("ERROR INSERTING ORDER:", error);
  } else {
    console.log("SUCCESS INSERTING ORDER:", data);
  }
}

test();
