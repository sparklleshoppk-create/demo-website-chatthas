'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { 
  FaChartLine, 
  FaChartBar,
  FaStar,
  FaUtensils, 
  FaClipboardList, 
  FaUsers, 
  FaCog, 
  FaSignOutAlt,
  FaStore,
  FaImage,
  FaTag,
  FaListUl,
  FaEnvelope,
  FaCreditCard,
  FaTruck,
  FaBell
} from 'react-icons/fa';

import OrderNotification from './OrderNotification';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: FaChartLine },
    { name: 'Orders', href: '/admin/orders', icon: FaClipboardList },
    { name: 'Kitchen', href: '/admin/kds', icon: FaUtensils },
    { name: 'Analytics', href: '/admin/analytics', icon: FaChartBar },

    { name: 'Reviews', href: '/admin/reviews', icon: FaStar },
    { name: 'Payments', href: '/admin/payments', icon: FaCreditCard },

    { name: 'Menu Items', href: '/admin/menu', icon: FaUtensils },
    { name: 'Categories', href: '/admin/categories', icon: FaListUl },
    { name: 'Branches', href: '/admin/branches', icon: FaStore },
    { name: 'Delivery Zones', href: '/admin/delivery-zones', icon: FaTruck },
    { name: 'Banners', href: '/admin/banners', icon: FaImage },
    { name: 'Gallery', href: '/admin/gallery', icon: FaImage },
    { name: 'Promo Codes', href: '/admin/promos', icon: FaTag },
    { name: 'Customers', href: '/admin/customers', icon: FaUsers },
    { name: 'Messages', href: '/admin/messages', icon: FaEnvelope },
    { name: 'Notifications', href: '/admin/notifications', icon: FaBell },
    { name: 'Settings', href: '/admin/settings', icon: FaCog },
  ];


  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  // Do not render sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-charcoal text-cream font-body overflow-hidden">
      <OrderNotification />
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-dark-card border-r border-dark-border flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-dark-border">
          <span className="text-xl font-display font-bold text-gold-500">Chattha's Admin</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    target="_self"
                    className={`flex items-center px-3 py-2.5 rounded-sm transition-colors ${
                      isActive 
                        ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20' 
                        : 'text-cream/70 hover:bg-dark-border/50 hover:text-cream'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-gold-400' : 'text-cream/50'}`} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-dark-border">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-ember-400 rounded-sm hover:bg-ember-500/10 transition-colors"
          >
            <FaSignOutAlt className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-dark-card border-b border-dark-border flex items-center justify-between px-6 flex-shrink-0">
          <h1 className="text-lg font-bold text-cream">
            {navigation.find((n) => pathname === n.href || pathname.startsWith(n.href + '/'))?.name || 'Admin'}
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gold-500/20 flex items-center justify-center border border-gold-500/30">
              <span className="text-sm font-bold text-gold-500">A</span>
            </div>
            <span className="text-sm font-medium text-cream/80">Admin User</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-charcoal">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
