import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Image as ImageIcon, Video } from 'lucide-react';
import { BRAND } from '../data/brandData';

const categories = [
  { id: 'all', label: 'All Media' },
  { id: 'food', label: 'Our Food' },
  { id: 'interior', label: 'Restaurant Interior' },
  { id: 'experience', label: 'Customer Experience' },
  { id: 'video', label: 'Videos & Reels' }
];

const galleryItems = [
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

  const filteredItems = galleryItems.filter(item => 
    activeCategory === 'all' || item.category === activeCategory
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-restaurant-dark min-h-screen text-restaurant-light pb-20 pt-24">
      {/* Hero Section */}
      <section className="relative py-20 px-4 mb-10 text-center">
        <div className="absolute inset-0 bg-restaurant-dark z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-restaurant-dark/80 to-restaurant-dark z-10" />
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Gallery Hero" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="relative z-20 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-restaurant-gold tracking-widest uppercase text-sm font-semibold mb-4 block">Visual Experience</span>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6">Our Gallery</h1>
            <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
              A glimpse into the authentic world of {BRAND.name}. The food, the ambiance, and the memories we create every day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Navigation */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.id 
                  ? 'bg-restaurant-gold text-black shadow-lg shadow-restaurant-gold/20' 
                  : 'bg-restaurant-gray/50 text-gray-400 hover:text-white hover:bg-restaurant-gray'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[250px]"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                className={`relative group overflow-hidden rounded-xl cursor-pointer ${item.span} bg-restaurant-gray/30`}
                onClick={() => setSelectedItem(item)}
              >
                <img 
                  src={item.src} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {item.type === 'video' ? (
                      <span className="bg-restaurant-gold text-black p-1.5 rounded-full">
                        <Play size={14} className="ml-0.5" />
                      </span>
                    ) : (
                      <span className="bg-white/20 backdrop-blur-sm text-white p-1.5 rounded-full">
                        <ImageIcon size={14} />
                      </span>
                    )}
                    <span className="text-restaurant-gold text-xs font-semibold uppercase tracking-wider">
                      {categories.find(c => c.id === item.category)?.label}
                    </span>
                  </div>
                  <h3 className="text-white font-playfair text-xl">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={() => setSelectedItem(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 bg-white/10 rounded-full backdrop-blur-md"
              onClick={() => setSelectedItem(null)}
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'video' ? (
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative shadow-2xl shadow-restaurant-gold/10">
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
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl shadow-restaurant-gold/10"
                />
              )}
              
              <div className="mt-6 text-center">
                <span className="text-restaurant-gold text-sm font-semibold tracking-wider uppercase mb-2 block">
                   {categories.find(c => c.id === selectedItem.category)?.label}
                </span>
                <h3 className="text-2xl text-white font-playfair">{selectedItem.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
