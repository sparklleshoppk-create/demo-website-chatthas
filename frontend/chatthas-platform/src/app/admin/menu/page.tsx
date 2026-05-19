import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { seedDatabase } from './actions';
import MenuTable from './MenuTable';

export default async function MenuPage() {
  const supabase = createClient();
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*, categories(name)')
    .order('sort_order', { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-display font-bold text-cream">Menu Items</h2>
          <p className="text-sm text-cream/50 mt-1">Manage your restaurant menu — {menuItems?.length || 0} items total</p>
        </div>
        <div className="flex items-center gap-4">
          <form action={seedDatabase}>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-bold border border-gold-500/30 text-gold-500 rounded-sm hover:bg-gold-500/10 transition-colors"
            >
              Seed Data (One-time)
            </button>
          </form>
          <Link
            href="/admin/menu/new"
            target="_self"
            className="px-4 py-2 text-sm font-bold bg-gold-500 text-charcoal rounded-sm hover:bg-gold-400 transition-colors"
          >
            + Add Item
          </Link>
        </div>
      </div>

      <MenuTable menuItems={menuItems || []} />
    </div>
  );
}
