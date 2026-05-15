'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHero } from '@/components/UI';
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { getDisplayPrice } from '@/lib/utils';

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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((dish) => (
              <motion.div
                key={dish.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Link 
                  href={`/menu/${dish.slug}`}
                  className="group bg-dark-card border border-dark-border rounded-sm overflow-hidden flex flex-col hover:border-gold-500/30 transition-all h-full"
                >
                  <div className="h-48 overflow-hidden bg-charcoal relative">
                    {dish.image_url ? (
                      <Image 
                        src={dish.image_url} 
                        alt={dish.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 20vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2a1e08] to-[#1a1206]">
                        <span className="text-4xl opacity-10">🍽️</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-grow">
                    <h3 className="font-display text-lg font-bold text-cream group-hover:text-gold-400 transition-colors">{dish.name}</h3>
                    <p className="text-gold-500 font-bold mt-1">
                      {getDisplayPrice(dish)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
