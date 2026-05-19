'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { updateOrderStatus, cancelOrder, updateOrderTracking, updateOrderDeliveryFee, deleteOrder, updatePaymentStatus } from './actions';
import { FaArrowRight, FaTimes, FaTrash, FaPrint, FaThLarge, FaList, FaSearch, FaFilter, FaCheckCircle, FaClock, FaTruck, FaBan } from 'react-icons/fa';
import { createClient } from '@/utils/supabase/client';

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
  estimated_delivery_at?: string;
  rider_info?: { name?: string };
  branches?: { name: string };
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

const statusIcons: Record<string, string> = {
  pending: '⏳',
  confirmed: '✓',
  preparing: '🔥',
  ready: '✅',
  out_for_delivery: '🛵',
  delivered: '🎉',
  cancelled: '✕',
};

function parseCustomerInfo(notes: string | null) {
  if (!notes) return { name: 'Guest', phone: '—', email: '—', cleanNotes: '' };
  
  const nameMatch = notes.match(/Name:\s*([^|]+)/i);
  const phoneMatch = notes.match(/Phone:\s*([^|]+)/i);
  const emailMatch = notes.match(/Email:\s*([^|]+)/i);
  const notesMatch = notes.match(/Notes:\s*([^|]+)/i);
  
  const name = nameMatch ? nameMatch[1].trim() : 'Guest';
  const phone = phoneMatch ? phoneMatch[1].trim() : '—';
  const email = emailMatch ? emailMatch[1].trim() : '—';
  
  let cleanNotes = '';
  if (notesMatch) {
    cleanNotes = notesMatch[1].trim();
  } else if (!notes.includes('|')) {
    cleanNotes = notes.trim();
  }

  return { name, phone, email, cleanNotes };
}

function getBranchDisplay(order: Order) {
  if (order.branches?.name) {
    return order.branches.name;
  }
  
  if (order.customer_notes) {
    const branchMatch = order.customer_notes.match(/Branch:\s*([^|]+)/i);
    if (branchMatch) {
      const branchId = branchMatch[1].trim();
      const staticBranches: Record<string, string> = {
        '1': "Tariq Market F-10/2",
        '2': "Beverly Centre F-6",
        '3': "Bahria Town Phase 4",
        '4': "Bahria Phase 7",
        '5': "Branch 5"
      };
      return staticBranches[branchId] || `Branch ${branchId}`;
    }
  }
  
  return 'Main Branch';
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [view, setView] = useState<'table' | 'kds'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('active');

  const getNextStatus = (current: string) => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx === -1 || idx >= STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[idx + 1];
  };

  const handleAdvance = async (id: string, current: string) => {
    const next = getNextStatus(current);
    if (!next) return;
    const res = await updateOrderStatus(id, next);
    if (res?.error) alert(`Error: ${res.error}`);
    else router.refresh();
  };

  const handleCancel = async (id: string, orderNum: string) => {
    if (!confirm(`Cancel order ${orderNum}?`)) return;
    const res = await cancelOrder(id);
    if (res?.error) alert(`Error: ${res.error}`);
    else router.refresh();
  };

  const handleDelete = async (id: string, orderNum: string) => {
    if (!confirm(`Permanently DELETE order ${orderNum}?`)) return;
    const res = await deleteOrder(id);
    if (res?.error) alert(`Error: ${res.error}`);
    else router.refresh();
  };

  const handlePaymentToggle = async (id: string, current: string | null) => {
    const next = current === 'paid' ? 'unpaid' : 'paid';
    const res = await updatePaymentStatus(id, next);
    if (res?.error) alert(`Error: ${res.error}`);
    else router.refresh();
  };

  const handlePrint = (order: Order) => {
    const receiptContent = `
      <html>
        <head>
          <style>
            body { font-family: monospace; width: 300px; margin: 0 auto; color: black; background: white; padding: 20px; font-size: 12px; line-height: 1.4; }
            .header { text-align: center; margin-bottom: 16px; border-bottom: 2px dashed #333; padding-bottom: 12px; }
            .header h2 { margin: 0 0 4px 0; font-size: 20px; letter-spacing: 4px; }
            .header p { margin: 2px 0; }
            .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
            .total { margin-top: 12px; border-top: 2px dashed #333; padding-top: 10px; font-weight: bold; font-size: 14px; }
            .footer { text-align: center; margin-top: 16px; border-top: 1px dashed #333; padding-top: 10px; font-size: 10px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>CHATTHA'S</h2>
            <p style="letter-spacing:6px;font-size:9px;color:#333;">RESTAURANT GROUP</p>
            <p style="margin-top:8px;font-weight:bold;">Order #${order.order_number}</p>
            <p>${new Date(order.created_at).toLocaleString('en-US', { timeZone: 'Asia/Karachi', dateStyle: 'medium', timeStyle: 'short' })}</p>
            <p><strong>${order.type.replace('_', ' ').toUpperCase()}</strong></p>
          </div>
          <div style="margin-bottom:12px;">
            <p><strong>Customer:</strong> ${order.order_number.split('-')[0]}</p>
            <p><strong>Address:</strong> ${order.delivery_address || 'Walk-in / Pickup'}</p>
            ${order.customer_notes ? `<p><strong>Notes:</strong> ${order.customer_notes}</p>` : ''}
          </div>
          <div style="border-top:1px dashed #333; padding-top:8px;">
            <div class="row"><span>Subtotal:</span><span>Rs. ${Number(order.subtotal).toLocaleString()}</span></div>
            <div class="row"><span>Delivery:</span><span>Rs. ${Number(order.delivery_fee).toLocaleString()}</span></div>
            ${order.discount_amount ? `<div class="row"><span>Discount:</span><span>-Rs. ${Number(order.discount_amount).toLocaleString()}</span></div>` : ''}
          </div>
          <div class="total">
            <div class="row"><span>GRAND TOTAL:</span><span>Rs. ${Number(order.total).toLocaleString()}</span></div>
            <div class="row" style="font-size:11px;"><span>Method:</span><span>${(order.payment_method || 'COD').toUpperCase()}</span></div>
            <div class="row" style="font-size:11px;"><span>Status:</span><span>${(order.payment_status || 'UNPAID').toUpperCase()}</span></div>
          </div>
          <div class="footer">
            <p>Thank you for choosing Chattha's!</p>
            <p>Order processed via Chattha's Admin Portal</p>
          </div>
          <script>window.print(); setTimeout(() => window.close(), 1000);</script>
        </body>
      </html>
    `;
    const printWindow = window.open('', '', 'width=400,height=600');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
    }
  };

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('orders_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          try { new Audio('/notification.mp3').play().catch(() => {}); } catch {}
        }
        router.refresh();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [router]);

  // Filtering Logic
  const filteredOrders = orders.filter(order => {
    const customer = parseCustomerInfo(order.customer_notes);
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.delivery_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.payment_method?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'active' ? !['delivered', 'cancelled'].includes(order.status) :
      activeTab === 'completed' ? order.status === 'delivered' :
      activeTab === 'cancelled' ? order.status === 'cancelled' : true;
      
    return matchesSearch && matchesTab;
  });

  if (orders.length === 0) {
    return (
      <div className="bg-charcoal rounded-sm border border-dark-border shadow-card p-20 text-center">
        <p className="font-display italic gold-text text-xl mb-4">No Orders Found</p>
        <p className="text-cream/30 uppercase tracking-[0.3em] text-sm">Real-time orders will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and View Toggle */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-primary-black p-4 border border-dark-border rounded-sm">
        <div className="relative w-full lg:w-96">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
          <input 
            type="text" 
            placeholder="Search Order #, Address, or Method..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-charcoal border border-dark-border text-cream text-sm focus:border-gold-500/50 outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setView('table')} 
            className={`px-4 py-2 text-sm font-bold tracking-widest uppercase border transition-all flex items-center gap-2 ${
              view === 'table' ? 'bg-gold-500 text-charcoal border-gold-500' : 'bg-transparent text-cream/40 border-dark-border hover:text-cream'
            }`}
          >
            <FaList size={12} /> List
          </button>
          <button 
            onClick={() => setView('kds')} 
            className={`px-4 py-2 text-sm font-bold tracking-widest uppercase border transition-all flex items-center gap-2 ${
              view === 'kds' ? 'bg-gold-500 text-charcoal border-gold-500' : 'bg-transparent text-cream/40 border-dark-border hover:text-cream'
            }`}
          >
            <FaThLarge size={12} /> Grid
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      {view === 'table' && (
        <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
          {[
            { id: 'all', label: 'All Orders', icon: FaFilter },
            { id: 'active', label: 'Active', icon: FaClock },
            { id: 'completed', label: 'Completed', icon: FaCheckCircle },
            { id: 'cancelled', label: 'Cancelled', icon: FaBan },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 text-[11px] font-bold tracking-[0.2em] uppercase border whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-gold-500/10 text-gold-500 border-gold-500/50 shadow-gold' 
                  : 'bg-charcoal text-cream/40 border-dark-border hover:text-cream/70'
              }`}
            >
              <tab.icon size={10} /> {tab.label}
              <span className="ml-1 opacity-50">({orders.filter(o => {
                if (tab.id === 'all') return true;
                if (tab.id === 'active') return !['delivered', 'cancelled'].includes(o.status);
                if (tab.id === 'completed') return o.status === 'delivered';
                if (tab.id === 'cancelled') return o.status === 'cancelled';
                return true;
              }).length})</span>
            </button>
          ))}
        </div>
      )}

      {/* Grid View */}
      {view === 'kds' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOrders.filter(o => !['delivered', 'cancelled'].includes(o.status)).map((order) => {
            const next = getNextStatus(order.status);
            return (
              <div key={order.id} className="bg-charcoal border border-dark-border rounded-sm overflow-hidden flex flex-col card-lift">
                <div className={`p-4 flex items-center justify-between border-b border-dark-border ${statusColors[order.status].replace('text-', 'bg-').split(' ')[1]}`}>
                  <span className="text-xl">{statusIcons[order.status]}</span>
                  <div className="text-right">
                    <p className="text-sm font-bold text-cream">#{order.order_number}</p>
                    <p className="text-[10px] font-bold tracking-tighter uppercase text-cream/40">{order.type}</p>
                    <p className="text-[9px] text-cream/30">{new Date(order.created_at).toLocaleDateString('en-US', { timeZone: 'Asia/Karachi', day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="p-4 flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-cream/70 leading-relaxed font-medium">
                      {order.delivery_address || 'Walk-in Customer'}
                    </p>
                  </div>
                  
                  {/* Customer Info in KDS */}
                  <div className="bg-primary-black/40 p-2 rounded-sm border border-dark-border/30">
                    <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-1">Customer</p>
                    <p className="text-sm font-bold text-cream">{parseCustomerInfo(order.customer_notes).name}</p>
                    <p className="text-[10px] text-cream/50">{parseCustomerInfo(order.customer_notes).phone}</p>
                  </div>

                  {parseCustomerInfo(order.customer_notes).cleanNotes && (
                    <div className="bg-gold-500/10 border border-gold-500/20 p-2 text-xs text-gold-500 italic">
                      "{parseCustomerInfo(order.customer_notes).cleanNotes}"
                    </div>
                  )}
                  <div className="flex justify-between items-center text-[11px] text-cream/30 uppercase tracking-widest pt-2 border-t border-dark-border/50">
                    <span>{new Date(order.created_at).toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-gold-500 font-bold">Rs. {Number(order.total).toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-3 bg-primary-black border-t border-dark-border flex gap-2">
                  {next && (
                    <button 
                      onClick={() => handleAdvance(order.id, order.status)}
                      className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest bg-gold-500 text-charcoal hover:bg-gold-400 transition-all rounded-sm"
                    >
                      Move to {next}
                    </button>
                  )}
                  <button onClick={() => handlePrint(order)} className="p-2 text-cream/30 hover:text-cream bg-white/5 rounded-sm"><FaPrint size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-charcoal border border-dark-border rounded-sm overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-primary-black border-b border-dark-border">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-cream/40 uppercase tracking-widest">Order Info</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-cream/40 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-cream/40 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-cream/40 uppercase tracking-widest">Payment</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-cream/40 uppercase tracking-widest">Total</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-cream/40 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/30">
                {filteredOrders.map((order) => {
                  const next = getNextStatus(order.status);
                  const isPaid = order.payment_status === 'paid';
                  
                  return (
                    <tr key={order.id} className="group hover:bg-white/5 transition-all">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-black border border-dark-border rounded-sm flex items-center justify-center text-xs font-bold text-gold-500">
                            {order.order_number.slice(-3)}
                          </div>
                          <div>
                            <p className="text-sm font-display font-bold text-cream">#{order.order_number}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-cream/30">{order.type.replace('_', ' ')}</span>
                              <span className="text-cream/10">•</span>
                              <span className="text-[10px] text-cream/30">{new Date(order.created_at).toLocaleDateString('en-US', { timeZone: 'Asia/Karachi', day: '2-digit', month: 'short' })}</span>
                              <span className="text-cream/10">•</span>
                              <span className="text-[10px] text-cream/30">{new Date(order.created_at).toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-[2px] bg-gold-500/10 border border-gold-500/20">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-gold-500">{getBranchDisplay(order)}</span>
                            </div>
                          </div>
                        </div>
                        {order.delivery_address && (
                          <p className="mt-3 text-[10px] text-cream/40 line-clamp-1 italic max-w-xs">📍 {order.delivery_address}</p>
                        )}
                      </td>
                      
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-cream">{parseCustomerInfo(order.customer_notes).name}</p>
                          <p className="text-[10px] text-gold-500/80 font-medium tracking-widest">{parseCustomerInfo(order.customer_notes).phone}</p>
                          <p className="text-[10px] text-cream/40">{parseCustomerInfo(order.customer_notes).email}</p>
                          {parseCustomerInfo(order.customer_notes).cleanNotes && (
                            <p className="text-[10px] text-cream/30 italic line-clamp-1">"{parseCustomerInfo(order.customer_notes).cleanNotes}"</p>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-5">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold tracking-widest uppercase ${statusColors[order.status]}`}>
                          <span>{statusIcons[order.status]}</span>
                          {order.status.replace('_', ' ')}
                        </div>
                      </td>
                      
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-cream/30 uppercase tracking-tighter">{order.payment_method || 'COD'}</span>
                            <button 
                              onClick={() => handlePaymentToggle(order.id, order.payment_status)}
                              className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase transition-all border ${
                                isPaid ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-ember-500/10 text-ember-500 border-ember-500/20'
                              }`}
                            >
                              {order.payment_status?.toUpperCase() || 'UNPAID'}
                            </button>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-cream">Rs. {Number(order.total).toLocaleString()}</div>
                        <div className="flex items-center gap-1 mt-1 opacity-40 group-hover:opacity-100 transition-opacity">
                          <span className="text-[9px] uppercase font-bold text-cream/40">Del:</span>
                          <input 
                            type="number" 
                            className="w-12 bg-transparent border-b border-dark-border text-[10px] text-gold-500 focus:border-gold-500 outline-none"
                            defaultValue={order.delivery_fee}
                            onBlur={(e) => updateOrderDeliveryFee(order.id, Number(e.target.value))}
                          />
                        </div>
                      </td>
                      
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => router.push(`/admin/orders/${order.id}`)}
                            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 text-cream rounded-sm transition-all border border-dark-border"
                          >
                            Details
                          </button>
                          {next && (
                            <button 
                              onClick={() => handleAdvance(order.id, order.status)}
                              className="p-2 text-gold-500 hover:bg-gold-500/10 rounded-sm transition-all border border-transparent hover:border-gold-500/30"
                              title={`Advance to ${next}`}
                            >
                              <FaArrowRight size={14} />
                            </button>
                          )}
                          <button onClick={() => handlePrint(order)} className="p-2 text-cream/30 hover:text-cream rounded-sm"><FaPrint size={14} /></button>
                          <div className="h-4 w-px bg-dark-border mx-1" />
                          <button onClick={() => handleCancel(order.id, order.order_number)} className="p-2 text-cream/20 hover:text-ember-500 rounded-sm"><FaTimes size={14} /></button>
                          <button onClick={() => handleDelete(order.id, order.order_number)} className="p-2 text-cream/10 hover:text-ember-500 rounded-sm"><FaTrash size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
