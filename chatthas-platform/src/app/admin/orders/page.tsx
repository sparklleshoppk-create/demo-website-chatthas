import { createClient } from '@/utils/supabase/server';
import OrdersTable from './OrdersTable';

export default async function OrdersPage() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-cream">Orders</h2>
          <p className="text-sm text-cream/50 mt-1">Manage and track all customer orders — {orders?.length || 0} total</p>
        </div>
      </div>

      <OrdersTable orders={orders || []} />
    </div>
  );
}
