import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHero, SectionHeader, FadeUp, Tag, SpiceLevel, PlatformBadge } from '../components/UI';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/brandData';
import { FaArrowRight } from 'react-icons/fa';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('nashta');

  const filteredItems = MENU_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>Menu — Chattha's Restaurant</title>
        <meta name="description" content="Explore Chattha's authentic Pakistani menu. From our famous Halwa Puri breakfast to Desi Ghee Karahi and Biryani." />
      </Helmet>
      
      <PageHero title="Our Menu" subtitle="Cooked in farm-sourced organic desi ghee." breadcrumb="Home / Menu" />

      <section className="section-pad bg-charcoal min-h-screen relative">
        {/* Sticky Category Navigation */}
        <div className="sticky top-20 z-40 bg-charcoal/90 backdrop-blur-md border-b border-dark-border py-4 mb-12">
          <div className="container-custom">
            <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm transition-all duration-300 border ${
                    activeCategory === cat.id
                      ? 'border-gold-500 bg-gold-500/10 text-gold-500 font-semibold shadow-gold'
                      : 'border-dark-border text-cream/60 hover:text-cream hover:border-cream/30'
                  }`}
                >
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container-custom">
          {/* Menu Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredItems.map((dish) => (
                <div
                  key={dish.id}
                  className="group bg-dark-card border border-dark-border hover:border-gold-500/40 transition-all duration-400 p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        <h3 className="font-display text-xl font-bold text-cream group-hover:text-gold-400 transition-colors">
                          {dish.name}
                        </h3>
                        {dish.nameUrdu && (
                          <p className="font-urdu text-cream/40 text-sm mt-1">{dish.nameUrdu}</p>
                        )}
                      </div>
                      <span className="font-body font-bold text-gold-500 text-lg whitespace-nowrap">
                        {dish.price}
                      </span>
                    </div>

                    <div className="flex gap-2 mb-4 flex-wrap">
                      {dish.tags.map((t) => (
                        <Tag key={t} type={t} label={t} />
                      ))}
                      {dish.spice > 0 && <SpiceLevel level={dish.spice} />}
                    </div>

                    <p className="text-cream/50 text-sm font-body leading-relaxed mb-6">
                      {dish.description}
                    </p>
                  </div>

                  <a
                    href="https://www.foodpanda.pk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-gold-500 hover:text-gold-300 transition-colors uppercase tracking-wider mt-auto pt-4 border-t border-dark-border"
                  >
                    Add to Order <FaArrowRight size={10} />
                  </a>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-cream/40">No items found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
