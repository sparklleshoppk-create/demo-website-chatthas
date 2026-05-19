import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { PageHero, FadeUp } from '../components/UI';
import { BRAND } from '../data/brandData';
import { FaPlay, FaTimes, FaImage } from 'react-icons/fa';

import { apiClient } from '../api/client';

const categories = [
  { id: 'all', label: 'All Media' },
  { id: 'food', label: 'Our Food' },
  { id: 'interior', label: 'Restaurant Interior' },
  { id: 'experience', label: 'Customer Experience' },
  { id: 'video', label: 'Videos & Reels' }
];

const staticGalleryItems = [
  { id: 1, type: 'image', category: 'food', src: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Signature Biryani', span: 'col-span-1 row-span-1' },
  { id: 2, type: 'image', category: 'interior', src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'F-10 Flagship Interior', span: 'col-span-1 row-span-2' },
  { id: 3, type: 'video', category: 'video', src: 'https://images.unsplash.com/photo-1544025162-8482436151f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Karahi Preparation', span: 'col-span-1 row-span-1', videoId: 'dQw4w9WgXcQ' },
  { id: 4, type: 'image', category: 'food', src: 'https://images.unsplash.com/photo-1544025162-8482436151f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Desi Ghee Karahi', span: 'col-span-2 row-span-2' },
  { id: 5, type: 'image', category: 'experience', src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Family Gatherings', span: 'col-span-1 row-span-1' },
  { id: 6, type: 'image', category: 'interior', src: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Beverly Centre Branch', span: 'col-span-1 row-span-1' },
  { id: 7, type: 'video', category: 'video', src: 'https://images.unsplash.com/photo-1544025162-8482436151f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Customer Reactions', span: 'col-span-1 row-span-2', videoId: 'dQw4w9WgXcQ' },
  { id: 8, type: 'image', category: 'food', src: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Nihari', span: 'col-span-1 row-span-1' },
  { id: 9, type: 'image', category: 'experience', src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Outdoor Dining', span: 'col-span-2 row-span-1' },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [dynamicItems, setDynamicItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchGallery = async () => {
      try {
        const data = await apiClient('/gallery');
        if (data && data.images && data.images.length > 0) {
          const formatted = data.images.map((img, index) => {
            // Elegant masonry layout calculation
            let span = 'col-span-1 row-span-1';
            if (index % 5 === 0) span = 'col-span-2 row-span-2';
            else if (index % 7 === 0) span = 'col-span-1 row-span-2';

            return {
              id: img.id || index,
              type: 'image',
              category: img.category || 'food',
              src: img.image_url,
              title: img.caption || "Chattha's Kitchen",
              span
            };
          });
          setDynamicItems(formatted);
        }
      } catch (error) {
        console.error('Failed to fetch dynamic gallery:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const activeItems = dynamicItems.length > 0 ? dynamicItems : staticGalleryItems;

  const filteredItems = activeItems.filter(item => 
    activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <>
      <Helmet>
        <title>Visual Experience — Chattha's Restaurant</title>
        <meta name="description" content="Explore the authentic visual experience of Chattha's Restaurant." />
      </Helmet>

      <PageHero title="The Gallery" subtitle="A glimpse into the authentic world of Chattha's." breadcrumb="Home / Gallery" />

      <section className="bg-primary-black min-h-screen pb-32">
        {/* Filter Navigation */}
        <div className="sticky top-[88px] z-30 bg-primary-black/80 backdrop-blur-xl border-y border-dark-border py-4 mb-16 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="container-custom">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-2 rounded-none text-[10px] tracking-[0.2em] uppercase font-semibold transition-all duration-300 border ${
                    activeCategory === category.id 
                      ? 'border-gold-500 bg-gold-500/10 text-gold-500 shadow-gold' 
                      : 'border-dark-border text-cream/50 hover:text-cream hover:border-cream/30'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="container-custom">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[300px]"
          >
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  key={item.id}
                  className={`relative group overflow-hidden rounded-[2px] cursor-pointer ${item.span} bg-charcoal border border-dark-border/50`}
                  onClick={() => setSelectedItem(item)}
                >
                  <img 
                    src={item.src} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 ease-[0.22,1,0.36,1] group-hover:scale-110 opacity-70 group-hover:opacity-100"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-primary-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <div className="flex items-center gap-3 mb-3">
                      {item.type === 'video' ? (
                        <span className="bg-gold-500 text-primary-black p-2 rounded-full">
                          <FaPlay size={10} className="ml-0.5" />
                        </span>
                      ) : (
                        <span className="bg-charcoal/80 backdrop-blur-sm text-gold-500 p-2 rounded-full border border-gold-500/30">
                          <FaImage size={10} />
                        </span>
                      )}
                      <span className="text-gold-500 text-[10px] font-semibold uppercase tracking-[0.2em]">
                        {categories.find(c => c.id === item.category)?.label}
                      </span>
                    </div>
                    <h3 className="text-cream font-display text-2xl italic font-light">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Cinematic Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-primary-black/95 backdrop-blur-xl p-6"
            onClick={() => setSelectedItem(null)}
          >
            <button 
              className="absolute top-8 right-8 text-cream/50 hover:text-cream transition-colors p-3 bg-charcoal/50 rounded-full backdrop-blur-md border border-dark-border"
              onClick={() => setSelectedItem(null)}
            >
              <FaTimes size={20} />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-6xl w-full max-h-[85vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'video' ? (
                <div className="w-full aspect-video bg-primary-black rounded-[2px] overflow-hidden relative shadow-gold-lg border border-dark-border/50">
                   <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${selectedItem.videoId}?autoplay=1`} 
                    title={selectedItem.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <img 
                  src={selectedItem.src} 
                  alt={selectedItem.title} 
                  className="max-w-full max-h-[75vh] object-contain rounded-[2px] shadow-2xl"
                />
              )}
              
              <div className="mt-8 text-center">
                <span className="text-gold-500 text-[10px] font-semibold tracking-[0.3em] uppercase mb-3 block">
                   {categories.find(c => c.id === selectedItem.category)?.label}
                </span>
                <h3 className="text-4xl text-cream font-display font-light italic">{selectedItem.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
