import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oswimqzfbikzufckvhby.supabase.co';
const supabaseKey = 'sb_publishable_-WFpyqUojnTAl4TRGqhZRA_w2fgWx3j';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  // Fetch a single order to see its keys/columns
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  if (data && data.length > 0) {
    console.log('Order Columns:', Object.keys(data[0]));
    console.log('Full Order Sample:', data[0]);
  } else {
    console.log('No orders found or error:', error);
  }
}
check();
