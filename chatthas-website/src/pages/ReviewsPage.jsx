import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ThumbsUp, MapPin } from 'lucide-react';
import { BRAND, TESTIMONIALS, STATS } from '../data/brandData';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function ReviewsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const averageRating = STATS.find(s => s.label === 'Average Rating')?.value || 4.8;
  const totalReviews = STATS.find(s => s.label === 'Customer Reviews')?.value || 15000;

  return (
    <div className="bg-restaurant-dark min-h-screen text-restaurant-light pb-20 pt-24">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-restaurant-gold tracking-widest uppercase text-sm font-semibold mb-4 block">Customer Trust</span>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6">What They Say</h1>
            <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto mb-10">
              Don't just take our word for it. Read what thousands of food lovers have to say about their experience at {BRAND.name}.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="bg-restaurant-gray/30 border border-white/5 backdrop-blur-sm px-6 py-4 rounded-2xl flex items-center gap-4">
                <div className="text-4xl font-bold text-white">{averageRating}</div>
                <div className="text-left">
                  <div className="flex text-restaurant-gold text-sm mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={i < Math.floor(averageRating) ? "fill-current" : "text-gray-600"} size={16} />
                    ))}
                  </div>
                  <div className="text-xs text-gray-400">Based on {totalReviews}+ reviews</div>
                </div>
              </div>
              
              <div className="bg-restaurant-gray/30 border border-white/5 backdrop-blur-sm px-6 py-4 rounded-2xl flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#FF2B5E]/20 rounded-full flex items-center justify-center text-[#FF2B5E]">
                    <ThumbsUp size={24} />
                 </div>
                 <div className="text-left">
                   <div className="font-bold text-white">Foodpanda</div>
                   <div className="text-xs text-gray-400">Top Rated Restaurant</div>
                 </div>
              </div>
              
              <div className="bg-restaurant-gray/30 border border-white/5 backdrop-blur-sm px-6 py-4 rounded-2xl flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500">
                    <MapPin size={24} />
                 </div>
                 <div className="text-left">
                   <div className="font-bold text-white">Google Maps</div>
                   <div className="text-xs text-gray-400">Local Guide Favorites</div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((review, index) => (
            <motion.div
              key={review.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="bg-restaurant-gray/20 border border-white/5 rounded-2xl p-8 hover:bg-restaurant-gray/40 transition-colors duration-300 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-restaurant-gold/20 flex items-center justify-center text-restaurant-gold font-playfair font-bold text-xl">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{review.name}</h3>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      via {review.platform}
                    </span>
                  </div>
                </div>
                <Quote className="text-restaurant-gold/20" size={32} />
              </div>
              
              <div className="flex text-restaurant-gold text-sm mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={i < review.rating ? "fill-current" : "text-gray-600"} size={14} />
                ))}
              </div>
              
              <p className="text-gray-300 leading-relaxed flex-grow font-light">
                "{review.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Video Testimonials Preview */}
      <section className="py-20 bg-black relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-restaurant-gold/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-16">
            <span className="text-restaurant-gold tracking-widest uppercase text-sm font-semibold mb-4 block">Real Reactions</span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white">See the Experience</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-[9/16] rounded-2xl overflow-hidden group cursor-pointer"
              >
                <img 
                  src={`https://images.unsplash.com/photo-1544025162-8482436151f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`} 
                  alt="Customer Review Video" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-restaurant-gold/90 rounded-full flex items-center justify-center text-black transform group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-restaurant-gold/30">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-black border-b-[8px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                  <h3 className="text-white font-playfair text-xl relative z-10">Amazing Karahi Experience</h3>
                  <p className="text-restaurant-gold text-sm relative z-10">@foodie_islamabad</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6">Leave Your Own Review</h2>
          <p className="text-gray-400 mb-10 text-lg">We value your feedback and strive to make every experience perfect. Let us know how we did!</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <a href="#" className="btn-primary">Review on Google</a>
             <a href="#" className="btn-secondary">Review on Tripadvisor</a>
          </div>
        </div>
      </section>
    </div>
  );
}
