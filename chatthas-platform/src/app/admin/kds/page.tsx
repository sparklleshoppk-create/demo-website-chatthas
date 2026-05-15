import { createClient } from '@/utils/supabase/server';
import KDSClient from './KDSClient';

export default async function KDSPage() {
  const supabase = createClient();
  
  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .in('status', ['confirmed', 'preparing', 'ready'])
    .order('created_at', { ascending: true });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold text-cream tracking-tight">Kitchen <span className="gold-text italic">Display</span></h2>
          <p className="text-sm text-cream/50 mt-1">Live view of orders currently in preparation.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
           <span className="text-[10px] font-black text-cream/40 uppercase tracking-[0.2em]">Live Connection</span>
        </div>
      </div>

      <KDSClient initialOrders={orders || []} />
    </div>
  );
}
