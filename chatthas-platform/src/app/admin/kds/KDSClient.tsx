'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { updateOrderStatus } from '../orders/actions';
import { FaClock, FaCheck, FaUtensils } from 'react-icons/fa';

export default function KDSClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('kds_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async () => {
          // Re-fetch orders when any change occurs
          const { data } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .in('status', ['confirmed', 'preparing', 'ready'])
            .order('created_at', { ascending: true });
          
          if (data) setOrders(data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStatusUpdate = async (id: string, currentStatus: string) => {
    let nextStatus = '';
    if (currentStatus === 'confirmed') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'ready';
    else if (currentStatus === 'ready') nextStatus = 'out_for_delivery';

    if (nextStatus) {
      await updateOrderStatus(id, nextStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {orders.map(order => (
        <div key={order.id} className={`bg-dark-card border rounded-sm flex flex-col h-full ${
          order.status === 'confirmed' ? 'border-blue-500/20' :
          order.status === 'preparing' ? 'border-orange-500/20' :
          'border-cyan-500/20'
        }`}>
          {/* Header */}
          <div className={`p-4 border-b flex justify-between items-center ${
            order.status === 'confirmed' ? 'bg-blue-500/5 border-blue-500/10' :
            order.status === 'preparing' ? 'bg-orange-500/5 border-orange-500/10' :
            'bg-cyan-500/5 border-cyan-500/10'
          }`}>
            <div>
              <p className="text-xs font-black text-gold-500 uppercase tracking-widest">{order.order_number}</p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-cream/40 font-bold uppercase">
                <FaClock size={10} />
                <span>{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-black ${
              order.status === 'confirmed' ? 'text-blue-400 border border-blue-400/20' :
              order.status === 'preparing' ? 'text-orange-400 border border-orange-400/20' :
              'text-cyan-400 border border-cyan-400/20'
            }`}>
              {order.status}
            </span>
          </div>

          {/* Items */}
          <div className="p-4 flex-1 space-y-3 overflow-y-auto">
            {order.order_items?.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start gap-4">
                <div className="flex gap-3">
                  <span className="text-gold-500 font-black text-sm">x{item.quantity}</span>
                  <div>
                    <p className="text-sm font-bold text-cream">{item.item_name}</p>
                    {item.variant_label && (
                      <p className="text-[10px] text-gold-500/60 uppercase font-bold tracking-tighter">{item.variant_label}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action */}
          <div className="p-4 border-t border-dark-border">
            <button 
              onClick={() => handleStatusUpdate(order.id, order.status)}
              className={`w-full py-3 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all rounded-sm ${
                order.status === 'confirmed' ? 'bg-blue-500 text-white hover:bg-blue-600' :
                order.status === 'preparing' ? 'bg-orange-500 text-white hover:bg-orange-600' :
                'bg-cyan-500 text-charcoal font-black hover:bg-cyan-600'
              }`}
            >
              {order.status === 'confirmed' && <><FaUtensils size={12}/> Start Cooking</>}
              {order.status === 'preparing' && <><FaCheck size={12}/> Mark Ready</>}
              {order.status === 'ready' && <><FaCheck size={12}/> Finish Order</>}
            </button>
          </div>
        </div>
      ))}

      {orders.length === 0 && (
        <div className="col-span-full py-20 text-center bg-dark-card border border-dashed border-dark-border rounded-sm">
          <p className="text-cream/30 italic">No active orders in the kitchen.</p>
        </div>
      )}
    </div>
  );
}
