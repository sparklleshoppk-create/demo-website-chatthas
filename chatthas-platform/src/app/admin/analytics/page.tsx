import { createClient } from '@/utils/supabase/server';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsPage() {
  const supabase = createClient();
  
  // Fetch last 30 days of orders
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { data: orders } = await supabase
    .from('orders')
    .select('created_at, total, status')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-cream tracking-tight">Business <span className="gold-text italic">Intelligence</span></h2>
        <p className="text-sm text-cream/50 mt-1">Real-time performance analytics and trends.</p>
      </div>

      <AnalyticsClient initialOrders={orders || []} />
    </div>
  );
}
