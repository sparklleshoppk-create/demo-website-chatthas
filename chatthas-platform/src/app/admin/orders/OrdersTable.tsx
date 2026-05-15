'use client';

import { useRouter } from 'next/navigation';
import { updateOrderStatus, cancelOrder, updateOrderTracking, updateOrderDeliveryFee, deleteOrder } from './actions';
import { FaArrowRight, FaTimes, FaTrash } from 'react-icons/fa';


interface Order {
  id: string;
  order_number: string;
  status: string;
  type: string;
  subtotal: number;
  total: number;
  delivery_fee: number;
  discount_amount: number;
  payment_method: string | null;
  payment_status: string | null;
  delivery_address: string | null;
  delivery_instructions: string | null;
  customer_notes: string | null;
  created_at: string;
}

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];

const statusColors: Record<string, string> = {
  pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  confirmed: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  preparing: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  ready: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  out_for_delivery: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  delivered: 'text-green-400 bg-green-500/10 border-green-500/20',
  cancelled: 'text-ember-400 bg-ember-500/10 border-ember-500/20',
};

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();

  const getNextStatus = (current: string) => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx === -1 || idx >= STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[idx + 1];
  };

  const handleAdvance = async (id: string, current: string) => {
    const next = getNextStatus(current);
    if (!next) return;
    const res = await updateOrderStatus(id, next);
    if (res?.error) {
      alert(`Error updating status: ${res.error}`);
    } else {
      router.refresh();
    }
  };

  const handleCancel = async (id: string, orderNum: string) => {
    if (!confirm(`Cancel order ${orderNum}? This cannot be undone.`)) return;
    const res = await cancelOrder(id);
    if (res?.error) {
      alert(`Error cancelling order: ${res.error}`);
    } else {
      router.refresh();
    }
  };

  const handleDelete = async (id: string, orderNum: string) => {
    if (!confirm(`PERMANENTLY DELETE order ${orderNum}? This will remove it from the database.`)) return;
    const res = await deleteOrder(id);
    if (res?.error) {
      alert(`Error deleting order: ${res.error}`);
    } else {
      router.refresh();
    }
  };


  if (orders.length === 0) {
    return (
      <div className="bg-dark-card rounded-sm border border-dark-border shadow-card">
        <div className="px-6 py-12 text-center text-cream/40 text-sm">
          No orders yet. Orders will appear here in real time as customers place them.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-sm border border-dark-border shadow-card overflow-hidden">
      <table className="min-w-full divide-y divide-dark-border">
        <thead className="bg-charcoal">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-cream/50 uppercase tracking-wider">Order #</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-cream/50 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-cream/50 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-cream/50 uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-cream/50 uppercase tracking-wider">Payment</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-cream/50 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-cream/50 uppercase tracking-wider">Tracking</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-cream/50 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-border">
          {orders.map((order) => {
            const next = getNextStatus(order.status);
            return (
              <tr key={order.id} className="hover:bg-dark-border/20 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-cream">{order.order_number}</p>
                  <div className="text-[11px] text-cream/40 mt-1 space-y-0.5">
                    {order.customer_notes && <p className="text-gold-500/60 font-bold">{order.customer_notes}</p>}
                    {order.delivery_instructions && <p className="text-green-400/80 italic font-medium">Note: {order.delivery_instructions}</p>}
                    {order.delivery_address && (
                      <p className="line-clamp-2 italic">📍 {order.delivery_address}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded border capitalize ${statusColors[order.status] || 'text-cream/50 bg-dark-border border-dark-border'}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-cream/70 capitalize">{order.type?.replace('_', ' ')}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gold-400">Rs. {Number(order.total).toLocaleString()}</div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-[9px] text-cream/40 uppercase tracking-widest whitespace-nowrap">Del. Fee:</span>
                    <input 
                      type="number"
                      className="bg-charcoal border border-dark-border text-[10px] text-cream p-1 rounded-sm w-16 focus:border-gold-500 outline-none"
                      defaultValue={order.delivery_fee || 0}
                      onBlur={async (e) => {
                        const val = Number(e.target.value);
                        if (val !== order.delivery_fee) {
                          const res = await updateOrderDeliveryFee(order.id, val);
                          if (res?.error) alert(`Error updating fee: ${res.error}`);
                          else router.refresh();
                        }
                      }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs capitalize ${order.payment_status === 'paid' ? 'text-green-400' : 'text-cream/50'}`}>
                    {order.payment_status || '—'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-cream/50">{new Date(order.created_at).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <input 
                      type="datetime-local" 
                      className="bg-charcoal border border-dark-border text-[10px] text-cream p-1 rounded-sm w-32 focus:border-gold-500 outline-none"
                      defaultValue={order.estimated_delivery_at ? new Date(order.estimated_delivery_at).toISOString().slice(0, 16) : ''}
                      onChange={async (e) => {
                        await updateOrderTracking(order.id, { estimated_delivery_at: e.target.value });
                      }}
                    />
                    <input 
                      type="text" 
                      placeholder="Rider Name"
                      className="bg-charcoal border border-dark-border text-[10px] text-cream p-1 rounded-sm w-32 focus:border-gold-500 outline-none"
                      defaultValue={order.rider_info?.name || ''}
                      onBlur={async (e) => {
                        await updateOrderTracking(order.id, { rider_info: { ...order.rider_info, name: e.target.value } });
                      }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {next && order.status !== 'cancelled' && (
                      <button
                        onClick={() => handleAdvance(order.id, order.status)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-gold-500/10 text-gold-400 border border-gold-500/20 rounded-sm hover:bg-gold-500/20 transition-all"
                        title={`Advance to ${next}`}
                      >
                        <FaArrowRight className="h-3 w-3" />
                        {next.replace('_', ' ')}
                      </button>
                    )}
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button
                        onClick={() => handleCancel(order.id, order.order_number)}
                        className="p-1.5 text-cream/30 hover:text-ember-400 hover:bg-ember-500/10 rounded transition-colors"
                        title="Cancel order"
                      >
                        <FaTimes className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(order.id, order.order_number)}
                      className="p-1.5 text-cream/10 hover:text-ember-500 hover:bg-ember-500/5 rounded transition-colors"
                      title="Delete order permanently"
                    >
                      <FaTrash className="h-3 w-3" />
                    </button>
                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
