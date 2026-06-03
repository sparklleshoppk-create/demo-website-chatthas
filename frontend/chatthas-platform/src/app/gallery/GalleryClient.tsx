'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaTimes, FaImage, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import Image from 'next/image';
import { GALLERY_ITEMS, GALLERY_CATEGORIES, type GalleryItem } from '@/data/galleryData';

export default function GalleryClient({ items }: { items: any[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [imageLoadError, setImageLoadError] = useState<Set<number>>(new Set());

  // Merge database items with static fallback — use DB items if available, otherwise use static
  const galleryItems: GalleryItem[] = useMemo(() => {
    if (items && items.length > 0) {
      return items;
    }
    return GALLERY_ITEMS;
  }, [items]);

  const filteredItems = useMemo(() => {
    return galleryItems.filter(item => 
      activeCategory === 'all' || item.category === activeCategory
    );
  }, [galleryItems, activeCategory]);

  // Lightbox navigation
  const currentIndex = useMemo(() => {
    if (!selectedItem) return -1;
    return filteredItems.findIndex(item => item.id === selectedItem.id);
  }, [selectedItem, filteredItems]);

  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    if (currentIndex === -1) return;
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % filteredItems.length 
      : (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedItem(filteredItems[newIndex]);
  }, [currentIndex, filteredItems]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null);
      if (e.key === 'ArrowRight') navigateLightbox('next');
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, navigateLightbox]);

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: galleryItems.length };
    galleryItems.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [galleryItems]);

  return (
    <main className="bg-charcoal min-h-screen">
      {/* ── Gallery Hero ── */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80&auto=format" 
            alt="Restaurant ambiance" 
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/40 to-charcoal" />
          {/* Film grain overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          }} />
        </div>

        <div className="relative z-10 text-center container-custom">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <span className="w-12 h-px bg-gold-500/50" />
            <span className="text-gold-500 text-[11px] font-bold uppercase tracking-[0.3em] font-body">Visual Experience</span>
            <span className="w-12 h-px bg-gold-500/50" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-cream mb-6 leading-[1.05]"
          >
            Our <span className="gold-text">Gallery</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-cream/50 max-w-2xl mx-auto font-body text-lg leading-relaxed"
          >
            A glimpse into the authentic world of Chattha&apos;s — the food, the ambiance, the craft, and the people who make it all happen.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center gap-12 mt-12"
          >
            {[
              { value: galleryItems.length.toString() + '+', label: 'Photos' },
              { value: '4', label: 'Categories' },
              { value: '4', label: 'Branches' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl font-bold gold-text">{stat.value}</p>
                <p className="text-cream/30 text-xs font-body tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Category Filters ── */}
      <div className="container-custom py-12">
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {GALLERY_CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 border flex items-center gap-2 ${
                activeCategory === cat.id 
                  ? 'bg-gold-500 border-gold-500 text-charcoal shadow-gold' 
                  : 'bg-dark-card border-dark-border text-cream/40 hover:text-cream hover:border-cream/20'
              }`}
            >
              <span className="text-xs">{cat.icon}</span>
              {cat.label}
              <span className={`text-[10px] font-bold ml-1 ${
                activeCategory === cat.id ? 'text-charcoal/60' : 'text-cream/20'
              }`}>
                {categoryCounts[cat.id] || 0}
              </span>
            </motion.button>
          ))}
        </div>

        {/* ── Masonry Grid ── */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[250px]"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                key={item.id}
                className={`relative group overflow-hidden rounded-sm cursor-pointer ${item.span_class || ''} bg-dark-card border border-dark-border hover:border-gold-500/30`}
                onClick={() => setSelectedItem(item)}
              >
                {/* Image */}
                <Image 
                  src={imageLoadError.has(item.id) ? '/ambiance.png' : item.image_url} 
                  alt={item.title} 
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110 brightness-[0.85] group-hover:brightness-100"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  onError={() => setImageLoadError(prev => new Set(prev).add(item.id))}
                />

                {/* Warm film tint */}
                <div className="absolute inset-0 bg-amber-900/10 group-hover:bg-transparent transition-colors duration-500" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 mb-2">
                      {item.type === 'video' ? (
                        <FaPlay size={9} className="text-gold-500" />
                      ) : (
                        <FaImage size={9} className="text-gold-500" />
                      )}
                      <span className="text-gold-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                        {GALLERY_CATEGORIES.find(c => c.id === item.category)?.label || item.category}
                      </span>
                    </div>
                    <h3 className="text-cream font-display font-bold text-xl leading-tight">{item.title}</h3>
                  </div>
                  
                  {/* Expand icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-charcoal/60 backdrop-blur-sm border border-cream/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                    <FaExpand size={12} className="text-cream/60" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <p className="text-5xl mb-4 opacity-15">📷</p>
            <p className="text-cream/40 font-body text-lg">No photos in this category yet</p>
          </motion.div>
        )}
      </div>

      {/* ── CTA Section ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a1e08] via-charcoal to-[#1a0808] opacity-50" />
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold-500 text-[11px] font-bold uppercase tracking-[0.3em] mb-4">Share Your Experience</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">
              Tag us <span className="gold-text">@chatthastheauthentic</span>
            </h2>
            <p className="text-cream/40 font-body max-w-lg mx-auto leading-relaxed">
              Share your Chattha&apos;s moments on Instagram and get featured in our gallery.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <a 
                href="https://instagram.com/chatthastheauthentic" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-gold"
              >
                Follow on Instagram
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/97 p-4" 
            onClick={() => setSelectedItem(null)}
          >
            {/* Close button */}
            <button 
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-cream/5 hover:bg-cream/10 border border-cream/10 flex items-center justify-center transition-all group" 
              onClick={() => setSelectedItem(null)}
            >
              <FaTimes size={16} className="text-cream/50 group-hover:text-cream transition-colors" />
            </button>

            {/* Navigation: Previous */}
            <button 
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-cream/5 hover:bg-cream/10 border border-cream/10 flex items-center justify-center transition-all group"
              onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
            >
              <FaChevronLeft size={14} className="text-cream/50 group-hover:text-cream transition-colors" />
            </button>

            {/* Navigation: Next */}
            <button 
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-cream/5 hover:bg-cream/10 border border-cream/10 flex items-center justify-center transition-all group"
              onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
            >
              <FaChevronRight size={14} className="text-cream/50 group-hover:text-cream transition-colors" />
            </button>

            {/* Image Content */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              key={selectedItem.id}
              className="max-w-5xl w-full" 
              onClick={e => e.stopPropagation()}
            >
              {selectedItem.type === 'video' ? (
                <div className="aspect-video bg-black rounded-sm overflow-hidden shadow-gold-lg">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${selectedItem.video_id}?autoplay=1`} 
                    frameBorder="0" 
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-sm overflow-hidden shadow-gold-lg">
                  <Image 
                    src={selectedItem.image_url} 
                    alt={selectedItem.title}
                    fill
                    className="object-contain"
                    sizes="90vw"
                    priority
                  />
                </div>
              )}
              <div className="mt-8 text-center">
                <p className="text-gold-500 text-[10px] font-bold uppercase tracking-[0.25em] mb-2">
                  {GALLERY_CATEGORIES.find(c => c.id === selectedItem.category)?.label || selectedItem.category}
                </p>
                <h3 className="text-3xl font-display font-bold text-cream">{selectedItem.title}</h3>
                <p className="text-cream/20 text-xs mt-3 font-body">
                  {currentIndex + 1} of {filteredItems.length} • Press ← → to navigate
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
