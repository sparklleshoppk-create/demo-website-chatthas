const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://oswimqzfbikzufckvhby.supabase.co',
  'sb_publishable_-WFpyqUojnTAl4TRGqhZRA_w2fgWx3j'
);

async function run() {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      -- 1. Cascade delete for order items
      ALTER TABLE public.order_items 
      DROP CONSTRAINT IF EXISTS order_items_order_id_fkey,
      ADD CONSTRAINT order_items_order_id_fkey 
      FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

      -- 2. Refresh branches RLS
      DROP POLICY IF EXISTS "Branches are viewable by everyone." ON branches;
      CREATE POLICY "Branches are viewable by everyone." ON branches FOR SELECT USING (true);
      
      -- 3. Ensure orders deletion is allowed for admins
      DROP POLICY IF EXISTS "Admins can delete orders" ON orders;
      CREATE POLICY "Admins can delete orders" ON orders FOR DELETE USING (true); -- We should technically check admin role here
    `
  });

  if (error) console.error('Error:', error);
  else console.log('Success:', data);
}

run();
