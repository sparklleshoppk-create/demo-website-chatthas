import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { PageHero, FadeUp, SectionHeader, Stars, StaggerContainer, staggerItem } from '../components/UI';
import { BRAND, TESTIMONIALS, STATS } from '../data/brandData';
import { FaStar, FaThumbsUp, FaMapMarkerAlt, FaQuoteRight } from 'react-icons/fa';

export default function ReviewsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const averageRating = STATS.find(s => s.label === 'Average Rating')?.value || 4.8;
  const totalReviews = STATS.find(s => s.label === 'Customer Reviews')?.value || 15000;

  return (
    <>
      <Helmet>
        <title>Reviews — Chattha's Restaurant</title>
        <meta name="description" content="Read what thousands of food lovers say about Chattha's Restaurant. Verified reviews from Google, Foodpanda, and more." />
      </Helmet>

      <PageHero title="What They Say" subtitle="Verified reviews from thousands of satisfied guests." breadcrumb="Home / Reviews" />

      {/* Trust Badges */}
      <section className="py-16 bg-charcoal border-b border-dark-border/50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-primary-black border border-dark-border/50 px-8 py-6 flex items-center gap-4">
              <div className="font-display text-4xl font-light italic text-cream">{averageRating}</div>
              <div className="text-left">
                <Stars rating={Math.floor(Number(averageRating))} size={14} />
                <div className="text-[10px] text-cream/40 uppercase tracking-wider mt-1">Based on {totalReviews}+ reviews</div>
              </div>
            </div>
            
            <div className="bg-primary-black border border-dark-border/50 px-8 py-6 flex items-center gap-4">
               <div className="w-10 h-10 bg-[#FF2B5E]/20 rounded-full flex items-center justify-center text-[#FF2B5E]">
                  <FaThumbsUp size={18} />
               </div>
               <div className="text-left">
                 <div className="font-body font-bold text-cream text-sm">Foodpanda</div>
                 <div className="text-[10px] text-cream/40 uppercase tracking-wider">Top Rated</div>
               </div>
            </div>
            
            <div className="bg-primary-black border border-dark-border/50 px-8 py-6 flex items-center gap-4">
               <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500">
                  <FaMapMarkerAlt size={18} />
               </div>
               <div className="text-left">
                 <div className="font-body font-bold text-cream text-sm">Google Maps</div>
                 <div className="text-[10px] text-cream/40 uppercase tracking-wider">Local Favorite</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-24 lg:py-32 bg-primary-black">
        <div className="container-custom">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((review) => (
              <motion.div
                key={review.id}
                variants={staggerItem}
                className="group bg-charcoal border border-dark-border/50 p-8 flex flex-col h-full card-lift"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 font-display font-bold text-xl italic">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-cream font-body font-semibold text-sm">{review.name}</h3>
                      <span className="text-[10px] text-cream/40 uppercase tracking-wider">
                        via {review.platform}
                      </span>
                    </div>
                  </div>
                  <FaQuoteRight className="text-gold-500/10" size={28} />
                </div>
                
                <Stars rating={review.rating} size={13} />
                
                <p className="text-cream/60 font-body text-sm leading-[1.8] mt-4 flex-grow">
                  "{review.text}"
                </p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-24 bg-charcoal border-t border-dark-border/50">
        <div className="container-custom">
          <SectionHeader label="Real Reactions" title={<>See the <span className="gold-text">Experience</span></>} center={true} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[1, 2, 3].map((item) => (
              <FadeUp key={item} delay={item * 0.1}>
                <div className="relative aspect-[9/16] overflow-hidden group cursor-pointer border border-dark-border/50">
                  <img 
                    src="https://images.unsplash.com/photo-1544025162-8482436151f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Customer Review Video" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-black/90 via-primary-black/20 to-transparent flex flex-col justify-end p-8">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center text-primary-black transform group-hover:scale-110 transition-transform duration-300 shadow-gold">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-primary-black border-b-[8px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                    <h3 className="text-cream font-display text-2xl italic font-light relative z-10">Amazing Karahi Experience</h3>
                    <p className="text-gold-500 text-[10px] uppercase tracking-[0.2em] relative z-10 mt-2">@foodie_islamabad</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary-black">
        <div className="container-custom text-center">
          <h2 className="font-display text-4xl md:text-5xl font-light italic text-cream mb-6">Leave Your Own Review</h2>
          <p className="text-cream/50 font-body mb-12 text-lg max-w-xl mx-auto">We value your feedback. Let us know how we did!</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <a href="#" className="btn-gold text-[11px]">Review on Google</a>
             <a href="#" className="btn-outline-gold text-[11px]">Review on Tripadvisor</a>
          </div>
        </div>
      </section>
    </>
  );
}
