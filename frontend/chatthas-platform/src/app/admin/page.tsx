import { createClient } from '@/utils/supabase/server';
import { FaShoppingBag, FaUtensils, FaStore, FaUsers, FaChartLine, FaArrowUp } from 'react-icons/fa';
import Link from 'next/link';

async function getStats() {
  const supabase = createClient();
  
  const [
    { count: totalOrders },
    { count: totalMenuItems },
    { count: totalBranches },
    { count: totalCustomers },
    { data: recentOrders },
    { data: featuredItems },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('menu_items').select('*', { count: 'exact', head: true }).eq('is_available', true),
    supabase.from('branches').select('*', { count: 'exact', head: true }),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(8),
    supabase.from('menu_items')
      .select('*, categories(name)')
      .eq('is_featured', true)
      .limit(6),
  ]);

  // Revenue calculation
  const { data: deliveredOrders } = await supabase
    .from('orders')
    .select('total')
    .eq('status', 'delivered');
  
  const totalRevenue = deliveredOrders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;

  // Pending count
  const { count: pendingCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  return { totalOrders, totalMenuItems, totalBranches, totalCustomers, recentOrders, featuredItems, totalRevenue, pendingCount };
}

export default async function AdminDashboard() {
  const { totalOrders, totalMenuItems, totalBranches, totalCustomers, recentOrders, featuredItems, totalRevenue, pendingCount } = await getStats();

  const statusColors: Record<string, string> = {
    pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    confirmed: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    preparing: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    ready: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    out_for_delivery: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    delivered: 'text-green-400 bg-green-500/10 border-green-500/20',
    cancelled: 'text-ember-400 bg-ember-500/10 border-ember-500/20',
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-sm font-display font-light italic gold-text">Commerce Dashboard</h2>
          <p className="text-base tracking-widest uppercase text-cream/40 mt-2">Live operational intelligence</p>
        </div>
        {(pendingCount ?? 0) > 0 && (
          <Link href="/admin/orders" className="btn-gold flex items-center gap-2 animate-pulse">
            ⏳ {pendingCount} Pending Orders
          </Link>
        )}
      </div>

      {/* Revenue + Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Revenue — Double Width */}
        <div className="sm:col-span-2 lg:col-span-1 bg-charcoal rounded-sm border border-gold-500/20 p-6 card-lift">
          <div className="flex items-center gap-2 mb-3">
            <FaChartLine className="text-gold-500" size={12} />
            <p className="text-sm font-bold tracking-widest uppercase text-gold-500">Revenue</p>
          </div>
          <p className="text-sm font-display font-light text-cream">Rs. {totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-cream/30 mt-1 tracking-widest uppercase">From delivered orders</p>
        </div>

        <div className="bg-charcoal rounded-sm border border-dark-border p-6 card-lift">
          <div className="flex items-center gap-2 mb-3">
            <FaShoppingBag className="text-gold-500" size={12} />
            <p className="text-sm font-bold tracking-widest uppercase text-cream/40">Orders</p>
          </div>
          <p className="text-sm font-display font-light text-cream">{(totalOrders ?? 0).toLocaleString()}</p>
        </div>

        <div className="bg-charcoal rounded-sm border border-dark-border p-6 card-lift">
          <div className="flex items-center gap-2 mb-3">
            <FaUtensils className="text-gold-500" size={12} />
            <p className="text-sm font-bold tracking-widest uppercase text-cream/40">Menu Items</p>
          </div>
          <p className="text-sm font-display font-light text-cream">{(totalMenuItems ?? 0).toLocaleString()}</p>
        </div>

        <div className="bg-charcoal rounded-sm border border-dark-border p-6 card-lift">
          <div className="flex items-center gap-2 mb-3">
            <FaStore className="text-gold-500" size={12} />
            <p className="text-sm font-bold tracking-widest uppercase text-cream/40">Branches</p>
          </div>
          <p className="text-sm font-display font-light text-cream">{(totalBranches ?? 0).toLocaleString()}</p>
        </div>

        <div className="bg-charcoal rounded-sm border border-dark-border p-6 card-lift">
          <div className="flex items-center gap-2 mb-3">
            <FaUsers className="text-gold-500" size={12} />
            <p className="text-sm font-bold tracking-widest uppercase text-cream/40">Customers</p>
          </div>
          <p className="text-sm font-display font-light text-cream">{(totalCustomers ?? 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Feed */}
        <div className="bg-charcoal rounded-sm border border-dark-border shadow-card overflow-hidden card-lift">
          <div className="px-6 py-4 border-b border-dark-border bg-primary-black flex items-center justify-between">
            <h3 className="text-base font-bold tracking-widest uppercase text-cream/60">Recent Orders</h3>
            <span className="text-sm font-bold tracking-widest uppercase text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live
            </span>
          </div>
          <div className="divide-y divide-dark-border">
            {(!recentOrders || recentOrders.length === 0) ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm font-display font-light italic gold-text mb-1">No Orders Yet</p>
                <p className="text-sm tracking-widest uppercase text-cream/30">They will appear here in real time</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-primary-black/20 transition-colors">
                  <div>
                    <p className="text-sm font-display font-bold text-cream">{order.order_number}</p>
                    <p className="text-sm text-cream/30 tracking-widest uppercase">{new Date(order.created_at).toLocaleString('en-US', { timeZone: 'Asia/Karachi', dateStyle: 'medium', timeStyle: 'short' })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gold-500">Rs. {Number(order.total).toLocaleString()}</span>
                    <span className={`text-sm font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm border ${statusColors[order.status] || 'text-cream/50 bg-dark-border border-dark-border'}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link href="/admin/orders" className="block px-6 py-3 bg-primary-black text-center text-sm font-bold tracking-widest uppercase text-gold-500 hover:bg-gold-500/5 transition-colors border-t border-dark-border">
            View All Orders →
          </Link>
        </div>

        {/* Featured Menu Items */}
        <div className="bg-charcoal rounded-sm border border-dark-border shadow-card overflow-hidden card-lift">
          <div className="px-6 py-4 border-b border-dark-border bg-primary-black flex items-center justify-between">
            <h3 className="text-base font-bold tracking-widest uppercase text-cream/60">Featured Items</h3>
            <span className="text-sm font-bold tracking-widest uppercase text-gold-500 px-2 py-0.5 bg-gold-500/10 border border-gold-500/20 rounded-sm">
              {totalMenuItems} Total
            </span>
          </div>
          <div className="divide-y divide-dark-border">
            {(!featuredItems || featuredItems.length === 0) ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm font-display font-light italic gold-text mb-1">No Featured Items</p>
                <p className="text-sm tracking-widest uppercase text-cream/30">Mark items as featured in the Menu section</p>
              </div>
            ) : (
              featuredItems.map((item) => (
                <div key={item.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-primary-black/20 transition-colors">
                  <div>
                    <p className="text-sm font-display font-bold text-cream">{item.name}</p>
                    <p className="text-sm text-cream/30 tracking-widest uppercase">{(item as any).categories?.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gold-500">Rs. {Number(item.price).toLocaleString()}</span>
                    {item.badge && (
                      <span className="text-sm font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm bg-gold-500/10 text-gold-500 border border-gold-500/20">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <Link href="/admin/menu" className="block px-6 py-3 bg-primary-black text-center text-sm font-bold tracking-widest uppercase text-gold-500 hover:bg-gold-500/5 transition-colors border-t border-dark-border">
            Manage Menu →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-charcoal rounded-sm border border-dark-border p-8 shadow-card card-lift">
        <h3 className="text-base font-bold tracking-widest uppercase text-cream/40 mb-5">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/menu/new" className="btn-gold"><FaArrowUp size={12} /> Add Menu Item</Link>
          <Link href="/admin/branches" className="btn-outline-gold">Manage Branches</Link>
          <Link href="/admin/orders" className="btn-outline-gold">View Orders</Link>
          <Link href="/admin/settings" className="btn-outline-gold">Platform Settings</Link>
          <Link href="/admin/promos" className="btn-outline-gold">Promo Codes</Link>
        </div>
      </div>
    </div>
  );
}
