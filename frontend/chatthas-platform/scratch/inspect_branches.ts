import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable() {
  const { data, error } = await supabase.from('branches').select('*').limit(1);
  if (error) {
    console.error('Error fetching branches:', error);
  } else {
    console.log('Columns found:', Object.keys(data[0] || {}));
  }
}

inspectTable();
