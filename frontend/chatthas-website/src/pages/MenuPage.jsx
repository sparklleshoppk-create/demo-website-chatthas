import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHero, FadeUp, Tag, SpiceLevel } from '../components/UI';
import { FaArrowRight, FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { apiClient } from '../api/client';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('nashta');
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [menuData, setMenuData] = useState({ categories: [], items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (selectedDish) {
      const initialVariants = {};
      if (selectedDish.variants && Array.isArray(selectedDish.variants)) {
        selectedDish.variants.forEach(group => {
          if (group.options && group.options.length > 0) {
            initialVariants[group.name] = group.options[0];
          }
        });
      }
      setSelectedVariants(initialVariants);
      setSelectedAddons([]);
    }
  }, [selectedDish]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await apiClient('/menu');
        if (data.categories) {
          setMenuData(data);
          if (data.categories.length > 0) {
            setActiveCategory(data.categories[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems = menuData.items.filter((item) => item.category === activeCategory);

  const handleAddonToggle = (addon) => {
    setSelectedAddons(prev => 
      prev.find(a => a.name === addon.name)
        ? prev.filter(a => a.name !== addon.name)
        : [...prev, addon]
    );
  };

  const calculateModalPrice = () => {
    if (!selectedDish) return 0;
    
    let base = typeof selectedDish.price === 'string' ? parseInt(selectedDish.price.replace(/[^0-9]/g, '')) : selectedDish.price;
    
    let variantTotal = 0;
    if (selectedVariants) {
      Object.values(selectedVariants).forEach(opt => {
        if (opt && opt.price_adjustment) {
          variantTotal += Number(opt.price_adjustment);
        }
      });
    }

    const addonsTotal = selectedAddons.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
    return base + variantTotal + addonsTotal;
  };

  return (
    <>
      <Helmet>
        <title>Menu — Chattha's Restaurant</title>
        <meta name="description" content="Explore Chattha's authentic Pakistani menu. From our famous Halwa Puri breakfast to Desi Ghee Karahi and Biryani." />
      </Helmet>
      
      {/* Cinematic Page Hero */}
      <PageHero title="Our Collection" subtitle="A curation of Pakistan's finest flavors, prepared with absolute intention." breadcrumb="Home / Menu" />

      <section className="bg-primary-black min-h-screen relative pb-32">
        {/* Sticky Category Navigation */}
        <div className="sticky top-[88px] z-30 bg-primary-black/80 backdrop-blur-xl border-y border-dark-border py-4 mb-16 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="container-custom">
            <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar">
              {isLoading ? (
                <div className="flex gap-4">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-32 h-10 bg-white/5 animate-pulse rounded-sm" />
                  ))}
                </div>
              ) : (
                menuData.categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-none whitespace-nowrap text-[11px] uppercase tracking-[0.15em] transition-all duration-300 border ${
                      activeCategory === cat.id
                        ? 'border-gold-500 bg-gold-500/10 text-gold-500 font-semibold shadow-gold'
                        : 'border-dark-border text-cream/50 hover:text-cream hover:border-cream/30'
                    }`}
                  >
                    <span className="text-base grayscale opacity-80">{cat.icon}</span> {cat.label}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="container-custom">
          <FadeUp>
             <h2 className="font-display text-4xl text-cream italic font-light mb-10 border-b border-dark-border/50 pb-4">
                {menuData.categories.find(c => c.id === activeCategory)?.label || 'Loading...'}
             </h2>
          </FadeUp>

          {/* 60/40 Menu Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {isLoading ? (
                [1,2,3,4].map(i => (
                  <div key={i} className="h-48 bg-white/5 animate-pulse rounded-sm" />
                ))
              ) : filteredItems.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <p className="text-cream/30 uppercase tracking-[0.3em]">No items available in this category</p>
                </div>
              ) : (
                filteredItems.map((dish) => (
                  <div
                    key={dish.id}
                    onClick={() => setSelectedDish(dish)}
                    className="group bg-charcoal border border-dark-border hover:border-gold-500/30 transition-all duration-500 flex flex-col sm:flex-row h-full overflow-hidden cursor-pointer rounded-[2px] card-lift"
                  >
                  {/* 40% Image Side */}
                  <div className="w-full sm:w-[40%] h-48 sm:h-auto bg-primary-black relative overflow-hidden flex-shrink-0">
                     <div 
                        className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700 ease-[0.22,1,0.36,1]" 
                        style={{ backgroundImage: `url(${dish.image_url || 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?q=80&w=800&auto=format&fit=crop'})` }}
                     />
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent to-charcoal sm:opacity-100 opacity-0" />
                     <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent sm:opacity-0 opacity-100" />
                     
                     <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {dish.badge && <Tag type={dish.badge} label={dish.badge} />}
                        {(dish.dietary_flags || []).map(f => (
                           <span key={f} className="bg-green-500/20 text-green-400 text-[8px] uppercase tracking-widest px-2 py-1 backdrop-blur-md border border-green-500/30">{f}</span>
                        ))}
                     </div>
                  </div>

                  {/* 60% Content Side */}
                  <div className="w-full sm:w-[60%] p-6 md:p-8 flex flex-col justify-between relative z-10 bg-charcoal sm:bg-transparent">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="font-body text-xl md:text-2xl font-bold text-cream group-hover:text-gold-400 transition-colors leading-tight">
                          {dish.name}
                        </h3>
                        <span className="font-body font-bold text-gold-500 text-lg md:text-xl whitespace-nowrap">
                          {dish.price}
                        </span>
                      </div>
                      
                      {dish.nameUrdu && (
                         <p className="font-urdu text-cream/30 text-sm mb-4">{dish.nameUrdu}</p>
                      )}

                      <div className="mb-4">
                        {dish.spice > 0 && <SpiceLevel level={dish.spice} />}
                      </div>

                      <p className="text-cream/50 text-sm font-body leading-relaxed mb-6 line-clamp-3">
                        {dish.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-semibold text-gold-500 group-hover:text-gold-300 transition-colors uppercase tracking-[0.2em] mt-auto pt-4 border-t border-dark-border/50">
                      Explore Details <FaArrowRight size={10} />
                    </div>
                  </div>
                </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Immersive Product Modal */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <div className="absolute inset-0 bg-primary-black/90 backdrop-blur-xl" onClick={() => setSelectedDish(null)} />
            
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-charcoal w-full max-w-5xl max-h-[90vh] overflow-y-auto overflow-x-hidden border border-dark-border/50 rounded-[2px] shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedDish(null)} 
                className="absolute top-6 right-6 z-20 text-cream/50 hover:text-cream bg-primary-black/50 p-2 rounded-full backdrop-blur-md transition-colors"
              >
                <FaTimes size={16} />
              </button>
              
              {/* Image Side (50%) */}
              <div className="w-full md:w-1/2 h-64 md:h-auto bg-primary-black relative">
                 <div 
                    className="absolute inset-0 bg-cover bg-center opacity-80" 
                    style={{ backgroundImage: `url(${selectedDish.image_url || 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?q=80&w=1200&auto=format&fit=crop'})` }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent md:hidden" />
              </div>
              
              {/* Content Side (50%) */}
              <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col relative z-10">
                <p className="text-gold-500 text-[10px] tracking-[0.3em] uppercase mb-3">
                  {menuData.categories.find(c => c.id === selectedDish.category)?.label} Collection
                </p>
                <h2 className="font-heading2 text-3xl md:text-4xl lg:text-5xl font-bold text-cream mb-2 leading-[1.1]">
                  {selectedDish.name}
                </h2>
                {selectedDish.nameUrdu && (
                   <p className="font-urdu text-cream/30 text-lg mb-6">{selectedDish.nameUrdu}</p>
                )}
                
                <span className="font-body font-bold text-2xl md:text-3xl text-gold-500 mb-6 pb-6 border-b border-dark-border/50 block">
                  Rs. {calculateModalPrice().toLocaleString()}
                </span>
                
                <div className="mb-8 space-y-6 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                  {/* Variants */}
                  {selectedDish.variants && selectedDish.variants.length > 0 && (
                    <div className="space-y-4">
                      {selectedDish.variants.map((group) => (
                        <div key={group.name}>
                          <p className="text-[10px] text-cream/40 uppercase tracking-widest mb-3">{group.name}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {group.options.map((opt) => {
                              const isSelected = selectedVariants?.[group.name]?.name === opt.name;
                              return (
                                <button
                                  key={opt.name}
                                  onClick={() => setSelectedVariants(prev => ({ ...prev, [group.name]: opt }))}
                                  className={`p-3 text-[11px] uppercase tracking-widest border transition-all ${
                                    isSelected 
                                      ? 'border-gold-500 bg-gold-500/10 text-gold-500' 
                                      : 'border-dark-border text-cream/50 hover:border-cream/30'
                                  }`}
                                >
                                  {opt.name} {opt.price_adjustment > 0 ? `(+Rs. ${opt.price_adjustment})` : ''}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Addons */}
                  {selectedDish.addons && selectedDish.addons.length > 0 && (
                    <div>
                      <p className="text-[10px] text-cream/40 uppercase tracking-widest mb-3">Add Ons</p>
                      <div className="space-y-2">
                        {selectedDish.addons.map((addon) => (
                          <button
                            key={addon.name}
                            onClick={() => handleAddonToggle(addon)}
                            className={`flex justify-between items-center w-full p-3 text-[11px] uppercase tracking-widest border transition-all ${
                              selectedAddons.find(a => a.name === addon.name)
                                ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                                : 'border-dark-border text-cream/50 hover:border-cream/30'
                            }`}
                          >
                            <span>{addon.name}</span>
                            <span>+Rs. {addon.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description fallback if no variants/addons */}
                  <p className="text-cream/70 font-body text-[14px] leading-[1.8]">
                    {selectedDish.description}
                  </p>
                  
                  {/* Dietary Flags */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    {(selectedDish.dietary_flags || []).map(f => (
                      <span key={f} className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] uppercase tracking-widest rounded-full">
                        🌿 {f}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const variantNames = selectedVariants && Object.keys(selectedVariants).length > 0 
                      ? Object.values(selectedVariants).map(opt => opt.name).join(', ') 
                      : '';
                    const addonNames = selectedAddons.length > 0 
                      ? selectedAddons.map(a => a.name).join(', ') 
                      : '';
                      
                    let displayName = selectedDish.name;
                    if (variantNames) displayName += ` - ${variantNames}`;
                    if (addonNames) displayName += ` (+${addonNames})`;

                    const itemToAdd = {
                      ...selectedDish,
                      id: `${selectedDish.id}-${variantNames.replace(/, /g, '-') || 'default'}-${addonNames.replace(/, /g, '-')}`,
                      name: displayName,
                      original_id: selectedDish.id,
                      price: `Rs. ${calculateModalPrice()}`,
                      variants: selectedVariants,
                      selectedAddons: selectedAddons
                    };
                    addToCart(itemToAdd);
                    setSelectedDish(null);
                  }}
                  className="btn-gold w-full justify-center mt-auto"
                >
                  Add to Cart — Rs. {calculateModalPrice().toLocaleString()}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
