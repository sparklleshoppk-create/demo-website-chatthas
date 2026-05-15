import { createClient } from '@/utils/supabase/server';

export default async function CustomersPage() {
  const supabase = createClient();
  const { data: customers } = await supabase
    .from('customers')
    .select('*, users(email, full_name, phone)')
    .order('total_spent', { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-cream">Customers</h2>
          <p className="text-sm text-cream/50 mt-1">View and manage your customer base</p>
        </div>
      </div>

      <div className="bg-dark-card rounded-sm border border-dark-border shadow-card overflow-hidden">
        <table className="min-w-full divide-y divide-dark-border">
          <thead className="bg-charcoal">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream/50 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream/50 uppercase tracking-wider">Tier</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream/50 uppercase tracking-wider">Total Orders</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream/50 uppercase tracking-wider">Total Spent</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream/50 uppercase tracking-wider">Last Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {(!customers || customers.length === 0) ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-cream/40 text-sm">
                  No customers yet. Customer profiles will appear here as orders are placed.
                </td>
              </tr>
            ) : (
              customers.map((c) => {
                const tierColors: Record<string, string> = {
                  standard: 'text-cream/50 bg-dark-border border-dark-border',
                  silver: 'text-gray-300 bg-gray-500/10 border-gray-500/20',
                  gold: 'text-gold-400 bg-gold-500/10 border-gold-500/20',
                  platinum: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
                };
                return (
                  <tr key={c.id} className="hover:bg-dark-border/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-cream">{(c as any).users?.full_name || 'Unknown'}</p>
                      <p className="text-xs text-cream/40">{(c as any).users?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded border capitalize ${tierColors[c.customer_tier] || tierColors.standard}`}>
                        {c.customer_tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-cream/70">{c.total_orders}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gold-400">Rs. {Number(c.total_spent).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-cream/50">
                      {c.last_order_at ? new Date(c.last_order_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
