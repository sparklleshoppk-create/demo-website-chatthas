import { createClient } from '@/utils/supabase/server';
import { FaTrash, FaTag } from 'react-icons/fa';
import { deletePromo } from './actions';
import PromoFormClient from './PromoFormClient';

export default async function PromosPage() {
  const supabase = createClient();
  const { data: promos } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Promo Form */}
        <div className="lg:col-span-1">
          <PromoFormClient />
        </div>

        {/* Promo List */}
        <div className="lg:col-span-2">
          <div className="bg-charcoal border border-dark-border rounded-sm overflow-hidden shadow-card card-lift">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary-black text-sm font-bold text-cream/40 uppercase tracking-widest">
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Usage</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {promos?.map(promo => (
                  <tr key={promo.id} className="hover:bg-primary-black/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaTag className="text-gold-500" size={14} />
                        <span className="font-mono font-bold text-cream tracking-wider">{promo.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gold-500 font-bold text-sm">
                      {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `Rs. ${promo.discount_value}`}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold tracking-widest uppercase text-cream/40">{promo.usage_count || 0} used</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-sm text-sm font-bold tracking-widest uppercase border ${promo.is_active ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-ember-500/10 text-ember-500 border-ember-500/20'}`}>
                        {promo.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={async () => { 'use server'; await deletePromo(promo.id); }}>
                        <button type="submit" className="p-2 text-cream/20 hover:text-ember-500 hover:bg-ember-500/10 rounded-sm transition-colors">
                          <FaTrash size={12} />
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
