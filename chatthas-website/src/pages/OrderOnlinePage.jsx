import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Phone, MessageCircle, Clock, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { BRAND, MENU_ITEMS } from '../data/brandData';

export default function OrderOnlinePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const popularItems = MENU_ITEMS.filter(item => item.tags.includes('bestseller')).slice(0, 4);

  return (
    <div className="bg-restaurant-dark min-h-screen text-restaurant-light pb-20 pt-24">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
         <div className="absolute inset-0 bg-restaurant-dark z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-restaurant-dark/80 to-restaurant-dark z-10" />
          <img 
            src="https://images.unsplash.com/photo-1589302168068-964664d93cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Delivery Hero" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="relative z-20 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-restaurant-gold tracking-widest uppercase text-sm font-semibold mb-4 block">Delivery & Takeaway</span>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6">Order Your Favorites</h1>
            <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto mb-10">
              Enjoy the authentic taste of {BRAND.name} from the comfort of your home. Fresh, hot, and packed with care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ordering Platforms */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-30 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.a
            href={BRAND.foodpanda}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#FF2B5E] rounded-2xl p-8 flex flex-col items-center justify-center text-white text-center hover:bg-[#E01A4A] transition-colors shadow-2xl shadow-[#FF2B5E]/20 group"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Foodpanda</h3>
            <p className="text-white/80 text-sm mb-6">Fast delivery tracked to your door</p>
            <span className="flex items-center gap-2 font-medium bg-white/20 px-6 py-2 rounded-full">
              Order Now <ArrowRight size={16} />
            </span>
          </motion.a>

          <motion.a
            href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#25D366] rounded-2xl p-8 flex flex-col items-center justify-center text-white text-center hover:bg-[#20bd5a] transition-colors shadow-2xl shadow-[#25D366]/20 group"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
              <MessageCircle size={40} className="group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold mb-2">WhatsApp</h3>
            <p className="text-white/80 text-sm mb-6">Direct ordering & pre-orders</p>
            <span className="flex items-center gap-2 font-medium bg-white/20 px-6 py-2 rounded-full">
              Message Us <ArrowRight size={16} />
            </span>
          </motion.a>

          <motion.a
            href="tel:+92518444636"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-restaurant-gray border border-restaurant-gold/30 rounded-2xl p-8 flex flex-col items-center justify-center text-white text-center hover:border-restaurant-gold transition-colors shadow-2xl group"
          >
            <div className="w-20 h-20 bg-restaurant-gold/10 rounded-full flex items-center justify-center mb-6 text-restaurant-gold">
              <Phone size={40} className="group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Call Direct</h3>
            <p className="text-gray-400 text-sm mb-6">For large orders & takeaway</p>
            <span className="flex items-center gap-2 font-medium bg-restaurant-gold/20 text-restaurant-gold px-6 py-2 rounded-full">
              Call Now <ArrowRight size={16} />
            </span>
          </motion.a>
        </div>
      </section>

      {/* Delivery Benefits */}
      <section className="py-16 bg-black relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-restaurant-gold/30 to-transparent"></div>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-restaurant-gold/10 rounded-full flex items-center justify-center text-restaurant-gold mb-6">
                <Clock size={32} />
              </div>
              <h4 className="text-xl font-playfair font-bold text-white mb-3">Fast Preparation</h4>
              <p className="text-gray-400 text-sm">Most orders are prepared within 20-30 minutes ensuring it arrives hot.</p>
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-restaurant-gold/10 rounded-full flex items-center justify-center text-restaurant-gold mb-6">
                <ShieldCheck size={32} />
              </div>
              <h4 className="text-xl font-playfair font-bold text-white mb-3">Premium Packaging</h4>
              <p className="text-gray-400 text-sm">Spill-proof, heat-retaining containers preserve the authentic taste and quality.</p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-restaurant-gold/10 rounded-full flex items-center justify-center text-restaurant-gold mb-6">
                <Truck size={32} />
              </div>
              <h4 className="text-xl font-playfair font-bold text-white mb-3">Wide Coverage</h4>
              <p className="text-gray-400 text-sm">Delivering across Islamabad and Bahria Town Rawalpindi through our partners.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Delivery Items */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-playfair font-bold text-white mb-4">Most Ordered Items</h2>
          <p className="text-gray-400">Our customers' absolute favorites, perfect for home delivery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularItems.map((item, index) => (
             <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-restaurant-gray/30 rounded-2xl p-6 border border-white/5 hover:border-restaurant-gold/30 transition-colors group flex flex-col"
            >
              <h3 className="text-xl font-playfair font-bold text-white mb-1 group-hover:text-restaurant-gold transition-colors">{item.name}</h3>
              <p className="text-restaurant-gold/60 font-urdu mb-4">{item.nameUrdu}</p>
              <p className="text-gray-400 text-sm mb-6 flex-grow">{item.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-lg font-bold text-white">{item.price}</span>
                <a href={BRAND.foodpanda} target="_blank" rel="noopener noreferrer" className="text-restaurant-gold text-sm font-semibold hover:underline flex items-center gap-1">
                  Order <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
