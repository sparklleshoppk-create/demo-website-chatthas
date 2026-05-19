const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oswimqzfbikzufckvhby.supabase.co';
const supabaseKey = 'sb_publishable_-WFpyqUojnTAl4TRGqhZRA_w2fgWx3j';
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
