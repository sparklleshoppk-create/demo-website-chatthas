'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { FaBox, FaUtensils, FaBiking, FaCheckCircle, FaClock, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';

const statuses = [
  { id: 'pending', label: 'Order Placed', icon: FaClock, color: 'text-amber-500' },
  { id: 'confirmed', label: 'Confirmed', icon: FaCheckCircle, color: 'text-blue-500' },
  { id: 'preparing', label: 'Kitchen', icon: FaUtensils, color: 'text-orange-500' },
  { id: 'ready', label: 'Packed', icon: FaBox, color: 'text-cyan-500' },
  { id: 'out_for_delivery', label: 'On the Way', icon: FaBiking, color: 'text-purple-500' },
  { id: 'delivered', label: 'Served', icon: FaCheckCircle, color: 'text-green-500' },
];

export default function TrackingPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadOrder() {
      const { data } = await supabase
        .from('orders')
        .select('*, branches(name, phone)')
        .eq('id', params.id)
        .single();
      
      setOrder(data);
      setLoading(false);
    }

    loadOrder();

    // Live updates
    const channel = supabase
      .channel(`order-tracking-${params.id}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'orders', 
        filter: `id=eq.${params.id}` 
      }, (payload) => {
        setOrder((prev: any) => ({ ...prev, ...payload.new }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.id]);

  if (loading) return <div className="min-h-screen bg-charcoal flex items-center justify-center text-gold-500 italic">Finding your plate...</div>;
  if (!order) return <div className="min-h-screen bg-charcoal flex items-center justify-center text-cream">Order not found.</div>;

  const currentStatusIdx = statuses.findIndex(s => s.id === order.status);
  const progress = ((currentStatusIdx + 1) / statuses.length) * 100;

  return (
    <main className="min-h-screen bg-charcoal pt-32 pb-20">
      <div className="container-custom max-w-3xl">
        <div className="liquid-glass p-8 md:p-12 rounded-sm border border-gold-500/20">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-2">Live Tracking</p>
              <h1 className="text-3xl font-display font-bold text-cream tracking-tight">
                Order <span className="gold-text italic">#{order.order_number}</span>
              </h1>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-cream/40 uppercase tracking-tighter">Est. Delivery</p>
              <p className="text-xl font-display font-bold text-cream">
                {order.estimated_delivery_at ? new Date(order.estimated_delivery_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Calculating...'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative mb-16">
            <div className="h-1 bg-dark-border w-full absolute top-1/2 -translate-y-1/2"></div>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-1 bg-gold-500 absolute top-1/2 -translate-y-1/2 z-10 shadow-[0_0_10px_rgba(212,160,23,0.5)]"
            ></motion.div>
            
            <div className="relative z-20 flex justify-between">
              {statuses.map((s, idx) => {
                const isPast = idx <= currentStatusIdx;
                const isCurrent = idx === currentStatusIdx;
                const Icon = s.icon;
                return (
                  <div key={s.id} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      isPast ? 'bg-gold-500 border-gold-500 text-charcoal' : 'bg-charcoal border-dark-border text-cream/20'
                    } ${isCurrent ? 'scale-125 shadow-gold animate-pulse' : ''}`}>
                      <Icon size={12} />
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-tighter mt-3 transition-colors ${isPast ? 'text-gold-500' : 'text-cream/20'}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rider / Branch Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-dark-border">
            {order.status === 'out_for_delivery' && order.rider_info?.name ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center border border-gold-500/30">
                  <FaBiking className="text-gold-500" />
                </div>
                <div>
                  <p className="text-[10px] text-cream/40 uppercase tracking-widest font-bold">Your Rider</p>
                  <p className="text-cream font-bold">{order.rider_info.name}</p>
                  <a href={`tel:${order.rider_info.phone}`} className="text-gold-500 text-xs flex items-center gap-1 hover:underline mt-0.5">
                    <FaPhone size={8} /> {order.rider_info.phone}
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 opacity-50">
                <div className="w-12 h-12 rounded-full bg-dark-border flex items-center justify-center">
                  <FaStore className="text-cream/20" />
                </div>
                <div>
                  <p className="text-[10px] text-cream/40 uppercase tracking-widest font-bold">Preparing at</p>
                  <p className="text-cream font-bold">{order.branches?.name || 'Chattha\'s Central'}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center border border-gold-500/30">
                <FaMapMarkerAlt className="text-gold-500" />
              </div>
              <div>
                <p className="text-[10px] text-cream/40 uppercase tracking-widest font-bold">Delivery Address</p>
                <p className="text-cream text-xs line-clamp-2">{order.delivery_address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="mt-8 text-center">
          <p className="text-cream/40 text-xs mb-4 italic">Need help with your order? Contact the branch at {order.branches?.phone}</p>
          <button onClick={() => window.location.reload()} className="text-gold-500 text-sm font-bold uppercase tracking-widest hover:text-gold-400">
            Refresh Status
          </button>
        </div>
      </div>
    </main>
  );
}
