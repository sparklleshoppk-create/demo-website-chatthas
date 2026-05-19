import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { PageHero, FadeUp, SectionHeader, Tag } from '../components/UI';
import { BRAND } from '../data/brandData';
import { FaShoppingBag, FaPhoneAlt, FaWhatsapp, FaClock, FaTruck, FaShieldAlt, FaArrowRight, FaStore } from 'react-icons/fa';
import { apiClient } from '../api/client';

export default function OrderOnlinePage() {
  const [popularItems, setPopularItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPopular = async () => {
      try {
        const data = await apiClient('/menu');
        if (data.items) {
          const bestsellerItems = data.items.filter(item => 
            (item.tags && item.tags.includes('bestseller')) || 
            (item.badge && item.badge === 'bestseller')
          ).slice(0, 4);
          setPopularItems(bestsellerItems);
        }
      } catch (error) {
        console.error('Error fetching popular items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPopular();
  }, []);

  return (
    <>
      <Helmet>
        <title>Order Online — Chattha's Restaurant</title>
        <meta name="description" content="Order Chattha's authentic Pakistani food online. Fast delivery via Foodpanda, WhatsApp, or call direct." />
      </Helmet>

      <PageHero title="Order Your Favorites" subtitle="Enjoy the authentic taste of Chattha's from the comfort of your home." breadcrumb="Home / Order" />

      {/* Ordering Platforms */}
      <section className="py-24 bg-primary-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-charcoal/50 via-primary-black to-primary-black z-0 pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
            
            {/* Direct Order */}
            <FadeUp delay={0}>
              <Link
                to="/menu"
                className="group block bg-gold-500/10 border border-gold-500/50 p-10 text-cream text-center hover:bg-gold-500 hover:text-primary-black transition-all duration-500 card-lift h-full"
              >
                <div className="w-20 h-20 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-8 text-primary-black group-hover:scale-110 group-hover:bg-primary-black group-hover:text-gold-500 transition-all duration-500 shadow-gold">
                  <FaStore size={32} />
                </div>
                <h3 className="font-display text-3xl font-light italic mb-3">Order Direct</h3>
                <p className="text-cream/80 text-sm font-body mb-8 group-hover:text-primary-black/80 transition-colors">Official platform • Best prices</p>
                <span className="inline-flex items-center gap-2 font-body font-semibold text-[11px] uppercase tracking-[0.15em] bg-gold-500 text-primary-black px-6 py-3 group-hover:bg-primary-black group-hover:text-gold-500 transition-colors">
                  Order Now <FaArrowRight size={12} />
                </span>
              </Link>
            </FadeUp>
            {/* Foodpanda */}
            <FadeUp delay={0.1}>
              <a
                href={BRAND.foodpanda}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-[#FF2B5E] p-10 text-white text-center hover:bg-[#E01A4A] transition-all duration-500 card-lift h-full"
              >
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                  <FaShoppingBag size={32} />
                </div>
                <h3 className="font-display text-3xl font-light italic mb-3">Foodpanda</h3>
                <p className="text-white/80 text-sm font-body mb-8">Fast delivery tracked to your door</p>
                <span className="inline-flex items-center gap-2 font-body font-semibold text-[11px] uppercase tracking-[0.15em] bg-white/20 px-6 py-3">
                  Order Now <FaArrowRight size={12} />
                </span>
              </a>
            </FadeUp>

            {/* WhatsApp */}
            <FadeUp delay={0.2}>
              <a
                href={`https://wa.me/${BRAND.whatsapp?.replace(/\D/g, '') || '923001234567'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-[#25D366] p-10 text-white text-center hover:bg-[#20bd5a] transition-all duration-500 card-lift h-full"
              >
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                  <FaWhatsapp size={32} />
                </div>
                <h3 className="font-display text-3xl font-light italic mb-3">WhatsApp</h3>
                <p className="text-white/80 text-sm font-body mb-8">Direct ordering & pre-orders</p>
                <span className="inline-flex items-center gap-2 font-body font-semibold text-[11px] uppercase tracking-[0.15em] bg-white/20 px-6 py-3">
                  Message Us <FaArrowRight size={12} />
                </span>
              </a>
            </FadeUp>

            {/* Call Direct */}
            <FadeUp delay={0.3}>
              <a
                href="tel:+92518444636"
                className="group block bg-charcoal border border-gold-500/30 p-10 text-cream text-center hover:border-gold-500 transition-all duration-500 card-lift h-full"
              >
                <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-gold-500 group-hover:scale-110 transition-transform duration-500">
                  <FaPhoneAlt size={32} />
                </div>
                <h3 className="font-display text-3xl font-light italic mb-3">Call Direct</h3>
                <p className="text-cream/60 text-sm font-body mb-8">For large orders & takeaway</p>
                <span className="inline-flex items-center gap-2 font-body font-semibold text-[11px] uppercase tracking-[0.15em] bg-gold-500/20 text-gold-500 px-6 py-3">
                  Call Now <FaArrowRight size={12} />
                </span>
              </a>
            </FadeUp>
          </div>

          {/* Delivery Benefits */}
          <div className="border-t border-dark-border/50 pt-24 mb-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
              {[
                { icon: FaClock, title: 'Fast Preparation', desc: 'Most orders are prepared within 20-30 minutes ensuring it arrives hot.' },
                { icon: FaShieldAlt, title: 'Premium Packaging', desc: 'Spill-proof, heat-retaining containers preserve the authentic taste.' },
                { icon: FaTruck, title: 'Wide Coverage', desc: 'Delivering across Islamabad and Bahria Town Rawalpindi.' },
              ].map((item, idx) => (
                <FadeUp key={item.title} delay={idx * 0.1}>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500 mb-6">
                      <item.icon size={28} />
                    </div>
                    <h4 className="font-display text-2xl font-light italic text-cream mb-4">{item.title}</h4>
                    <p className="text-cream/50 text-sm font-body leading-relaxed max-w-xs">{item.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>

          {/* Popular Delivery Items */}
          <SectionHeader 
            label="Most Ordered" 
            title={<>Customer <span className="gold-text">Favorites</span></>}
            subtitle="Our customers' absolute favorites, perfect for home delivery."
            center={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {isLoading ? (
               [1,2,3,4].map(i => <div key={i} className="h-64 bg-white/5 animate-pulse rounded-sm" />)
            ) : popularItems.map((item, index) => (
              <FadeUp key={item.id} delay={index * 0.1}>
                <div className="group bg-charcoal border border-dark-border/50 p-8 flex flex-col h-full card-lift relative">
                  <div className="absolute top-4 right-4">
                     {item.badge && <Tag type={item.badge} label={item.badge} />}
                  </div>
                  <h3 className="font-display text-2xl font-light italic text-cream mb-1 group-hover:text-gold-400 transition-colors">{item.name}</h3>
                  {item.nameUrdu && (
                    <p className="font-urdu text-cream/30 text-sm mb-4">{item.nameUrdu}</p>
                  )}
                  <p className="text-cream/50 text-sm font-body leading-relaxed mb-8 flex-grow">{item.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-dark-border/50">
                    <span className="font-display text-xl text-gold-500">{item.price}</span>
                    <Link 
                      to="/menu"
                      className="text-gold-500 text-[10px] font-semibold uppercase tracking-[0.15em] hover:text-gold-300 transition-colors flex items-center gap-1"
                    >
                      Order <FaArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
