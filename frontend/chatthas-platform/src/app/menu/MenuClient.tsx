'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHero } from '@/components/UI';
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { getDisplayPrice } from '@/lib/utils';
import { getMenuItemImage } from '@/data/menuImages';

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState('');

  React.useEffect(() => {
    const target = new Date(targetDate).getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft('');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);
      
      setTimeLeft(parts.join(' '));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-1 text-xs text-ember-400 font-bold bg-ember-500/10 px-2 py-1 rounded-sm mt-2 w-fit">
      <span>⏳ Ends in {timeLeft}</span>
    </div>
  );
};

export default function MenuClient({ items, categories }: { items: any[], categories: any[] }) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || 'nashta');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = item.category_id === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  // Get the active category's hero image
  const activeCategoryData = categories.find((c: any) => c.id === activeCategory);

  return (
    <main className="bg-charcoal min-h-screen pb-20">
      <PageHero 
        title="Our Menu" 
        subtitle="Only the finest desi flavours." 
        breadcrumb="Home / Menu" 
        image="/menu_banner.png"
      />
      
      <div className="sticky top-20 z-40 bg-charcoal/90 backdrop-blur-md border-b border-dark-border py-6 mb-12">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
            <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar w-full lg:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap text-sm transition-all border ${
                    activeCategory === cat.id
                      ? 'border-gold-500 bg-gold-500/10 text-gold-500 font-bold'
                      : 'border-dark-border text-cream/40 hover:text-cream'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-72">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20" size={12} />
              <input 
                type="text" 
                placeholder="Find a dish..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-input pl-10 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((dish) => {
              const imageUrl = getMenuItemImage(dish);
              
              return (
                <motion.div
                  key={dish.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  style={{ pointerEvents: 'auto' }}
                >
                  <Link 
                    href={`/menu/${dish.slug}`}
                    className="group bg-dark-card border border-dark-border rounded-sm overflow-hidden flex flex-col hover:border-gold-500/30 transition-all h-full block card-lift"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Image Section */}
                    <div className="h-56 overflow-hidden relative pointer-events-none">
                      <Image 
                        src={imageUrl} 
                        alt={dish.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      />
                      {/* Warm film overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      {/* Tags */}
                      <div className="absolute top-3 left-3 flex gap-2 z-10">
                        {dish.badge && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-charcoal px-2 py-0.5 rounded-sm">
                            {dish.badge}
                          </span>
                        )}
                        {dish.is_featured && (
                          <span className="text-[10px] font-bold uppercase tracking-wider border border-gold-500 text-gold-500 px-2 py-0.5 rounded-sm bg-charcoal/60 backdrop-blur-sm">
                            Signature
                          </span>
                        )}
                      </div>
                      {/* Spice level indicator */}
                      {dish.spice_level > 0 && (
                        <div className="absolute bottom-3 right-3 flex gap-0.5 z-10">
                          {[1,2,3].map(i => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= dish.spice_level ? 'bg-ember-500' : 'bg-cream/20'}`} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-grow pointer-events-none flex flex-col">
                      <h3 className="font-display text-xl font-bold text-cream group-hover:text-gold-400 transition-colors leading-tight">
                        {dish.name}
                      </h3>
                      {dish.name_urdu && (
                        <p className="text-cream/30 text-sm mt-0.5 font-urdu">{dish.name_urdu}</p>
                      )}
                      {dish.description && (
                        <p className="text-cream/40 text-xs mt-2 line-clamp-2 font-body leading-relaxed">
                          {dish.description}
                        </p>
                      )}
                      <div className="mt-auto pt-4">
                        {(() => {
                          const isClient = typeof window !== 'undefined';
                          const hasActiveDiscount = isClient && dish.discount_price && dish.discount_end_date && new Date(dish.discount_end_date) > new Date();
                          
                          return (
                            <div>
                              {hasActiveDiscount ? (
                                <div className="flex items-baseline gap-2">
                                  <span className="text-gold-500 font-bold text-lg">Rs. {dish.discount_price}</span>
                                  <span className="text-cream/40 line-through text-sm">{getDisplayPrice(dish)}</span>
                                </div>
                              ) : (
                                <p className="text-gold-500 font-bold text-lg">
                                  {getDisplayPrice(dish)}
                                </p>
                              )}
                              {hasActiveDiscount && <CountdownTimer targetDate={dish.discount_end_date} />}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-4xl mb-4 opacity-20">🍽️</p>
            <p className="text-cream/40 font-body text-lg">No dishes found</p>
            <p className="text-cream/20 font-body text-sm mt-1">Try a different search or category</p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
