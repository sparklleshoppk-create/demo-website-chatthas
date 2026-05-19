import { createClient } from '@/utils/supabase/server';

export default async function CustomersPage() {
  const supabase = createClient();
  const { data: customers } = await supabase
    .from('customers')
    .select('*, users(email, full_name, phone)')
    .order('total_spent', { ascending: false })
    .limit(50);

  const tierColors: Record<string, string> = {
    standard: 'text-cream/50 bg-dark-border/50 border-dark-border',
    silver: 'text-gray-300 bg-gray-500/10 border-gray-500/20',
    gold: 'text-gold-500 bg-gold-500/10 border-gold-500/20',
    platinum: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className="space-y-8">
      <div className="bg-charcoal rounded-sm border border-dark-border shadow-card overflow-hidden card-lift">
        <table className="min-w-full divide-y divide-dark-border">
          <thead className="bg-primary-black">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-cream/40 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-cream/40 uppercase tracking-widest">Tier</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-cream/40 uppercase tracking-widest">Orders</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-cream/40 uppercase tracking-widest">Lifetime Value</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-cream/40 uppercase tracking-widest">Last Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border bg-charcoal">
            {(!customers || customers.length === 0) ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <p className="text-sm font-display font-light italic gold-text mb-1">No Customers Yet</p>
                  <p className="text-sm tracking-widest uppercase text-cream/30">Customer profiles appear as orders are placed</p>
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-primary-black/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-display font-bold text-cream">{(c as any).users?.full_name || 'Unknown'}</p>
                    <p className="text-sm text-cream/30 tracking-widest">{(c as any).users?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold tracking-widest uppercase px-2 py-1 rounded-sm border ${tierColors[c.customer_tier] || tierColors.standard}`}>
                      {c.customer_tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-cream">{c.total_orders}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gold-500">Rs. {Number(c.total_spent).toLocaleString()}</td>
                  <td className="px-6 py-4 text-base text-cream/50">
                    {c.last_order_at ? new Date(c.last_order_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
