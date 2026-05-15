'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { createOrder } from './actions';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaCheckCircle, FaUtensils, FaCreditCard, FaTruck, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { createStripePaymentIntent } from './stripe-actions';
import StripePaymentForm from './StripePaymentForm';
import { createClient } from '@/utils/supabase/client';
import { generatePayFastRequest } from './payfast-actions';
import { useEffect } from 'react';
import { SiVisa, SiMastercard } from 'react-icons/si';


export default function OrderClient() {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'payment' | 'success'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'stripe' | 'payfast'>('cod');

  const [orderData, setOrderData] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [nearestBranchId, setNearestBranchId] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryZones, setDeliveryZones] = useState<any[]>([]);
  const [userCoords, setUserCoords] = useState<{lat: number; lng: number} | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const [taxRateDigital, setTaxRateDigital] = useState(0);
  const [taxRateCod, setTaxRateCod] = useState(0);
  const [flatDeliveryFee, setFlatDeliveryFee] = useState<number | null>(null);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const promoDiscount = appliedPromo 
    ? appliedPromo.discount_type === 'percentage' 
      ? Math.min((totalPrice * (appliedPromo.discount_value / 100)), appliedPromo.max_discount_amount || Infinity)
      : appliedPromo.discount_value
    : 0;

  const handleApplyPromo = async () => {
    setPromoError('');
    if (!promoCodeInput.trim()) return;
    setIsApplyingPromo(true);

    const { data: promo, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', promoCodeInput.trim().toUpperCase())
      .single();

    setIsApplyingPromo(false);

    if (error || !promo || !promo.is_active || (promo.expires_at && new Date(promo.expires_at) < new Date())) {
      setPromoError('Invalid or expired promo code');
      return;
    }

    if (totalPrice < (promo.min_order_amount || 0)) {
      setPromoError(`Minimum order amount is Rs. ${promo.min_order_amount}`);
      return;
    }

    setAppliedPromo(promo);
    setPromoCodeInput('');
  };


  useEffect(() => {
    async function initStripe() {
      const { data: stripeKey } = await supabase
        .from('website_settings')
        .select('value')
        .eq('key', 'stripe_publishable_key')
        .single();
      
      if (stripeKey?.value) {
        setStripePromise(loadStripe(stripeKey.value));
      }
    }

    async function loadBranches() {
      console.log('Fetching branches...');
      const { data, error } = await supabase.from('branches').select('*').order('display_order');
      if (error) console.error('Error fetching branches:', error);
      console.log('Branches found:', data?.length || 0);
      
      const { data: zones } = await supabase.from('delivery_zones').select('*').eq('is_active', true).order('min_distance_km');
      
      setBranches(data || []);
      setDeliveryZones(zones || []);
      
      if (data && data.length > 0) {
        // Set first branch as default immediately
        setSelectedBranch(data[0].id);
        
        // Then try to refine with geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              setUserCoords({ lat: latitude, lng: longitude });
              let minDistance = Infinity;
              let nearestId = data[0].id;
              
              data.forEach((b: any) => {
                if (b.latitude && b.longitude) {
                  const dist = Math.sqrt(
                    Math.pow(Number(b.latitude) - latitude, 2) + 
                    Math.pow(Number(b.longitude) - longitude, 2)
                  );
                  if (dist < minDistance) {
                    minDistance = dist;
                    nearestId = b.id;
                  }
                }
              });
              
              console.log('Nearest branch identified:', nearestId);
              setNearestBranchId(nearestId);
              setSelectedBranch(nearestId);

              // Calculate delivery fee for nearest branch
              const distKm = minDistance * 111; 
              const branchZones = (zones || []).filter((z: any) => z.branch_id === nearestId);
              const matchedZone = branchZones.find((z: any) => distKm >= z.min_distance_km && distKm <= z.max_distance_km);
              if (matchedZone) {
                setDeliveryFee(Number(matchedZone.delivery_fee));
                setEstimatedTime(matchedZone.estimated_time_minutes);
              }
            },
            (err) => {
              console.warn('Geolocation failed:', err.message);
              // Fallback already set to data[0].id
            },
            { timeout: 5000 }
          );
        }
      }
    }

    async function loadSettings() {
      const { data } = await supabase
        .from('website_settings')
        .select('key, value')
        .in('key', ['tax_rate_digital', 'tax_rate_cod', 'flat_delivery_fee']);
      
      if (data) {
        const trDigital = data.find(s => s.key === 'tax_rate_digital')?.value;
        const trCod = data.find(s => s.key === 'tax_rate_cod')?.value;
        const fdf = data.find(s => s.key === 'flat_delivery_fee')?.value;
        if (trDigital) setTaxRateDigital(Number(trDigital));
        if (trCod) setTaxRateCod(Number(trCod));
        if (fdf && Number(fdf) > 0) setFlatDeliveryFee(Number(fdf));
      }
    }

    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();
        if (profile) {
          setUserPoints(profile.loyalty_points || 0);
          setUserData(profile);
        }
      }
    }

    initStripe();
    loadBranches();
    loadUser();
    loadSettings();
  }, []);

  const currentTaxRate = paymentMethod === 'cod' ? taxRateCod : taxRateDigital;
  const effectiveDeliveryFee = flatDeliveryFee !== null ? flatDeliveryFee : deliveryFee;
  const pointsDiscount = usePoints ? Math.floor(userPoints / 10) : 0;
  const taxableAmount = Math.max(0, totalPrice - pointsDiscount - promoDiscount);
  const taxAmount = Math.floor(taxableAmount * (currentTaxRate / 100));
  const finalTotal = taxableAmount + effectiveDeliveryFee + taxAmount;

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    const fd = new FormData(e.currentTarget);
    
    const customerData = {
      name: fd.get('name'),
      phone: fd.get('phone'),
      address: fd.get('address'),
      branchId: fd.get('branchId'),
      paymentMethod: paymentMethod,
      total: finalTotal,
      deliveryFee: effectiveDeliveryFee,
      usePoints: usePoints,
      promoCode: appliedPromo?.code || null,
      promoDiscount: promoDiscount,
      taxAmount: taxAmount,
      deliveryInstructions: deliveryInstructions
    };


    try {
      const res = await createOrder(customerData, items);
      
      if (res.success) {
        if (paymentMethod === 'stripe') {
          try {
            const { clientSecret } = await createStripePaymentIntent(res.orderId, totalPrice);
            setClientSecret(clientSecret);
            setOrderData({ orderId: res.orderId, ...customerData });
            setStatus('payment');
          } catch (err: any) {
            alert(err.message);
            setStatus('idle');
          }
        } else if (paymentMethod === 'payfast') {
          try {
            const { url, params } = await generatePayFastRequest(res.orderId, totalPrice, customerData);
            
            // Create a form and submit it to redirect to PayFast
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = url;
            
            Object.entries(params).forEach(([key, value]) => {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = String(value);
              form.appendChild(input);
            });
            
            document.body.appendChild(form);
            form.submit();
          } catch (err: any) {
            alert(err.message);
            setStatus('idle');
          }
        } else {
          clearCart();
          setStatus('success');
        }
      } else {
        alert(res.error || 'Server returned an error.');
        setStatus('idle');
      }
    } catch (err: any) {
      alert(err.message || 'A network or server error occurred. Please try again.');
      setStatus('idle');
    }

  }

  if (status === 'success') {
    return (
      <div className="py-32 container-custom text-center">
        <FaCheckCircle className="text-gold-500 mx-auto mb-6" size={64} />
        <h2 className="text-4xl font-display font-bold text-cream mb-4">Order Received!</h2>
        <p className="text-cream/50 mb-8 max-w-md mx-auto">Thank you for choosing Chattha's. We have received your order and are preparing it with love. Our rider will contact you shortly.</p>
        <button onClick={() => router.push('/menu')} className="btn-gold px-8">Order More Food</button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-32 container-custom text-center">
        <FaShoppingBag className="text-cream/10 mx-auto mb-6" size={80} />
        <h2 className="text-2xl font-display font-bold text-cream mb-4">Your Cart is Empty</h2>
        <p className="text-cream/40 mb-8">Add some delicious desi food to your cart to get started.</p>
        <button onClick={() => router.push('/menu')} className="btn-gold px-8">Go to Menu</button>
      </div>
    );
  }

  return (
    <div className="py-32 container-custom">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-display font-bold text-cream mb-8 tracking-tight">Review Your <span className="gold-text italic">Plate</span></h2>
          {items.map(item => (
            <div key={item.id} className="bg-dark-card border border-dark-border p-6 flex items-center justify-between gap-6 rounded-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-charcoal rounded-sm border border-dark-border overflow-hidden">
                  {item.image_url && <img src={item.image_url} alt="" className="w-full h-full object-cover" />}
                </div>
                <div>
                  <h3 className="font-bold text-cream">{item.name}</h3>
                  {item.variant_label && (
                    <p className="text-[10px] font-bold text-gold-500/80 uppercase tracking-widest mt-1">
                      {item.variant_label}
                    </p>
                  )}
                  {item.addons && item.addons.length > 0 && (
                    <p className="text-xs text-cream/40 mt-1">
                      + {item.addons.map((a: any) => a.name).join(', ')}
                    </p>
                  )}
                  <p className="text-gold-500 text-sm font-bold mt-1">Rs. {item.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 border border-dark-border rounded-full px-3 py-1">
                  <button onClick={() => updateQuantity(item.id, -1)} className="text-cream/40 hover:text-gold-500"><FaMinus size={10}/></button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="text-cream/40 hover:text-gold-500"><FaPlus size={10}/></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-cream/20 hover:text-ember-500 transition-colors"><FaTrash size={14}/></button>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-1">
          <div className="liquid-glass p-8 rounded-sm sticky top-32">
            <h3 className="text-xl font-display font-bold text-cream mb-6 text-center tracking-widest uppercase">
              {status === 'payment' ? <>Complete <span className="gold-text">Payment</span></> : <>Ready to <span className="gold-text">Serve?</span></>}
            </h3>
            
            {status === 'payment' && clientSecret && stripePromise ? (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                <StripePaymentForm 
                  orderId={orderData.orderId} 
                  amount={totalPrice} 
                  onSuccess={() => {
                    clearCart();
                    setStatus('success');
                  }} 
                />
              </Elements>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-4">
                <input name="name" required placeholder="Full Name" className="admin-input" />
                <input name="phone" required placeholder="Phone Number" className="admin-input" />
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-cream/40 uppercase tracking-widest ml-1">Select Branch</label>
                    <select 
                      name="branchId" 
                      className="admin-input cursor-pointer"
                      value={selectedBranch || ''}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      required
                    >
                      {branches.length === 0 ? (
                        <option value="" disabled>No branches found (Check Connection)</option>
                      ) : (
                        <>
                          <option value="" disabled>Select a branch</option>
                          {branches.map(b => (
                            <option key={b.id} value={b.id}>
                              {b.name} {nearestBranchId === b.id ? '(Nearest)' : ''}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                </div>

                <textarea name="address" required placeholder="Delivery Address" className="admin-input" rows={2}></textarea>
                
                <textarea 
                  name="deliveryInstructions" 
                  placeholder="Delivery Instructions (Optional e.g. Ring the bell, Leave at door)" 
                  className="admin-input" 
                  rows={2}
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                ></textarea>
                
                <div className="py-4 space-y-2">
                  <p className="text-[10px] font-bold text-cream/40 uppercase tracking-widest ml-1">Payment Method</p>
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex items-center gap-4 p-4 border rounded-sm transition-all ${paymentMethod === 'cod' ? 'border-gold-500 bg-gold-500/10 text-gold-500' : 'border-dark-border text-cream/40 hover:text-cream'}`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-charcoal rounded-sm border border-dark-border">
                        <FaTruck size={16} />
                      </div>
                      <div className="text-left">
                        <span className="block text-[10px] font-bold uppercase tracking-widest">Cash on Delivery</span>
                        <span className="block text-[9px] opacity-60">Pay when your plate arrives</span>
                      </div>
                    </button>

                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('payfast')}
                      className={`flex items-center gap-4 p-4 border rounded-sm transition-all ${paymentMethod === 'payfast' ? 'border-gold-500 bg-gold-500/10 text-gold-500' : 'border-dark-border text-cream/40 hover:text-cream'}`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-charcoal rounded-sm border border-dark-border overflow-hidden">
                        <div className="grid grid-cols-2 gap-0.5 p-1">
                          <div className="w-full h-full bg-red-600 rounded-[1px]"></div>
                          <div className="w-full h-full bg-green-600 rounded-[1px]"></div>
                        </div>
                      </div>
                      <div className="text-left flex-1">
                        <span className="block text-[10px] font-bold uppercase tracking-widest">JazzCash / EasyPaisa / Raast</span>
                        <span className="block text-[9px] opacity-60">Instant mobile wallet & bank transfer</span>
                      </div>
                    </button>

                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('stripe')}
                      className={`flex items-center gap-4 p-4 border rounded-sm transition-all ${paymentMethod === 'stripe' ? 'border-gold-500 bg-gold-500/10 text-gold-500' : 'border-dark-border text-cream/40 hover:text-cream'}`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-charcoal rounded-sm border border-dark-border">
                        <FaCreditCard size={16} />
                      </div>
                      <div className="text-left">
                        <span className="block text-[10px] font-bold uppercase tracking-widest">Credit / Debit Card</span>
                        <span className="block text-[9px] opacity-60">Visa, Mastercard (Stripe)</span>
                      </div>
                    </button>
                  </div>

                </div>

                {userPoints > 0 && (
                  <div className="py-4 border-t border-dark-border mt-4">
                    <button 
                      type="button"
                      onClick={() => setUsePoints(!usePoints)}
                      className={`w-full flex items-center justify-between p-4 border rounded-sm transition-all ${usePoints ? 'border-gold-500 bg-gold-500/10' : 'border-dark-border'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${usePoints ? 'bg-gold-500 text-charcoal' : 'bg-charcoal text-cream/20 border border-dark-border'}`}>
                          <span className="text-xs font-black">P</span>
                        </div>
                        <div className="text-left">
                          <span className={`block text-[10px] font-bold uppercase tracking-widest ${usePoints ? 'text-gold-500' : 'text-cream/40'}`}>Redeem Plate Points</span>
                          <span className="block text-[9px] text-cream/40">You have {userPoints} points</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`block text-xs font-bold ${usePoints ? 'text-gold-500' : 'text-cream/40'}`}>
                          - Rs. {Math.floor(userPoints / 10)}
                        </span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Promo Code */}
                <div className="py-4 border-t border-dark-border mt-4">
                  {!appliedPromo ? (
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Promo Code"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value)}
                          className="bg-charcoal border border-dark-border text-cream text-sm rounded-sm px-4 py-3 flex-1 focus:border-gold-500 outline-none transition-colors uppercase"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          disabled={isApplyingPromo || !promoCodeInput.trim()}
                          className="btn-gold px-6 text-[10px] tracking-widest whitespace-nowrap"
                        >
                          {isApplyingPromo ? '...' : 'APPLY'}
                        </button>
                      </div>
                      {promoError && <p className="text-ember-500 text-[10px] mt-2">{promoError}</p>}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 border border-green-500/30 bg-green-500/10 rounded-sm">
                      <div className="text-left">
                        <span className="block text-[10px] font-bold text-green-400 uppercase tracking-widest">Promo Applied</span>
                        <span className="block text-[9px] text-cream/60">{appliedPromo.code}</span>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <span className="block text-xs font-bold text-green-400">
                          - Rs. {Math.floor(promoDiscount)}
                        </span>
                        <button type="button" onClick={() => setAppliedPromo(null)} className="text-cream/30 hover:text-ember-400 transition-colors">
                          <FaTimes size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-dark-border space-y-2">
                  <h4 className="text-xs font-bold text-cream/40 uppercase tracking-widest mb-4">Bill Summary</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-cream/50">Products Price</span>
                    <span className="text-cream">Rs. {totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cream/50">Discount</span>
                    <span className={(pointsDiscount > 0 || promoDiscount > 0) ? 'text-green-400 font-bold' : 'text-cream'}>
                      {(pointsDiscount > 0 || promoDiscount > 0) ? '-' : ''} Rs. {Math.floor(pointsDiscount + promoDiscount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cream/50">Delivery Fee</span>
                    {effectiveDeliveryFee > 0 ? (
                      <span className="text-cream font-bold">Rs. {effectiveDeliveryFee}</span>
                    ) : (
                      <span className="text-green-500 font-bold uppercase tracking-tighter">Complimentary</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cream/50">Tax ({currentTaxRate}%)</span>
                    <span className="text-cream font-bold">Rs. {taxAmount}</span>
                  </div>
                  {estimatedTime && !flatDeliveryFee && (
                    <div className="flex justify-between text-sm mt-4 pt-4 border-t border-dark-border/50">
                      <span className="text-cream/50">Est. Delivery</span>
                      <span className="text-cream/70">{estimatedTime} min</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-display font-bold pt-4 mt-2 border-t border-dark-border">
                    <span className="text-cream">Total</span>
                    <span className="text-gold-500 italic">Rs. {finalTotal}</span>
                  </div>
                </div>


                <button 
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-gold w-full py-4 mt-6 uppercase tracking-[0.2em] font-black flex items-center justify-center gap-3 group"
                >
                  {status === 'submitting' ? 'Preparing...' : (
                    <>
                      <FaUtensils className="group-hover:rotate-12 transition-transform" /> {paymentMethod === 'cod' ? 'Confirm Plate' : 'Proceed to Payment'}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
