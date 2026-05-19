
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oswimqzfbikzufckvhby.supabase.co';
const supabaseKey = 'sb_publishable_-WFpyqUojnTAl4TRGqhZRA_w2fgWx3j';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const { data, error } = await supabase.from('contact_messages').insert({
    name: 'Anon Test',
    phone: '1234567890',
    email: 'anon@test.com',
    message: '[general] Hello from anon test'
  }).select();

  if (error) {
    console.error('Error inserting into contact_messages:', error);
  } else {
    console.log('Successfully inserted into contact_messages. Data:', data);
  }
}

testInsert();
