import { createClient } from '@/utils/supabase/server';
import { FaPlus, FaTrash, FaTag } from 'react-icons/fa';
import { createPromo, deletePromo } from './actions';

export default async function PromosPage() {
  const supabase = createClient();
  const { data: promos } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-gold-500">Promo Codes</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Promo Form */}
        <div className="lg:col-span-1">
          <form action={createPromo} className="bg-dark-card p-6 border border-dark-border rounded-sm space-y-4">
            <h3 className="text-lg font-display font-bold text-cream mb-4">Create Promo</h3>
            <div>
              <label className="block text-xs font-bold text-cream/40 uppercase mb-1">Code</label>
              <input name="code" placeholder="SAVE20" className="admin-input uppercase" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-cream/40 uppercase mb-1">Type</label>
                <select name="discount_type" className="admin-input">
                  <option value="percentage">% Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-cream/40 uppercase mb-1">Value</label>
                <input name="discount_value" type="number" placeholder="20" className="admin-input" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-cream/40 uppercase mb-1">Min Order</label>
              <input name="min_order_amount" type="number" placeholder="1000" className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-cream/40 uppercase mb-1">Expiry Date</label>
              <input name="expires_at" type="date" className="admin-input" />
            </div>
            <button type="submit" className="btn-gold w-full py-3">Create Promo Code</button>
          </form>
        </div>

        {/* Promo List */}
        <div className="lg:col-span-2">
          <div className="bg-dark-card border border-dark-border rounded-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-charcoal text-xs font-bold text-cream/40 uppercase tracking-wider">
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Usage</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {promos?.map(promo => (
                  <tr key={promo.id} className="text-sm">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaTag className="text-gold-500" size={12} />
                        <span className="font-mono font-bold text-cream">{promo.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gold-400 font-bold">
                      {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `Rs. ${promo.discount_value}`}
                    </td>
                    <td className="px-6 py-4 text-cream/40">{promo.usage_count || 0} used</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${promo.is_active ? 'bg-green-500/10 text-green-400' : 'bg-ember-500/10 text-ember-400'}`}>
                        {promo.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={async () => { 'use server'; await deletePromo(promo.id); }}>
                        <button type="submit" className="text-cream/20 hover:text-ember-400 transition-colors">
                          <FaTrash size={14} />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
