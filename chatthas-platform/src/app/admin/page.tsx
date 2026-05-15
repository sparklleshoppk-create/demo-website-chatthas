import { createClient } from '@/utils/supabase/server';
import { FaShoppingBag, FaUtensils, FaStore, FaUsers } from 'react-icons/fa';

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
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('menu_items')
      .select('*, categories(name)')
      .eq('is_featured', true)
      .limit(6),
  ]);

  return { totalOrders, totalMenuItems, totalBranches, totalCustomers, recentOrders, featuredItems };
}

export default async function AdminDashboard() {
  const { totalOrders, totalMenuItems, totalBranches, totalCustomers, recentOrders, featuredItems } = await getStats();

  const stats = [
    { 
      label: 'Total Orders', 
      value: totalOrders ?? 0, 
      icon: FaShoppingBag, 
      color: 'text-gold-400',
      bg: 'bg-gold-500/10',
      border: 'border-gold-500/20',
    },
    { 
      label: 'Menu Items', 
      value: totalMenuItems ?? 0, 
      icon: FaUtensils, 
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    { 
      label: 'Active Branches', 
      value: totalBranches ?? 0, 
      icon: FaStore, 
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    { 
      label: 'Total Customers', 
      value: totalCustomers ?? 0, 
      icon: FaUsers, 
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
  ];

  const statusColors: Record<string, string> = {
    pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    confirmed: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    preparing: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    delivered: 'text-green-400 bg-green-500/10 border-green-500/20',
    cancelled: 'text-ember-400 bg-ember-500/10 border-ember-500/20',
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-display font-bold text-cream">Dashboard Overview</h2>
        <p className="text-sm text-cream/50 mt-1">Live data from your Supabase database</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-dark-card rounded-sm border ${stat.border} p-6 flex items-center gap-5 shadow-card`}
          >
            <div className={`p-3 rounded-sm ${stat.bg} border ${stat.border}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-3xl font-bold font-display text-cream">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-cream/50 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-dark-card rounded-sm border border-dark-border shadow-card">
          <div className="px-6 py-4 border-b border-dark-border flex items-center justify-between">
            <h3 className="font-display font-bold text-cream">Recent Orders</h3>
            <span className="text-xs text-cream/40 bg-dark-border px-2 py-1 rounded">Live</span>
          </div>
          <div className="divide-y divide-dark-border">
            {(!recentOrders || recentOrders.length === 0) ? (
              <div className="px-6 py-8 text-center text-cream/40 text-sm">
                No orders yet. They will appear here in real time.
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cream">{order.order_number}</p>
                    <p className="text-xs text-cream/50">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gold-400">Rs. {order.total}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border capitalize ${statusColors[order.status] || 'text-cream/50 bg-dark-border border-dark-border'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Featured Menu Items */}
        <div className="bg-dark-card rounded-sm border border-dark-border shadow-card">
          <div className="px-6 py-4 border-b border-dark-border flex items-center justify-between">
            <h3 className="font-display font-bold text-cream">Featured Menu Items</h3>
            <span className="text-xs text-gold-400 bg-gold-500/10 border border-gold-500/20 px-2 py-1 rounded">{totalMenuItems} Total</span>
          </div>
          <div className="divide-y divide-dark-border">
            {(!featuredItems || featuredItems.length === 0) ? (
              <div className="px-6 py-8 text-center text-cream/40 text-sm">
                No featured items found. Mark items as featured in the Menu section.
              </div>
            ) : (
              featuredItems.map((item) => (
                <div key={item.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cream">{item.name}</p>
                    <p className="text-xs text-cream/50">{(item as any).categories?.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gold-400">Rs. {Number(item.price).toLocaleString()}</span>
                    {item.badge && (
                      <span className="text-xs px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20 capitalize">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-dark-card rounded-sm border border-dark-border p-6 shadow-card">
        <h3 className="font-display font-bold text-cream mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/menu" className="px-4 py-2 text-sm font-medium bg-gold-500/10 text-gold-400 border border-gold-500/20 rounded-sm hover:bg-gold-500/20 transition-colors">
            + Add Menu Item
          </a>
          <a href="/admin/branches" className="px-4 py-2 text-sm font-medium bg-dark-border text-cream/70 border border-dark-border rounded-sm hover:text-cream hover:bg-dark-border/80 transition-colors">
            Manage Branches
          </a>
          <a href="/admin/settings" className="px-4 py-2 text-sm font-medium bg-dark-border text-cream/70 border border-dark-border rounded-sm hover:text-cream hover:bg-dark-border/80 transition-colors">
            Site Settings
          </a>
        </div>
      </div>
    </div>
  );
}
