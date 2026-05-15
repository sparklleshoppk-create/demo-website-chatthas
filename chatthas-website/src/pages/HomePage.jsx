import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { FaWhatsapp, FaMapMarkerAlt, FaStar, FaQuoteLeft, FaArrowRight, FaChevronDown } from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import { SectionHeader, FadeUp, StaggerContainer, staggerItem, Stars, PlatformBadge } from '../components/UI';
import { MENU_ITEMS, BRANCHES, TESTIMONIALS, STATS, TIMELINE } from '../data/brandData';

// ─── Hero Section ───────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      {/* Static gradient bg for performance */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 60% 40%, #2a1e08 0%, #1a1206 40%, #0f0d09 70%, #1A1A1A 100%)'
        }} />
        {/* CSS-only floating orbs */}
        <div 
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-40 mix-blend-screen"
          style={{ background: 'radial-gradient(circle, rgba(212,160,23,0.15) 0%, transparent 70%)' }} />
        <div 
          className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-30 mix-blend-screen"
          style={{ background: 'radial-gradient(circle, rgba(192,57,43,0.15) 0%, transparent 70%)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom pt-24">
        <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.3 }}
          className="section-label mb-6">
          Islamabad &amp; Rawalpindi's Finest Desi Restaurant
        </motion.p>

        <motion.h1 initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9, delay:0.5, ease:[0.22,1,0.36,1] }}
          className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-cream leading-[1.05] mb-6 max-w-4xl">
          Making Desi Food<br />
          <span className="gold-text">Great Again.</span>
        </motion.h1>

        <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.8 }}
          className="text-cream/60 font-body text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
          Cooked in organic desi ghee from our own farm. From halwa puri to midnight karahi — across 4 branches in the twin cities.
        </motion.p>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:1.0 }}
          className="flex flex-wrap gap-4">
          <Link to="/menu" className="btn-gold">Explore Menu</Link>
          <a href="https://www.foodpanda.pk" target="_blank" rel="noopener noreferrer" className="btn-outline-gold">
            <MdDeliveryDining size={18} /> Order Online
          </a>
          <Link to="/branches" className="btn-ember">
            <FaMapMarkerAlt size={14} /> Find Branch
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.4 }}
          className="flex flex-wrap gap-8 mt-16">
          {[['4.8/5','Foodpanda Rating'],['15K+','Customer Reviews'],['4','Branches'],['Since 2016','Family Owned']].map(([val,lab]) => (
            <div key={lab}>
              <p className="font-display text-2xl font-bold gold-text">{val}</p>
              <p className="text-cream/40 text-xs font-body tracking-wider mt-0.5">{lab}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-cream/30 text-xs tracking-widest uppercase font-body">Scroll</span>
        <motion.div animate={{ y:[0,8,0] }} transition={{ duration:1.5, repeat:Infinity }}>
          <FaChevronDown className="text-gold-500" size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── USP Strip ───────────────────────────────────────────────────
function USPStrip() {
  const usps = [
    { icon:'🌿', title:'Farm-to-Table', desc:'Own-farm desi ghee, milk & rice' },
    { icon:'🍳', title:'Traditional Recipes', desc:'Cooked the way it\'s been for generations' },
    { icon:'📍', title:'4 Locations', desc:'F-10, F-6, Bahria Ph 4 & Phase 7' },
    { icon:'⭐', title:'15,000+ Reviews', desc:'Most reviewed desi spot on Foodpanda' },
  ];
  return (
    <section className="py-0">
      <div className="container-custom">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px bg-dark-border">
          {usps.map(({ icon, title, desc }) => (
            <motion.div key={title} variants={staggerItem}
              className="bg-dark-card p-8 text-center hover:bg-[#2a2a2a] transition-colors duration-300">
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="font-body font-semibold text-cream text-sm tracking-wide mb-1">{title}</h3>
              <p className="text-cream/40 text-xs font-body leading-snug">{desc}</p>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ─── Signature Dishes ─────────────────────────────────────────────
function SignatureDishes() {
  const featured = MENU_ITEMS.filter(i => i.tags.includes('signature') || i.tags.includes('bestseller')).slice(0, 6);
  const spiceEmoji = (l) => l===0?'':l===1?'🌶':l===2?'🌶🌶':'🌶🌶🌶';

  return (
    <section className="section-pad bg-charcoal">
      <div className="container-custom">
        <SectionHeader label="Signature Dishes" title={<>Our Most <span className="gold-text">Loved</span> Creations</>}
          subtitle="From the karahi that made Islamabad talk, to the halwa puri that brings families together every Sunday." />
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {featured.map((dish) => (
            <Link key={dish.id} to="/menu">
              <motion.div variants={staggerItem}
                className="group bg-dark-card border border-dark-border hover:border-gold-500/40 transition-all duration-400 overflow-hidden card-lift cursor-pointer h-full">
                {/* Image placeholder with gradient */}
                <div className="relative h-52 overflow-hidden" style={{
                  background: `linear-gradient(135deg, #2a1e08 0%, #1a1206 100%)`
                }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl opacity-40 group-hover:scale-110 transition-transform duration-500">
                      {dish.category==='nashta'?'🥞':dish.category==='karahi'?'🫕':dish.category==='biryani'?'🍛':dish.category==='nihari'?'🥘':dish.category==='bbq'?'🔥':'🍽'}
                    </span>
                  </div>
                  {/* Tags */}
                  <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    {dish.tags.slice(0,2).map(t => (
                      <span key={t} className={t==='bestseller'?'tag-bestseller':t==='popular'?'tag-popular':t==='new'?'tag-new':'tag-bestseller'}>{t}</span>
                    ))}
                  </div>
                  {dish.spice > 0 && (
                    <div className="absolute top-3 right-3 text-sm">{spiceEmoji(dish.spice)}</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display text-lg font-bold text-cream group-hover:text-gold-400 transition-colors">{dish.name}</h3>
                    <span className="font-body font-bold text-gold-500 text-sm whitespace-nowrap">{dish.price}</span>
                  </div>
                  <p className="text-cream/50 text-sm font-body leading-relaxed line-clamp-2 mb-4">{dish.description}</p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gold-500 group-hover:text-gold-300 transition-colors uppercase tracking-wider">
                    Explore Details <FaArrowRight size={10} />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}

        </StaggerContainer>
        <FadeUp className="text-center mt-12">
          <Link to="/menu" className="btn-outline-gold">View Full Menu</Link>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Brand Story Preview ──────────────────────────────────────────
function BrandStoryPreview() {
  return (
    <section className="section-pad" style={{ background: 'linear-gradient(135deg,#1a1206 0%,#2a1e08 100%)' }}>
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <FadeUp>
            <p className="section-label mb-4">Our Story</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream leading-tight mb-6">
              One Man's Vision.<br /><span className="gold-text">A City's Favourite.</span>
            </h2>
            <div className="gold-divider ml-0 mb-6" />
            <p className="text-cream/60 font-body text-base leading-relaxed mb-4">
              Waqar Chattha had a simple belief: Pakistan deserved better desi food. So he did something bold — he left the comfort of a shared brand and built his own, from scratch, with one non-negotiable rule.
            </p>
            <p className="text-cream/60 font-body text-base leading-relaxed mb-8">
              <span className="text-cream font-semibold">Farm-sourced organic desi ghee. Real milk. Real rice. Real food.</span> No shortcuts. No compromises. Just the authentic taste of Pakistan — elevated and unapologetically proud.
            </p>
            <blockquote className="border-l-2 border-gold-500 pl-5 mb-8">
              <p className="font-display text-xl italic text-cream/80 leading-relaxed">
                "We cook the way our grandmothers cooked — with patience, real ingredients, and desi ghee from our own farm."
              </p>
              <cite className="text-gold-500 text-sm font-body font-semibold mt-2 block not-italic">— Waqar Chattha, Founder</cite>
            </blockquote>
            <Link to="/our-story" className="btn-gold">Read Our Full Story</Link>
          </FadeUp>
          <FadeUp delay={0.2}>
            {/* Timeline preview */}
            <div className="space-y-6">
              {TIMELINE.slice(0,4).map((t, i) => (
                <div key={t.year} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border-2 border-gold-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-gold-500 text-xs font-bold">{t.year}</span>
                    </div>
                    {i < 3 && <div className="w-px flex-1 bg-dark-border mt-2" />}
                  </div>
                  <div className="pb-6">
                    <h4 className="font-body font-semibold text-cream mb-1">{t.title}</h4>
                    <p className="text-cream/50 text-sm font-body leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── Branches Preview ─────────────────────────────────────────────
function BranchesPreview() {
  return (
    <section className="section-pad bg-charcoal">
      <div className="container-custom">
        <SectionHeader label="Find Us" title={<>4 Locations, One <span className="gold-text">Uncompromised</span> Taste</>}
          subtitle="From the original F-10 flagship to our newest branch in Bahria Phase 7 — same quality, every time." />
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {BRANCHES.map((branch) => (
            <motion.div key={branch.id} variants={staggerItem}
              className={`relative p-6 border transition-all duration-300 card-lift ${
                branch.isNew ? 'border-gold-500/60 bg-gradient-to-b from-[#2a1e08] to-dark-card' : 'border-dark-border bg-dark-card hover:border-gold-500/30'
              }`}>
              {branch.isNew && (
                <div className="absolute -top-3 left-4">
                  <span className="tag-new px-3 py-1">Now Open ✨</span>
                </div>
              )}
              <div className="mb-4 mt-2">
                <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 ${
                  branch.badgeColor==='gold' ? 'text-gold-500 bg-gold-500/10' :
                  branch.badgeColor==='new'  ? 'text-green-400 bg-green-400/10' :
                  'text-ember-400 bg-ember-500/10'
                }`}>{branch.badge}</span>
              </div>
              <h3 className="font-display text-lg font-bold text-cream mb-2">{branch.name}</h3>
              <p className="text-cream/40 text-xs font-body leading-snug mb-3">{branch.address}</p>
              <div className="flex items-center gap-1.5 mb-4">
                <FaStar className="text-gold-500" size={11} />
                <span className="text-gold-500 text-xs font-bold">{branch.rating}</span>
                <span className="text-cream/30 text-xs">({branch.reviews} reviews)</span>
              </div>
              <p className="text-cream/50 text-xs font-body mb-5">⏰ {branch.hours}</p>
              <div className="flex gap-2">
                <a href={branch.foodpanda} target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center py-2 text-xs font-semibold text-charcoal"
                  style={{ background: 'linear-gradient(135deg,#D4A017,#f0c85b)' }}>Order</a>
                <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center py-2 text-xs font-semibold border border-dark-border text-cream/60 hover:border-gold-500/50 hover:text-gold-400 transition-all">
                  <FaMapMarkerAlt className="inline mr-1" size={10} />Map
                </a>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
        <FadeUp className="text-center mt-10">
          <Link to="/branches" className="btn-outline-gold">View All Branches</Link>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────
function TestimonialsSection() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a+1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[active];

  return (
    <section className="section-pad" style={{ background: 'linear-gradient(135deg,#1a1206 0%,#2a1e08 100%)' }}>
      <div className="container-custom">
        <SectionHeader label="What Our Guests Say" title={<>15,000+ Reasons to <span className="gold-text">Trust Us</span></>} />
        <div className="max-w-3xl mx-auto mt-14">
          <motion.div key={active} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
            className="text-center">
            <FaQuoteLeft className="text-gold-500/30 mx-auto mb-6" size={48} />
            <Stars rating={t.rating} size={20} />
            <p className="font-display text-xl md:text-2xl italic text-cream leading-relaxed my-6">"{t.text}"</p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center">
                <span className="text-gold-500 font-bold text-sm">{t.name[0]}</span>
              </div>
              <div className="text-left">
                <p className="text-cream font-semibold text-sm">{t.name}</p>
                <PlatformBadge platform={t.platform} />
              </div>
            </div>
          </motion.div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {TESTIMONIALS.map((_,i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i===active?'bg-gold-500 w-6':'bg-dark-border'}`} />
            ))}
          </div>
        </div>
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-20 pt-12 border-t border-dark-border">
          {STATS.map(({ value, suffix, label, platform }) => {
            const { ref, inView } = useInView({ triggerOnce:true });
            return (
              <div key={label} ref={ref} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold gold-text mb-1">
                  {inView ? <><CountUp end={value} duration={2.5} separator="," decimals={suffix==='/5'?1:0} />{suffix}</> : `0${suffix}`}
                </div>
                <p className="text-cream text-sm font-body font-semibold">{label}</p>
                <p className="text-cream/40 text-xs font-body">{platform}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Instagram Section ────────────────────────────────────────────
function InstagramSection() {
  const posts = [
    { emoji:'🫕', caption:'Desi Ghee Mutton Karahi — the one that started it all.' },
    { emoji:'🥞', caption:'Sunday Halwa Puri Platter — a family ritual since 2016.' },
    { emoji:'🍛', caption:"Chattha's Special Biryani — farm rice, fresh spices." },
    { emoji:'🔥', caption:'BBQ Night at F-10 — where the smoke tells the story.' },
    { emoji:'🥛', caption:'Namkeen Lassi in a steel glass — an Islamabad icon.' },
    { emoji:'🌅', caption:'7:30 AM. The tandoor fires up. Come taste the morning.' },
  ];
  return (
    <section className="section-pad bg-charcoal">
      <div className="container-custom">
        <SectionHeader label="Follow Us @thechatthas" title={<>The Feed That <span className="gold-text">Makes You Hungry</span></>} />
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-12">
          {posts.map((p, i) => (
            <motion.a key={i} variants={staggerItem}
              href="https://instagram.com/thechatthas" target="_blank" rel="noopener noreferrer"
              className="group relative aspect-square bg-dark-card border border-dark-border overflow-hidden flex items-center justify-center">
              <span className="text-5xl opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500">{p.emoji}</span>
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/80 transition-all duration-300 flex items-end p-3 opacity-0 group-hover:opacity-100">
                <p className="text-cream text-xs font-body leading-snug">{p.caption}</p>
              </div>
            </motion.a>
          ))}
        </StaggerContainer>
        <FadeUp className="text-center mt-8">
          <a href="https://instagram.com/thechatthas" target="_blank" rel="noopener noreferrer" className="btn-outline-gold text-xs">
            Follow on Instagram
          </a>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="section-pad relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1a1206,#2a1e08,#0f0d09)' }}>
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <span className="font-display text-[20rem] font-black text-cream select-none">C</span>
      </div>
      <div className="relative container-custom text-center">
        <FadeUp>
          <p className="section-label mb-4">Experience Authentic Taste</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-cream mb-6">
            Real Food. Real Ghee.<br /><span className="gold-text">Real Pakistan.</span>
          </h2>
          <p className="text-cream/50 font-body text-lg max-w-xl mx-auto mb-10">
            No shortcuts. No substitutes. Just the taste that makes Islamabad talk — now available in 4 locations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/order" className="btn-gold">Order Online Now</Link>
            <Link to="/contact" className="btn-outline-gold">Make a Reservation</Link>
            <Link to="/franchise" className="btn-ember">Franchise Inquiry</Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Home Page ────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <USPStrip />
      <SignatureDishes />
      <BrandStoryPreview />
      <BranchesPreview />
      <TestimonialsSection />
      <InstagramSection />
      <FinalCTA />
    </main>
  );
}
