import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { PageHero, SectionHeader, FadeUp, StaggerContainer, staggerItem } from '../components/UI';
import { BRANCHES as FALLBACK_BRANCHES } from '../data/brandData';
import { supabase } from '../lib/supabase';
import { FaMapMarkerAlt, FaPhoneAlt, FaStar, FaSpinner } from 'react-icons/fa';

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const { data, error } = await supabase
          .from('branches')
          .select('*')
          .order('display_order', { ascending: true });

        if (data && data.length > 0) {
          setBranches(data);
        } else {
          // Fallback to static data
          setBranches(FALLBACK_BRANCHES);
        }
      } catch (err) {
        console.error('Error fetching branches:', err);
        setBranches(FALLBACK_BRANCHES);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  // Map DB fields to display-ready data
  const mapBranch = (b) => ({
    id: b.id,
    name: b.name,
    badge: b.is_featured ? 'Flagship' : (b.city || 'Branch'),
    address: b.address || 'Address coming soon',
    phone: b.phone || '',
    hours: b.operating_hours ? `${b.operating_hours.open || '7:30 AM'} – ${b.operating_hours.close || '12:30 AM'}` : '7:30 AM – 12:30 AM',
    description: b.description || `Serving authentic Chattha's experience in ${b.city || 'the twin cities'}.`,
    mapEmbed: b.map_embed_url || '',
    mapUrl: b.map_url || `https://maps.google.com/?q=${b.latitude},${b.longitude}`,
    foodpanda: b.online_ordering?.foodpanda || 'https://www.foodpanda.pk',
    rating: b.ratings?.rating || 4.5,
    reviews: b.ratings?.reviews || '—',
    isNew: b.display_order >= 4,
    isFeatured: b.is_featured,
    // Keep static fallback fields if they exist
    ...(b.badge ? { badge: b.badge } : {}),
    ...(b.badgeColor ? { badgeColor: b.badgeColor } : {}),
  });

  const displayBranches = branches.map(b => b.slug ? mapBranch(b) : b);
  const featuredBranches = displayBranches.filter(b => b.isNew || b.isFeatured);
  const otherBranches = displayBranches.filter(b => !b.isNew && !b.isFeatured);

  return (
    <>
      <Helmet>
        <title>Our Locations — Chattha's Restaurant</title>
        <meta name="description" content={`Find a Chattha's branch near you in Islamabad and Rawalpindi. ${displayBranches.length} locations across the twin cities.`} />
      </Helmet>
      
      <PageHero title="Our Locations" subtitle={`${displayBranches.length} distinct spaces. One uncompromised culinary standard.`} breadcrumb="Home / Locations" />

      <section className="py-24 lg:py-32 bg-primary-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-charcoal/50 via-primary-black to-primary-black z-0 pointer-events-none" />
        
        <div className="container-custom relative z-10">

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <FaSpinner className="animate-spin text-gold-500" size={32} />
            </div>
          ) : (
            <>
              {/* Featured Branches */}
              {featuredBranches.map((branch) => (
                <FadeUp key={branch.id} className="mb-24 lg:mb-32">
                  <div className="bg-charcoal border border-dark-border/50 relative overflow-hidden flex flex-col lg:flex-row shadow-2xl">
                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative z-10 bg-charcoal">
                       <p className="text-gold-500 text-[10px] uppercase tracking-[0.3em] font-semibold mb-4">
                         {branch.badge || 'Featured Location'}
                       </p>
                       <h2 className="font-display text-5xl lg:text-6xl font-light italic text-cream mb-6 leading-[1.1]">{branch.name}</h2>
                       <p className="text-cream/60 font-body text-[15px] leading-relaxed mb-10 max-w-md">{branch.description}</p>
                       
                       <div className="space-y-6 mb-12">
                         <div className="flex items-start gap-4">
                           <FaMapMarkerAlt className="text-gold-500 mt-1 flex-shrink-0" />
                           <p className="text-cream/80 font-body tracking-wide">{branch.address}</p>
                         </div>
                         {branch.phone && (
                           <div className="flex items-center gap-4">
                             <FaPhoneAlt className="text-gold-500 flex-shrink-0" />
                             <p className="text-cream/80 font-body tracking-wide">{branch.phone}</p>
                           </div>
                         )}
                         <div className="flex items-center gap-4">
                           <span className="text-gold-500 text-sm">⏰</span>
                           <p className="text-cream/80 font-body tracking-wide">{branch.hours}</p>
                         </div>
                         {branch.rating && (
                           <div className="flex items-center gap-4">
                             <FaStar className="text-gold-500 flex-shrink-0" />
                             <p className="text-cream/80 font-body tracking-wide">{branch.rating} ★ ({branch.reviews} reviews)</p>
                           </div>
                         )}
                       </div>

                       <div className="flex flex-col sm:flex-row gap-4">
                         <a href={branch.foodpanda} target="_blank" rel="noopener noreferrer" className="btn-gold justify-center text-[11px]">Order for Delivery</a>
                         <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-gold justify-center text-[11px]">Get Directions</a>
                       </div>
                    </div>

                    {/* Map Side */}
                    <div className="w-full lg:w-1/2 h-96 lg:h-auto min-h-[400px] relative bg-charcoal">
                       {branch.mapEmbed ? (
                         <iframe 
                           src={branch.mapEmbed} 
                           width="100%" 
                           height="100%" 
                           style={{border: 0}} 
                           allowFullScreen={true} 
                           loading="lazy" 
                           referrerPolicy="no-referrer-when-downgrade" 
                           className="absolute inset-0 w-full h-full"
                         />
                       ) : (
                         <div className="absolute inset-0 flex items-center justify-center bg-primary-black">
                           <FaMapMarkerAlt className="text-gold-500/30" size={48} />
                         </div>
                       )}
                    </div>
                  </div>
                </FadeUp>
              ))}

              {otherBranches.length > 0 && (
                <>
                  <FadeUp className="text-center mb-16 border-t border-dark-border/50 pt-24">
                     <p className="section-label mb-4">Heritage Locations</p>
                     <h2 className="font-display text-4xl lg:text-5xl font-light italic text-cream">
                       Visit <span className="gold-text">Chattha's</span>
                     </h2>
                  </FadeUp>
                  
                  <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherBranches.map((branch) => (
                      <motion.div key={branch.id} variants={staggerItem} className="group bg-charcoal border border-dark-border/50 flex flex-col h-full card-lift relative overflow-hidden">
                        
                        {/* Embedded Map */}
                        <div className="w-full h-48 relative bg-primary-black">
                          {branch.mapEmbed ? (
                            <iframe 
                              src={branch.mapEmbed} 
                              width="100%" 
                              height="100%" 
                              style={{border: 0}} 
                              allowFullScreen={true} 
                              loading="lazy" 
                              referrerPolicy="no-referrer-when-downgrade" 
                              className="absolute inset-0 w-full h-full"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <FaMapMarkerAlt className="text-gold-500/20" size={32} />
                            </div>
                          )}
                        </div>

                        <div className="p-8 flex flex-col flex-grow">
                          <p className="text-gold-500 text-[10px] uppercase tracking-[0.2em] font-semibold mb-4">
                            {branch.badge}
                          </p>
                          
                          <h3 className="font-display text-3xl font-light italic text-cream mb-4">{branch.name}</h3>
                          <p className="text-cream/50 text-sm font-body leading-[1.8] mb-8 flex-grow">{branch.description}</p>
                          
                          <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3">
                              <FaMapMarkerAlt className="text-gold-500 mt-1 flex-shrink-0" />
                              <p className="text-cream/70 text-[13px] leading-snug">{branch.address}</p>
                            </div>
                            {branch.phone && (
                              <div className="flex items-center gap-3">
                                <FaPhoneAlt className="text-gold-500 flex-shrink-0" />
                                <p className="text-cream/70 text-[13px]">{branch.phone}</p>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-auto">
                             <a href={branch.foodpanda} target="_blank" rel="noopener noreferrer" className="text-center py-3 text-[10px] tracking-[0.1em] uppercase font-semibold bg-primary-black border border-dark-border text-gold-500 hover:border-gold-500 transition-colors">
                               Order
                             </a>
                             <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="text-center py-3 text-[10px] tracking-[0.1em] uppercase font-semibold bg-primary-black border border-dark-border text-cream hover:border-cream transition-colors">
                               Directions
                             </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </StaggerContainer>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
