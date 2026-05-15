import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { BRAND } from '../data/brandData';

export default function OwnerMessagePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-charcoal min-h-screen text-cream pb-20 pt-24">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <span className="text-gold-500 tracking-widest uppercase text-sm font-semibold mb-4 block">Founder's Message</span>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6">Waqar Chattha</h1>
            <h2 className="text-2xl text-gold-500 font-playfair italic mb-8">"Making Desi Food Great Again"</h2>
            <div className="w-20 h-1 bg-gold-500 mb-8"></div>
            <p className="text-xl text-gray-300 font-light leading-relaxed">
              When we started {BRAND.name} in 2016, our mission was simple: bring back the authentic taste of Pakistani cuisine without compromise. No shortcuts, no artificial flavors, just pure ingredients and traditional recipes.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2"
          >
            <div className="relative">
              <div className="absolute -inset-4 border border-gold-500/30 rounded-2xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Waqar Chattha - Founder" 
                className="w-full h-[600px] object-cover rounded-2xl shadow-2xl relative z-10"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-dark-card/20 border-y border-white/5 relative overflow-hidden">
        <Quote className="absolute top-10 left-10 text-white/5 rotate-180 w-64 h-64" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg prose-invert max-w-none text-gray-300 space-y-8 font-light"
          >
            <p className="text-2xl text-white font-playfair leading-relaxed text-center">
              "We don't serve fast food. We serve good food as fast as we can, but we will never rush the process if it compromises the taste."
            </p>
            
            <div className="w-16 h-px bg-gold-500 mx-auto my-12"></div>
            
            <p>
              The journey of {BRAND.name} is deeply personal. It started from a realization that finding authentic, pure, and traditionally cooked Pakistani food was becoming increasingly difficult in modern cities. The essence of our culinary heritage was being lost to commercial shortcuts.
            </p>
            <p>
              I wanted to create a place where the food tasted exactly like it would in a village home in Punjab — cooked slowly over coal, using pure desi ghee, fresh farm meat, and spices ground by hand. 
            </p>
            <p>
              When we opened our first branch in F-10, it was a modest 40-seat setup. But the love and appreciation we received from the people of Islamabad was overwhelming. You tasted the difference, and you supported us. For that, I am eternally grateful.
            </p>
            <p>
              Every branch we open, every new dish we introduce, carries the same DNA. We still source our desi ghee directly from farms. Our Nihari still cooks overnight. Our parathas are still made from whole wheat chakki atta.
            </p>
            <p>
              To all our customers who have become part of the {BRAND.name} family over the years — thank you. You are the reason we keep pushing to be better every single day.
            </p>
            
            <div className="mt-16 pt-8 border-t border-white/10 text-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.png" alt="Signature" className="h-16 mx-auto mb-4 filter invert opacity-70" />
              <p className="font-playfair text-xl text-white">Waqar Chattha</p>
              <p className="text-gold-500 text-sm tracking-widest uppercase mt-1">Founder & CEO</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
