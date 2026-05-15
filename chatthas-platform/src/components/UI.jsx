import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export function FadeUp({ children, delay = 0, className = '' }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = '' }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }} className={className}>
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function SectionHeader({ label, title, subtitle, center = true, light = false }) {
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

export function PageHero({ title, subtitle, breadcrumb }) {
  return (
    <div className="relative h-[50vh] min-h-[360px] flex items-end overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#1a1206 0%,#2a1e08 50%,#0f0d09 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,#1A1A1A 0%,rgba(26,26,26,0.3) 100%)' }} />
      <div className="relative container-custom pb-16">
        {breadcrumb && <p className="text-cream/40 text-xs font-body tracking-wider mb-3">{breadcrumb}</p>}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl md:text-6xl font-bold text-cream leading-tight">{title}</motion.h1>
        {subtitle && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            className="text-cream/60 font-body text-lg mt-3 max-w-xl">{subtitle}</motion.p>
        )}
      </div>
    </div>
  );
}

export function Stars({ rating = 5, size = 14 }) {
  return (
    <div className="flex gap-0.5 stars">
      {[1,2,3,4,5].map(s => (
        <svg key={s} width={size} height={size} viewBox="0 0 20 20" fill={s<=rating?'currentColor':'none'} stroke="currentColor" strokeWidth="1.5">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

export function Tag({ type = 'bestseller', label }) {
  const map = {
    bestseller: 'tag-bestseller',
    popular: 'tag-popular',
    new: 'tag-new',
    signature: 'border border-gold-500 text-gold-500 text-xs font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wider',
  };
  return <span className={map[type] || map.bestseller}>{label || type}</span>;
}

export function SpiceLevel({ level = 0 }) {
  if (!level) return null;
  return (
    <div className="flex gap-1 items-center">
      {[1,2,3].map(i => <div key={i} className={`w-2 h-2 rounded-full ${i<=level?'bg-ember-500':'bg-dark-border'}`}/>)}
      <span className="text-xs text-cream/40 ml-1 font-body">{level===1?'Mild':level===2?'Medium':'Spicy'}</span>
    </div>
  );
}

export function PlatformBadge({ platform }) {
  const c={Foodpanda:'bg-pink-600',Google:'bg-blue-600',Tripadvisor:'bg-green-700'};
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm text-white uppercase tracking-wider ${c[platform]||'bg-gray-600'}`}>{platform}</span>;
}
