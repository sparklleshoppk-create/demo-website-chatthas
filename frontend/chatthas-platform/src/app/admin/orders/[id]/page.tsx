import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaMapMarkerAlt, FaUser, FaPhoneAlt, FaEnvelope, FaClock, FaCalendar, FaReceipt, FaMoneyBillWave } from 'react-icons/fa';

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

function parseDeliveryInstructions(instructions: string | null) {
  if (!instructions) return { coords: null, plusCode: null, rest: '' };

  let coords = null;
  let plusCode = null;
  let restParts: string[] = [];

  const parts = instructions.split('|').map(p => p.trim());
  for (const part of parts) {
    if (part.startsWith('Coords:')) {
      const coordStr = part.replace('Coords:', '').trim();
      const [lat, lng] = coordStr.split(',').map(s => parseFloat(s.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        coords = { lat, lng };
      }
    } else if (part.startsWith('Plus Code:')) {
      plusCode = part.replace('Plus Code:', '').trim();
    } else {
      restParts.push(part);
    }
  }

  return { coords, plusCode, rest: restParts.join(' | ') };
}

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*, branches(name)')
    .eq('id', params.id)
    .single();

  if (orderError || !order) {
    notFound();
  }

  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);

  const customer = parseCustomerInfo(order.customer_notes);
  const deliveryInfo = parseDeliveryInstructions(order.delivery_instructions);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-primary-black p-4 border border-dark-border rounded-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 text-cream/50 hover:text-gold-500 bg-charcoal border border-dark-border rounded-sm transition-all">
            <FaArrowLeft />
          </Link>
          <div>
            <h2 className="text-xl font-display font-bold text-cream tracking-tight">Order #{order.order_number}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cream/40">{order.type.replace('_', ' ')}</span>
              <span className="text-cream/10">•</span>
              <span className="text-[10px] text-cream/40">{new Date(order.created_at).toLocaleString('en-US', { timeZone: 'Asia/Karachi' })}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-1.5 rounded-full border bg-charcoal border-dark-border text-xs font-bold tracking-widest uppercase text-cream">
            {order.status.replace('_', ' ')}
          </div>
          {order.branches?.name && (
            <div className="px-4 py-1.5 rounded-[2px] bg-gold-500/10 border border-gold-500/20 text-xs font-bold tracking-widest uppercase text-gold-500">
              {order.branches.name}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer & Delivery Info */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-charcoal border border-dark-border rounded-sm p-6 shadow-card card-lift">
            <h3 className="text-sm font-display font-light italic gold-text mb-4 flex items-center gap-2">
              <FaUser className="text-gold-500/50" /> Customer Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-cream/30 uppercase tracking-widest font-bold mb-1">Name</p>
                <p className="text-sm font-body text-cream">{customer.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-cream/30" size={12} />
                <p className="text-sm font-body text-cream/80">{customer.phone}</p>
              </div>
              {customer.email !== '—' && (
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-cream/30" size={12} />
                  <p className="text-sm font-body text-cream/80">{customer.email}</p>
                </div>
              )}
              {customer.cleanNotes && (
                <div className="mt-4 p-3 bg-primary-black border border-dark-border rounded-sm">
                  <p className="text-[10px] text-gold-500 uppercase tracking-widest font-bold mb-1">Notes</p>
                  <p className="text-xs font-body text-cream/70 italic">"{customer.cleanNotes}"</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-charcoal border border-dark-border rounded-sm p-6 shadow-card card-lift">
            <h3 className="text-sm font-display font-light italic text-cyan-400 mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-cyan-400/50" /> Delivery Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-cream/30 uppercase tracking-widest font-bold mb-1">Address</p>
                <p className="text-sm font-body text-cream/80 leading-relaxed">{order.delivery_address || 'Walk-in / Pickup'}</p>
              </div>
              
              {deliveryInfo.plusCode && (
                <div className="p-3 bg-primary-black border border-cyan-500/20 rounded-sm">
                  <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold mb-1">Plus Code</p>
                  <p className="text-sm font-display text-cream">{deliveryInfo.plusCode}</p>
                </div>
              )}

              {deliveryInfo.coords && (
                <div>
                  <div className="flex gap-2 items-center mb-2">
                    <p className="text-[10px] text-cream/30 uppercase tracking-widest font-bold">Exact Location Pinned</p>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${deliveryInfo.coords.lat},${deliveryInfo.coords.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 underline uppercase tracking-wider"
                    >
                      Open in Maps
                    </a>
                  </div>
                  <div className="w-full h-48 bg-primary-black rounded-sm border border-dark-border overflow-hidden">
                    <iframe 
                      src={`https://www.google.com/maps/embed/v1/place?q=${deliveryInfo.coords.lat},${deliveryInfo.coords.lng}&key=API_KEY_NOT_NEEDED_FOR_SIMPLE_EMBED_BUT_CAN_USE_MAPS_URL`}
                      style={{ border: 0, width: '100%', height: '100%' }}
                      loading="lazy"
                      srcDoc={`<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q=${deliveryInfo.coords.lat},${deliveryInfo.coords.lng}&hl=es;z=14&amp;output=embed"></iframe>`}
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Order Items & Billing */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-charcoal border border-dark-border rounded-sm shadow-card card-lift overflow-hidden">
            <div className="p-6 border-b border-dark-border flex items-center justify-between">
              <h3 className="text-sm font-display font-light italic gold-text flex items-center gap-2">
                <FaReceipt className="text-gold-500/50" /> Order Items
              </h3>
            </div>
            
            <table className="w-full text-left">
              <thead className="bg-primary-black border-b border-dark-border">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-bold text-cream/40 uppercase tracking-widest">Item</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-cream/40 uppercase tracking-widest text-center">Qty</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-cream/40 uppercase tracking-widest text-right">Price</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-cream/40 uppercase tracking-widest text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/30">
                {items?.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-cream">{item.item_name}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-2 py-1 bg-primary-black border border-dark-border rounded-sm text-xs font-bold text-cream">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-cream/70">
                      Rs. {item.unit_price}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-gold-500">
                      Rs. {item.line_total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="bg-primary-black/50 p-6 border-t border-dark-border">
              <div className="w-full max-w-sm ml-auto space-y-3">
                <div className="flex justify-between text-sm text-cream/70">
                  <span>Subtotal</span>
                  <span className="font-bold text-cream">Rs. {order.subtotal}</span>
                </div>
                {order.delivery_fee > 0 && (
                  <div className="flex justify-between text-sm text-cream/70">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-cream">Rs. {order.delivery_fee}</span>
                  </div>
                )}
                {order.tax_amount > 0 && (
                  <div className="flex justify-between text-sm text-cream/70">
                    <span>Tax</span>
                    <span className="font-bold text-cream">Rs. {order.tax_amount}</span>
                  </div>
                )}
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-gold-500">
                    <span>Discount</span>
                    <span className="font-bold">- Rs. {order.discount_amount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-dark-border mt-4">
                  <span className="font-display text-lg text-cream">Grand Total</span>
                  <span className="font-display text-2xl font-bold text-gold-500">Rs. {order.total}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-charcoal border-t border-dark-border flex justify-between items-center">
               <div className="flex items-center gap-4">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-cream/40 uppercase tracking-widest font-bold mb-1">Payment Method</span>
                   <span className="text-sm font-display text-cream flex items-center gap-2">
                     <FaMoneyBillWave className="text-gold-500" /> {(order.payment_method || 'COD').toUpperCase()}
                   </span>
                 </div>
                 <div className="h-8 w-px bg-dark-border"></div>
                 <div className="flex flex-col">
                   <span className="text-[10px] text-cream/40 uppercase tracking-widest font-bold mb-1">Payment Status</span>
                   <span className={`text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded-[2px] border ${
                     order.payment_status === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-ember-500/10 text-ember-500 border-ember-500/20'
                   }`}>
                     {order.payment_status?.toUpperCase() || 'UNPAID'}
                   </span>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
