import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaCheckCircle, FaMinus, FaPlus, FaShoppingBag, FaMobileAlt, FaCreditCard, FaMoneyBillWave, FaGlobe, FaLock, FaMapMarkerAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { apiClient } from '../api/client';
import { PageHero, FadeUp } from '../components/UI';
import GoogleLocationPicker from '../components/GoogleLocationPicker';
import * as OLCModule from 'open-location-code';

const OpenLocationCode = 
  OLCModule.OpenLocationCode || 
  OLCModule.default?.OpenLocationCode || 
  OLCModule.default;


const GATEWAY_ICONS = {
  cod: FaMoneyBillWave,
  jazzcash: FaMobileAlt,
  easypaisa: FaMobileAlt,
  stripe: FaCreditCard,
  custom: FaGlobe,
  other: FaGlobe,
};

const GATEWAY_COLORS = {
  cod: 'text-gold-500',
  jazzcash: 'text-red-400',
  easypaisa: 'text-green-400',
  stripe: 'text-purple-400',
  custom: 'text-blue-400',
  other: 'text-blue-400',
};

// Haversine formula to calculate distance between two coordinates in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

export default function CheckoutPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    deliveryMethod: 'delivery',
    branch_id: '',
    paymentMethod: 'cod',
    delivery_lat: null,
    delivery_lng: null,
    delivery_plus_code: '',
    delivery_place_id: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [availableGateways, setAvailableGateways] = useState([
    { id: 'cod', name: 'Cash on Delivery', enabled: true, type: 'cod' }
  ]);

  const [branches, setBranches] = useState([]);
  const [zones, setZones] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  
  // Map state
  const [mapPosition, setMapPosition] = useState({ lat: 33.6844, lng: 73.0479 }); // Default F-10, Islamabad
  const [showMapModal, setShowMapModal] = useState(true); // Show immediately for location
  const [locationError, setLocationError] = useState('');

  // Auto-assign branch logic
  const assignBranch = (lat, lng) => {
    if (!lat || !lng || branches.length === 0) return;
    
    // First try to find a zone that contains this distance
    let bestZone = null;
    let closestBranch = null;
    let minDistance = Infinity;

    for (const branch of branches) {
      const dist = calculateDistance(lat, lng, branch.latitude, branch.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        closestBranch = branch;
      }

      // Check zones for this branch
      const branchZones = zones.filter(z => z.branch_id === branch.id);
      for (const zone of branchZones) {
        if (dist >= zone.min_distance_km && dist <= zone.max_distance_km) {
          // Found an applicable zone
          if (!bestZone || dist < minDistance) {
            bestZone = { branch, zone, distance: dist };
          }
        }
      }
    }

    if (bestZone) {
      setFormData(prev => ({ ...prev, branch_id: bestZone.branch.id }));
    } else if (closestBranch) {
      // Fallback to closest if no zone matches perfectly but we have coordinates
      setFormData(prev => ({ ...prev, branch_id: closestBranch.id }));
    }
  };

  const handlePositionChange = (pos, placeDetails) => {
    setMapPosition(pos);
    setLocationError('');
    if (placeDetails?.formatted_address) {
      setFormData((prev) => ({
        ...prev,
        address: placeDetails.formatted_address,
        delivery_place_id: placeDetails.place_id || '',
      }));
    }
  };

  const handleMapConfirm = () => {
    if (mapPosition) {
      let plusCode = '';
      try {
        if (typeof OpenLocationCode === 'function') {
          const olc = new OpenLocationCode();
          plusCode = olc.encode(mapPosition.lat, mapPosition.lng, 10);
        } else if (OpenLocationCode && typeof OpenLocationCode.encode === 'function') {
          plusCode = OpenLocationCode.encode(mapPosition.lat, mapPosition.lng, 10);
        }
      } catch (err) {
        console.error('Error generating plus code:', err);
      }

      try {
        setFormData((prev) => ({
          ...prev,
          delivery_lat: mapPosition.lat,
          delivery_lng: mapPosition.lng,
          delivery_plus_code: plusCode,
        }));
        assignBranch(mapPosition.lat, mapPosition.lng);
      } catch (err) {
        console.error('Error assigning branch:', err);
      }

      setShowMapModal(false);
    } else {
      setLocationError('Please search, use your location, or tap the map to set a delivery pin.');
    }
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const [paymentRes, branchesRes] = await Promise.all([
          apiClient('/payment-config').catch(() => null),
          apiClient('/branches').catch(() => null)
        ]);

        if (paymentRes && paymentRes.methods) {
          setAvailableGateways(paymentRes.methods.filter(m => m.enabled));
          const enabledMethods = paymentRes.methods.filter(m => m.enabled);
          if (enabledMethods.length > 0 && !enabledMethods.find(m => m.id === formData.paymentMethod)) {
            setFormData(prev => ({ ...prev, paymentMethod: enabledMethods[0].id }));
          }
        }

        if (branchesRes && branchesRes.branches) {
          setBranches(branchesRes.branches);
          setZones(branchesRes.zones || []);
        }

      } catch (error) {
        console.error('Failed to load configuration:', error);
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchConfig();
  }, []);

  const deliveryFee = formData.deliveryMethod === 'delivery' ? 150 : 0;
  const tax = cartTotal * 0.16; // 16% GST
  const grandTotal = cartTotal + deliveryFee + tax - discount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'CHATTHA10') {
      setDiscount(cartTotal * 0.1);
      setPromoError('');
    } else {
      setPromoError('Invalid or expired promo code');
      setDiscount(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (formData.deliveryMethod === 'delivery' && (!formData.delivery_lat || !formData.delivery_lng)) {
      alert("Please select your delivery location on the map.");
      setShowMapModal(true);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        formData,
        cartItems,
        cartTotal,
        deliveryFee,
        tax,
        discount,
        grandTotal
      };
      
      const data = await apiClient('/orders', {
        body: payload
      });
      
      if (data.success) {
        clearCart();
        navigate('/order-success', { 
          state: { 
            orderNumber: data.orderNumber,
            total: grandTotal,
            paymentMethod: formData.paymentMethod
          }
        });
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to place order: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-primary-black pt-32 pb-24">
        <div className="container-custom flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-dark-card rounded-full flex items-center justify-center mb-6">
            <FaShoppingBag className="text-4xl text-cream/30" />
          </div>
          <h2 className="font-display text-4xl text-cream mb-4 font-light italic">Your cart is empty</h2>
          <p className="text-cream/50 mb-8 font-body">Add some delicious items from our menu to begin your order.</p>
          <Link to="/menu" className="btn-gold">Explore Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-black">
      <Helmet>
        <title>Checkout — Chattha's</title>
      </Helmet>

      <PageHero title="Checkout" subtitle="Complete your order" breadcrumb="Home / Cart / Checkout" />

      {/* Map Modal for Location Selection */}
      <AnimatePresence>
        {showMapModal && formData.deliveryMethod === 'delivery' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-primary-black/95 backdrop-blur-md"
          >
            <div className="bg-charcoal border border-gold-500/30 rounded-sm w-full max-w-7xl overflow-hidden shadow-2xl flex flex-col h-[min(95vh,960px)] min-h-[75vh]">
              <div className="p-6 border-b border-dark-border flex justify-between items-center bg-dark-card">
                <div>
                  <h3 className="font-display text-2xl text-gold-500 italic">Select Delivery Location</h3>
                  <p className="text-cream/60 text-sm mt-1 max-w-xl">
                    Search with Google Maps, use GPS, or tap the map. Your address will be filled automatically.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowMapModal(false)} 
                  className="text-cream/50 hover:text-cream text-3xl font-light p-2 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>
              
              <div className="flex-1 min-h-0 flex flex-col">
                <GoogleLocationPicker
                  position={mapPosition}
                  onPositionChange={handlePositionChange}
                  className="flex-1 min-h-[60vh]"
                />
              </div>

              <div className="p-5 sm:p-6 border-t border-dark-border bg-charcoal shrink-0">
                {locationError && <p className="text-ember-500 text-sm mb-3">{locationError}</p>}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                  <div className="text-sm font-body text-cream/70 flex-1">
                    {mapPosition ? (
                      <>
                        <span className="text-gold-500 font-bold block mb-1">Pinned coordinates</span>
                        {mapPosition.lat.toFixed(5)}, {mapPosition.lng.toFixed(5)}
                        {formData.address && (
                          <span className="block mt-2 text-cream/80">{formData.address}</span>
                        )}
                      </>
                    ) : (
                      'Search for your address or tap anywhere on the map.'
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleMapConfirm}
                    className="btn-gold w-full sm:w-auto shrink-0 px-10"
                  >
                    Confirm Location
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="py-16">
        <div className="container-custom">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Form Details */}
            <div className="lg:col-span-7 space-y-10">
              
              <FadeUp>
                <div className="bg-charcoal p-8 border border-dark-border/50 rounded-[4px] card-lift">
                  <h3 className="font-display text-2xl font-light italic text-cream mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center text-sm font-bold border border-gold-500/20">1</span>
                    Order Details
                  </h3>
                  
                  {/* Delivery / Pickup Toggle */}
                  <div className="flex gap-4 mb-8 bg-primary-black p-2 rounded-[4px] border border-dark-border">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, deliveryMethod: 'delivery'})}
                      className={`flex-1 py-3 text-[11px] uppercase tracking-[0.2em] font-semibold rounded-[2px] transition-all ${
                        formData.deliveryMethod === 'delivery' ? 'bg-gold-500 text-primary-black shadow-md' : 'text-cream/50 hover:text-cream'
                      }`}
                    >
                      Delivery
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setFormData({...formData, deliveryMethod: 'pickup'});
                        setShowMapModal(false);
                      }}
                      className={`flex-1 py-3 text-[11px] uppercase tracking-[0.2em] font-semibold rounded-[2px] transition-all ${
                        formData.deliveryMethod === 'pickup' ? 'bg-gold-500 text-primary-black shadow-md' : 'text-cream/50 hover:text-cream'
                      }`}
                    >
                      Pickup
                    </button>
                  </div>

                  {formData.deliveryMethod === 'delivery' && (
                    <div className="mb-8 p-4 bg-primary-black border border-gold-500/30 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <p className="text-[10px] text-gold-500 uppercase tracking-widest font-bold mb-1">
                          <FaMapMarkerAlt className="inline mr-1" /> Delivery location (Google Maps)
                        </p>
                        {formData.delivery_lat ? (
                          <>
                            <p className="text-sm font-body text-cream/80 line-clamp-2">{formData.address || 'Address pinned'}</p>
                            <p className="text-xs text-cream/40 mt-1">Plus Code: {formData.delivery_plus_code}</p>
                          </>
                        ) : (
                          <p className="text-sm font-body text-cream/50">Required — pick your exact delivery point on the map.</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowMapModal(true)}
                        className="btn-outline-gold text-[10px] whitespace-nowrap shrink-0"
                      >
                        {formData.delivery_lat ? 'Change on map' : 'Open map'}
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[10px] font-bold text-cream/50 uppercase tracking-widest mb-2 ml-1">Full Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        className="w-full bg-primary-black border border-dark-border rounded-[4px] px-4 py-3.5 text-cream font-body text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all" 
                        placeholder="e.g. Ali Khan" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-cream/50 uppercase tracking-widest mb-2 ml-1">Phone Number *</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        required 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        className="w-full bg-primary-black border border-dark-border rounded-[4px] px-4 py-3.5 text-cream font-body text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all" 
                        placeholder="e.g. 0300 1234567" 
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-[10px] font-bold text-cream/50 uppercase tracking-widest mb-2 ml-1">Select Branch *</label>
                    <select 
                      name="branch_id" 
                      required 
                      value={formData.branch_id} 
                      onChange={handleInputChange} 
                      className="w-full bg-primary-black border border-dark-border rounded-[4px] px-4 py-3.5 text-cream font-body text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all appearance-none"
                    >
                      <option value="" disabled>-- Choose a Branch --</option>
                      {loadingConfig ? (
                        <option value="" disabled>Loading branches...</option>
                      ) : (
                        branches.map(branch => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name} {formData.branch_id === branch.id ? '(Auto-Assigned)' : ''}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {formData.deliveryMethod === 'delivery' && (
                    <div className="mb-6">
                      <label className="block text-[10px] font-bold text-cream/50 uppercase tracking-widest mb-2 ml-1">Delivery Address *</label>
                      <textarea 
                        name="address" 
                        required 
                        rows="3" 
                        value={formData.address} 
                        onChange={handleInputChange} 
                        className="w-full bg-primary-black border border-dark-border rounded-[4px] px-4 py-3.5 text-cream font-body text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all resize-none" 
                        placeholder="House / Street / Sector details" 
                      ></textarea>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-cream/50 uppercase tracking-widest mb-2 ml-1">Special Instructions</label>
                    <textarea 
                      name="notes" 
                      rows="2" 
                      value={formData.notes} 
                      onChange={handleInputChange} 
                      className="w-full bg-primary-black border border-dark-border rounded-[4px] px-4 py-3.5 text-cream font-body text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all resize-none" 
                      placeholder="Any allergies or specific prep instructions?" 
                    ></textarea>
                  </div>

                </div>
              </FadeUp>

              <FadeUp delay={0.1}>
                <div className="bg-charcoal p-8 border border-dark-border/50 rounded-[4px] card-lift">
                  <h3 className="font-display text-2xl font-light italic text-cream mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center text-sm font-bold border border-gold-500/20">2</span>
                    Payment Method
                  </h3>

                  <div className="space-y-4">
                    {loadingConfig ? (
                       <div className="animate-pulse bg-primary-black h-16 rounded-[4px] border border-dark-border"></div>
                    ) : availableGateways.map((gw) => {
                      const Icon = GATEWAY_ICONS[gw.type] || GATEWAY_ICONS.other;
                      const colorClass = GATEWAY_COLORS[gw.type] || GATEWAY_COLORS.other;

                      return (
                        <label 
                          key={gw.id} 
                          className={`flex items-center justify-between p-4 rounded-[4px] border cursor-pointer transition-all ${
                            formData.paymentMethod === gw.id 
                              ? 'bg-primary-black border-gold-500/50 shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                              : 'bg-primary-black border-dark-border hover:border-gold-500/30'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              formData.paymentMethod === gw.id ? 'border-gold-500' : 'border-dark-border'
                            }`}>
                              {formData.paymentMethod === gw.id && <div className="w-2.5 h-2.5 bg-gold-500 rounded-full" />}
                            </div>
                            <div className="flex items-center gap-3">
                              <Icon className={`text-xl ${colorClass}`} />
                              <span className="font-display font-medium text-cream">{gw.name}</span>
                            </div>
                          </div>
                          {gw.type === 'stripe' && <div className="flex gap-1 text-cream/40"><FaCreditCard /></div>}
                        </label>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 flex items-start gap-3 p-4 bg-primary-black/50 border border-dark-border rounded-[4px]">
                    <FaLock className="text-gold-500 mt-0.5 opacity-70" />
                    <p className="text-xs font-body text-cream/50 leading-relaxed">
                      All transactions are secure and encrypted. Card payments are processed via our secure payment gateway.
                    </p>
                  </div>
                </div>
              </FadeUp>

            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <FadeUp delay={0.2} className="sticky top-24">
                <div className="bg-charcoal border border-dark-border/50 rounded-[4px] p-8 shadow-2xl">
                  <h3 className="font-display text-2xl font-light italic text-cream mb-6 border-b border-dark-border pb-4">Order Summary</h3>
                  
                  <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 bg-primary-black rounded-[4px] overflow-hidden flex-shrink-0 border border-dark-border">
                          <img src={item.image || 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=200'} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-display text-sm font-bold text-cream line-clamp-1">{item.name}</h4>
                            <span className="font-display text-sm text-gold-500 font-bold whitespace-nowrap ml-2">Rs. {parseInt(item.price.replace(/[^0-9]/g, ''), 10) * item.quantity}</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3 bg-primary-black rounded-[2px] px-2 py-1 border border-dark-border">
                              <button type="button" onClick={() => updateQuantity(item.id, -1)} className="text-cream/50 hover:text-gold-500 p-1"><FaMinus size={8} /></button>
                              <span className="font-body text-xs font-bold text-cream w-3 text-center">{item.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(item.id, 1)} className="text-cream/50 hover:text-gold-500 p-1"><FaPlus size={8} /></button>
                            </div>
                            <button type="button" onClick={() => removeFromCart(item.id)} className="text-cream/30 hover:text-ember-500 p-1 transition-colors"><FaTrash size={10} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Gift card or discount code" 
                        className="flex-1 bg-primary-black border border-dark-border rounded-[4px] px-4 py-2.5 text-cream font-body text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none uppercase placeholder:normal-case"
                      />
                      <button 
                        type="button" 
                        onClick={handleApplyPromo}
                        className="bg-dark-border text-cream px-4 py-2.5 rounded-[4px] text-[10px] uppercase tracking-widest font-bold hover:bg-gold-500 hover:text-primary-black transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && <p className="text-ember-500 text-xs mt-2 font-body">{promoError}</p>}
                    {discount > 0 && <p className="text-green-500 text-xs mt-2 font-body flex items-center gap-1"><FaCheckCircle /> Promo code applied successfully</p>}
                  </div>

                  <div className="space-y-3 font-body text-sm text-cream/70 border-t border-dark-border pt-6 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-cream font-bold">Rs. {cartTotal}</span>
                    </div>
                    {formData.deliveryMethod === 'delivery' && (
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span className="text-cream font-bold">Rs. {deliveryFee}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>GST (16%)</span>
                      <span className="text-cream font-bold">Rs. {tax.toFixed(0)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-gold-500">
                        <span>Discount</span>
                        <span className="font-bold">- Rs. {discount.toFixed(0)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-end border-t border-dark-border pt-6 mb-8">
                    <span className="font-display text-lg text-cream">Grand Total</span>
                    <span className="font-display text-3xl font-bold text-gold-500 leading-none">Rs. {grandTotal.toFixed(0)}</span>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`btn-gold w-full justify-center text-[12px] h-14 shadow-gold-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Processing Order...' : 'Place Order Now'}
                  </button>
                </div>
              </FadeUp>
            </div>
            
          </form>
        </div>
      </section>
    </div>
  );
}
