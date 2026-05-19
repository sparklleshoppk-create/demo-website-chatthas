import { createClient } from '@/utils/supabase/server';
import OrdersTable from './OrdersTable';

export default async function OrdersPage() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('*, branches(name)')
    .order('created_at', { ascending: false })
    .limit(100);

  const allOrders = orders || [];
  
  // Status counts for dashboard strip
  const pending = allOrders.filter(o => o.status === 'pending').length;
  const preparing = allOrders.filter(o => o.status === 'preparing').length;
  const ready = allOrders.filter(o => o.status === 'ready').length;
  const delivered = allOrders.filter(o => o.status === 'delivered').length;

  return (
    <div className="space-y-8">
      {/* Status Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-charcoal border border-dark-border rounded-sm p-5 card-lift">
          <p className="text-sm font-bold tracking-widest uppercase text-amber-400 mb-1">Pending</p>
          <p className="text-sm font-display font-light text-cream">{pending}</p>
        </div>
        <div className="bg-charcoal border border-dark-border rounded-sm p-5 card-lift">
          <p className="text-sm font-bold tracking-widest uppercase text-orange-400 mb-1">Preparing</p>
          <p className="text-sm font-display font-light text-cream">{preparing}</p>
        </div>
        <div className="bg-charcoal border border-dark-border rounded-sm p-5 card-lift">
          <p className="text-sm font-bold tracking-widest uppercase text-cyan-400 mb-1">Ready</p>
          <p className="text-sm font-display font-light text-cream">{ready}</p>
        </div>
        <div className="bg-charcoal border border-dark-border rounded-sm p-5 card-lift">
          <p className="text-sm font-bold tracking-widest uppercase text-green-400 mb-1">Delivered</p>
          <p className="text-sm font-display font-light text-cream">{delivered}</p>
        </div>
      </div>

      <OrdersTable orders={allOrders} />
    </div>
  );
}
