'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaTimes, FaImage } from 'react-icons/fa';

export default function GalleryClient({ items }: { items: any[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const categories = [
    { id: 'all', label: 'All Media' },
    { id: 'food', label: 'Our Food' },
    { id: 'interior', label: 'Restaurant Interior' },
    { id: 'experience', label: 'Customer Experience' },
    { id: 'video', label: 'Videos' }
  ];

  const filteredItems = items.filter(item => 
    activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <main className="bg-charcoal min-h-screen">
      {/* Gallery Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/ambiance.png" className="w-full h-full object-cover opacity-30" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
        </div>
        <div className="relative z-10 text-center container-custom">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-label mb-4">Visual Experience</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-display font-bold text-cream mb-6">Our Gallery</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-cream/50 max-w-2xl mx-auto font-body text-lg">A glimpse into the authentic world of Chattha's. The food, the ambiance, and the memories we create every day.</motion.p>
        </div>
      </section>

      {/* Filters */}
      <div className="container-custom py-12">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                activeCategory === cat.id 
                  ? 'bg-gold-500 border-gold-500 text-charcoal shadow-gold' 
                  : 'bg-dark-card border-dark-border text-cream/40 hover:text-cream'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[250px]">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id}
                className={`relative group overflow-hidden rounded-sm cursor-pointer ${item.span_class} bg-dark-card border border-dark-border`}
                onClick={() => setSelectedItem(item)}
              >
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    {item.type === 'video' ? <FaPlay size={10} className="text-gold-500" /> : <FaImage size={10} className="text-gold-500" />}
                    <span className="text-gold-500 text-[10px] font-bold uppercase tracking-widest">{item.category}</span>
                  </div>
                  <h3 className="text-cream font-display font-bold text-xl">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" onClick={() => setSelectedItem(null)}>
            <button className="absolute top-8 right-8 text-cream/50 hover:text-cream" onClick={() => setSelectedItem(null)}><FaTimes size={24} /></button>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
              {selectedItem.type === 'video' ? (
                <div className="aspect-video bg-black rounded-sm overflow-hidden shadow-gold-lg">
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${selectedItem.video_id}?autoplay=1`} frameBorder="0" allowFullScreen></iframe>
                </div>
              ) : (
                <img src={selectedItem.image_url} className="max-w-full max-h-[80vh] mx-auto object-contain rounded-sm shadow-gold-lg" alt="" />
              )}
              <div className="mt-8 text-center">
                <p className="text-gold-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">{selectedItem.category}</p>
                <h3 className="text-3xl font-display font-bold text-cream">{selectedItem.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
