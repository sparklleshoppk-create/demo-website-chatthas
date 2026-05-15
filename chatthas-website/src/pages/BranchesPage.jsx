import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { PageHero, SectionHeader, FadeUp, StaggerContainer, staggerItem } from '../components/UI';
import { BRANCHES } from '../data/brandData';
import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaStar } from 'react-icons/fa';

export default function BranchesPage() {
  return (
    <>
      <Helmet>
        <title>Our Branches — Chattha's Restaurant</title>
        <meta name="description" content="Find a Chattha's branch near you in Islamabad and Rawalpindi. F-10, F-6, Bahria Town Phase 4, and Bahria Phase 7." />
      </Helmet>
      
      <PageHero title="Find Us" subtitle="4 locations across the twin cities. One uncompromised taste." breadcrumb="Home / Branches" />

      <section className="section-pad bg-charcoal">
        <div className="container-custom">
          {/* Featured Branch (e.g., Bahria Phase 7) */}
          {BRANCHES.filter(b => b.isNew).map((branch) => (
             <FadeUp key={branch.id} className="mb-20">
               <div className="bg-gradient-to-br from-[#2a1e08] to-dark-card border border-gold-500/40 p-8 md:p-12 relative overflow-hidden">
                 <div className="absolute top-6 right-6">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-sm">Now Open</span>
                 </div>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                   <div>
                     <p className="section-label mb-2">Newest Location</p>
                     <h2 className="font-display text-4xl md:text-5xl font-bold text-cream mb-6">{branch.name}</h2>
                     <p className="text-cream/70 font-body leading-relaxed mb-6">{branch.description}</p>
                     
                     <div className="space-y-4 mb-8">
                       <div className="flex items-start gap-3">
                         <FaMapMarkerAlt className="text-gold-500 mt-1" />
                         <p className="text-cream/60">{branch.address}</p>
                       </div>
                       <div className="flex items-center gap-3">
                         <FaPhoneAlt className="text-gold-500" />
                         <p className="text-cream/60">{branch.phone}</p>
                       </div>
                       <div className="flex items-center gap-3">
                         <span className="text-gold-500 text-sm">⏰</span>
                         <p className="text-cream/60">{branch.hours}</p>
                       </div>
                     </div>

                     <div className="flex flex-wrap gap-4">
                       <a href={branch.foodpanda} target="_blank" rel="noopener noreferrer" className="btn-gold">Order Online</a>
                       <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-gold">Get Directions</a>
                     </div>
                   </div>

                   <div className="h-64 lg:h-full w-full bg-dark-border min-h-[300px]">
                     <iframe src={branch.mapEmbed} width="100%" height="100%" style={{border:0}} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                   </div>
                 </div>
               </div>
             </FadeUp>
          ))}

          <SectionHeader label="All Locations" title={<>Visit <span className="gold-text">Chattha's</span></>} center={true} />
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {BRANCHES.filter(b => !b.isNew).map((branch) => (
              <motion.div key={branch.id} variants={staggerItem} className="bg-dark-card border border-dark-border p-6 flex flex-col h-full hover:border-gold-500/30 transition-colors">
                <div className="mb-4">
                  <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 ${branch.badgeColor === 'gold' ? 'text-gold-500 bg-gold-500/10' : 'text-ember-400 bg-ember-500/10'}`}>
                    {branch.badge}
                  </span>
                </div>
                
                <h3 className="font-display text-2xl font-bold text-cream mb-2">{branch.name}</h3>
                <p className="text-cream/50 text-sm font-body mb-6 flex-grow">{branch.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-gold-500 mt-1 flex-shrink-0" />
                    <p className="text-cream/60 text-sm leading-snug">{branch.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-gold-500 flex-shrink-0" />
                    <p className="text-cream/60 text-sm">{branch.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                   <a href={branch.foodpanda} target="_blank" rel="noopener noreferrer" className="text-center py-2.5 text-xs font-semibold bg-charcoal border border-dark-border text-cream hover:bg-dark-border transition-colors">
                     Order
                   </a>
                   <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="text-center py-2.5 text-xs font-semibold bg-charcoal border border-dark-border text-cream hover:border-gold-500 hover:text-gold-500 transition-colors">
                     Directions
                   </a>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
