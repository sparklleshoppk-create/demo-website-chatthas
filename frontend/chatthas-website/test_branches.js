import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oswimqzfbikzufckvhby.supabase.co';
const supabaseKey = 'sb_publishable_-WFpyqUojnTAl4TRGqhZRA_w2fgWx3j';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('branches').select('*');
  console.log('Branches:', data);
  console.log('Error:', error);
}
check();
