'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }} 
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div 
      initial="hidden" 
      whileInView="visible"
      viewport={{ once: true, margin: "-5%" }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }} 
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export function SectionHeader({ label, title, subtitle, center = true, light = false }: { label?: string, title: React.ReactNode, subtitle?: string, center?: boolean, light?: boolean }) {
  return (
    <FadeUp className={center ? 'text-center' : ''}>
      {label && <p className="section-label mb-3">{label}</p>}
      <h2 className={`section-title mb-4 ${light ? 'text-charcoal' : 'text-cream'}`}>{title}</h2>
      <div className={`gold-divider mb-6 ${!center ? 'ml-0' : ''}`} />
      {subtitle && (
        <p className={`font-body text-base md:text-lg leading-relaxed max-w-2xl ${center ? 'mx-auto' : ''} ${light ? 'text-charcoal/60' : 'text-cream/60'}`}>
          {subtitle}
        </p>
      )}
    </FadeUp>
  );
}

export function PageHero({ title, subtitle, breadcrumb, image }: { title: string, subtitle?: string, breadcrumb?: string, image?: string }) {
  return (
    <div className="relative h-[60vh] min-h-[450px] flex items-end overflow-hidden">
      {/* Background Image/Fallback */}
      <div className="absolute inset-0 z-0">
        {image ? (
          <img src={image} className="w-full h-full object-cover animate-zoom" alt="" />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,#1a1206 0%,#2a1e08 50%,#0f0d09 100%)' }} />
        )}
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-charcoal/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
      </div>

      <div className="relative container-custom pb-20 z-10">
        {breadcrumb && <p className="text-gold-500/80 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">{breadcrumb}</p>}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl md:text-7xl font-bold text-cream leading-tight">{title}</motion.h1>
        {subtitle && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            className="text-cream/70 font-body text-xl mt-4 max-w-2xl leading-relaxed">{subtitle}</motion.p>
        )}
      </div>
    </div>
  );
}

export function Tag({ type = 'bestseller', label }: { type?: string, label?: string }) {
  const map: Record<string, string> = {
    bestseller: 'tag-bestseller',
    popular: 'tag-popular',
    new: 'tag-new',
    signature: 'border border-gold-500 text-gold-500 text-xs font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wider',
  };
  return <span className={map[type] || map.bestseller}>{label || type}</span>;
}

export function SpiceLevel({ level = 0 }: { level?: number }) {
  if (!level) return null;
  return (
    <div className="flex gap-1 items-center">
      {[1,2,3].map(i => <div key={i} className={`w-2 h-2 rounded-full ${i<=level?'bg-ember-500':'bg-dark-border'}`}/>)}
      <span className="text-xs text-cream/40 ml-1 font-body">{level===1?'Mild':level===2?'Medium':'Spicy'}</span>
    </div>
  );
}

export function PlatformBadge({ platform }: { platform: string }) {
  const c: Record<string, string> = { Foodpanda: 'bg-pink-600', Google: 'bg-blue-600', Tripadvisor: 'bg-green-700' };
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm text-white uppercase tracking-wider ${c[platform] || 'bg-gray-600'}`}>{platform}</span>;
}
