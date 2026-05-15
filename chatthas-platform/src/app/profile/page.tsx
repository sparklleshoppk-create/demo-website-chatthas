'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { PageHero } from '@/components/UI';
import { FaHistory, FaUserCircle, FaMapMarkerAlt, FaSignOutAlt, FaArrowRight } from 'react-icons/fa';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setUser(userData || user);


      const { data: userOrders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setOrders(userOrders || []);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return <div className="min-h-screen bg-charcoal flex items-center justify-center text-gold-500 font-display italic">Loading your profile...</div>;

  return (
    <main className="bg-charcoal min-h-screen pb-20">
      <PageHero 
        title="My Account" 
        subtitle="Manage your orders and preferences with Chattha's" 
        breadcrumb="Home / Profile"
        image="/menu_banner.png"
      />

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar / Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="liquid-glass p-8 rounded-sm border border-gold-500/20">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center border border-gold-500/30">
                  <FaUserCircle size={40} className="text-gold-500" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-cream">{user.user_metadata?.full_name}</h3>
                  <p className="text-cream/40 text-xs truncate">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-dark-border">
                <div className="flex items-center gap-3 text-sm text-cream/70">
                  <FaHistory className="text-gold-500" />
                  <span>Total Orders: {orders.length}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gold-500 font-bold bg-gold-500/10 p-3 rounded-sm border border-gold-500/20">
                  <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-charcoal">
                    <span className="text-xs font-black">P</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-60">Plate Points</p>
                    <p className="text-lg leading-none">{user.loyalty_points || 0}</p>
                  </div>
                </div>

                <button onClick={handleLogout} className="flex items-center gap-3 text-sm text-ember/70 hover:text-ember transition-colors">
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Activity / Orders */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-display font-bold text-cream">Order History</h2>
            
            {orders.length === 0 ? (
              <div className="bg-dark-card border border-dashed border-dark-border p-12 text-center rounded-sm">
                <p className="text-cream/30 italic">You haven't placed any orders yet.</p>
                <Link href="/menu" className="btn-gold mt-6 inline-block">Order Now</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="relative group">
                    <Link href={`/order/track/${order.id}`} className="block">
                      <div className="bg-dark-card border border-dark-border p-6 rounded-sm flex flex-col md:flex-row justify-between items-center gap-4 group-hover:border-gold-500/40 transition-all card-lift">
                        <div>
                          <p className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-1">{order.order_number}</p>
                          <p className="text-sm text-cream/60">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <p className="font-bold text-cream">Rs. {order.total}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] px-2 py-0.5 border border-gold-500/30 text-gold-500 rounded uppercase">
                              {order.status}
                            </span>
                            <FaArrowRight className="text-gold-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" size={12} />
                          </div>
                        </div>
                      </div>
                    </Link>
                    {order.status === 'delivered' && (
                      <button 
                        onClick={async (e) => {
                          e.preventDefault();
                          const { data: items } = await supabase.from('order_items').select('*, menu_items(id, name, price, image_url)').eq('order_id', order.id);
                          if (items) {
                            items.forEach(item => {
                              const dish = {
                                id: item.menu_items.id,
                                name: item.menu_items.name,
                                price: item.menu_items.price,
                                image_url: item.menu_items.image_url
                              };
                              for(let i=0; i<item.quantity; i++) {
                                addToCart(
                                  dish, 
                                  item.variant_label ? { name: item.variant_label, price_adjustment: 0 } : undefined,
                                  item.addons
                                );
                              }
                            });
                            router.push('/order');
                          }
                        }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all btn-gold px-4 py-2 text-xs z-10"
                      >
                        Reorder Plate
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
