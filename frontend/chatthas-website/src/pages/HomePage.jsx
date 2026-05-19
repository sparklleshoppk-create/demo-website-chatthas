import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { FaWhatsapp, FaMapMarkerAlt, FaStar, FaQuoteLeft, FaArrowRight, FaChevronDown } from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import { SectionHeader, FadeUp, StaggerContainer, staggerItem, Stars, PlatformBadge } from '../components/UI';
import { MENU_ITEMS, BRANCHES, TESTIMONIALS, STATS, TIMELINE } from '../data/brandData';
import { apiClient } from '../api/client';

// ─── 5.1 Cinematic Hero Section ──────────────────────────────────
function HeroSection() {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [swapDuration, setSwapDuration] = useState(7000);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await apiClient('/banners');
        if (data && data.banners && data.banners.length > 0) {
          setBanners(data.banners);
        }
        if (data && data.swap_duration_ms) {
          setSwapDuration(data.swap_duration_ms);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const defaultBanners = [
    {
      id: 'default-1',
      title: "Making Desi Food\nGreat Again.",
      subtitle: "Cooked in organic desi ghee from our farm to your table. Experience the uncompromising taste of Pakistan.",
      media_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
      media_url_mobile: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
      cta_text: "Order Now",
      cta_url: "/order",
      cta_style: "primary"
    }
  ];

  const activeBanners = banners.length > 0 ? banners : defaultBanners;

  // Auto-slide transition timing — uses per-banner duration from config, falls back to global setting
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const currentBanner = activeBanners[currentSlide < activeBanners.length ? currentSlide : 0];
    const bannerDuration = currentBanner?.config?.display_duration_s
      ? currentBanner.config.display_duration_s * 1000
      : swapDuration;
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, bannerDuration);
    return () => clearTimeout(timer);
  }, [activeBanners, swapDuration, currentSlide]);

  const safeSlide = currentSlide < activeBanners.length ? currentSlide : 0;
  const activeBanner = activeBanners[safeSlide] || defaultBanners[0];
  const animType = activeBanner.animation_type || 'zoom';
  const zoomInitial = animType === 'zoom' ? { scale: 1.15 } : animType === 'slide_up' ? { scale: 1.02, y: 10 } : { scale: 1 };
  const zoomAnimate = animType === 'zoom' ? { scale: 1 } : animType === 'slide_up' ? { scale: 1, y: 0 } : { scale: 1 };
  const zoomTransition = animType === 'zoom' ? { duration: 8, ease: 'easeOut' } : { duration: 1.5, ease: 'easeOut' };

  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-primary-black">
      {/* Cinematic Ken Burns Campaign Slider */}
      <AnimatePresence>
        <motion.div 
          key={activeBanner.id || currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
        >
          {/* Gradients */}
          <div className="absolute inset-0 bg-hero-gradient z-10" />
          
          {/* Responsive Desktop Asset */}
          <motion.div 
            initial={zoomInitial}
            animate={zoomAnimate}
            transition={zoomTransition}
            className="absolute inset-0 bg-cover bg-center hidden md:block"
            style={{ backgroundImage: `url(${activeBanner.media_url})` }}
          />

          {/* Responsive Mobile Asset */}
          <motion.div 
            initial={zoomInitial}
            animate={zoomAnimate}
            transition={zoomTransition}
            className="absolute inset-0 bg-cover bg-center md:hidden"
            style={{ backgroundImage: `url(${activeBanner.media_url_mobile || activeBanner.media_url})` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Floating Content */}
      <div className="relative z-20 container-custom text-center pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBanner.id || currentSlide}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
            }}
          >
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="section-label mb-6 text-[11px] tracking-[0.3em]"
            >
              Islamabad & Rawalpindi
            </motion.p>

            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-[100px] font-light italic text-cream leading-[1.0] mb-8 max-w-5xl mx-auto whitespace-pre-line"
            >
              {activeBanner.title ? activeBanner.title.split('\\n').join('\n') : "Making Desi Food\nGreat Again."}
            </motion.h1>

            {activeBanner.subtitle && (
              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                }}
                className="text-cream/70 font-body text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light tracking-wide"
              >
                {activeBanner.subtitle}
              </motion.p>
            )}

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link 
                to={activeBanner.cta_url || '/order'} 
                className={`w-full sm:w-auto h-14 justify-center text-[11px] ${
                  activeBanner.cta_style === 'outline' ? 'btn-outline-gold' : 'btn-gold'
                }`}
              >
                {activeBanner.cta_text || 'Order Now'}
              </Link>
              {activeBanners.length === 1 && (
                <Link to="/menu" className="btn-outline-gold w-full sm:w-auto h-14 justify-center text-[11px]">
                  Explore Menu
                </Link>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cinematic Slide Pagination Dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                currentSlide === idx ? 'w-8 bg-gold-500' : 'w-2 bg-cream/30 hover:bg-cream/60'
              }`}
              title={`View slide ${idx + 1}`}
            />
          ))}
        </div>
      )}


    </section>
  );
}

// ─── 5.2 Signature Experience Strip ────────────────────────────────
function USPStrip() {
  const usps = [
    { icon: '🌿', title: 'Handcrafted Daily', desc: 'Cooked fresh every morning' },
    { icon: '🌾', title: 'Sourced Fresh', desc: 'Own-farm desi ghee & milk' },
    { icon: '📜', title: 'Signature Recipes', desc: 'Unchanged for generations' },
    { icon: '🛵', title: 'Dine or Deliver', desc: 'Twin cities wide delivery' },
  ];
  return (
    <section className="py-12 bg-charcoal border-b border-dark-border/50">
      <div className="container-custom">
        <StaggerContainer className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
          {usps.map(({ icon, title, desc }, idx) => (
            <React.Fragment key={title}>
              <motion.div variants={staggerItem} className="flex items-center gap-5 px-4 w-full md:w-auto">
                <span className="text-3xl grayscale opacity-80">{icon}</span>
                <div>
                  <h3 className="font-display text-lg font-bold text-cream tracking-wide">{title}</h3>
                  <p className="text-cream/40 text-xs font-body mt-1 uppercase tracking-widest">{desc}</p>
                </div>
              </motion.div>
              {idx < usps.length - 1 && (
                <div className="hidden md:block w-px h-12 bg-gradient-to-b from-gold-500/0 via-gold-500/30 to-gold-500/0" />
              )}
            </React.Fragment>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ─── 5.3 Featured Signature Plates ─────────────────────────────────
function SignatureDishes() {
  const [featured, setFeatured] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSignature = async () => {
      try {
        const data = await apiClient('/menu');
        if (data.items) {
          const signatureItems = data.items.filter(i =>
            (i.tags && (i.tags.includes('signature') || i.tags.includes('bestseller'))) ||
            (i.badge && (i.badge === 'signature' || i.badge === 'bestseller'))
          ).slice(0, 3);
          setFeatured(signatureItems);
        }
      } catch (error) {
        console.error('Error fetching signature items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSignature();
  }, []);

  return (
    <section className="section-pad bg-primary-black relative overflow-hidden">
      {/* Minimalist Subtle Premium Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.08] select-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-black via-transparent to-primary-black z-10" />
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=1200&auto=format&fit=crop')` }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <FadeUp>
            <p className="section-label mb-4">Signature Plates</p>
            <h2 className="font-display text-4xl md:text-5xl font-light italic text-cream leading-tight">
              The dishes that define Chattha's
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <Link to="/menu" className="btn-outline-gold px-8 py-3 text-[10px]">View Full Collection</Link>
          </FadeUp>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-64 bg-white/5 animate-pulse rounded-sm" />)
          ) : featured.map((dish) => (
            <motion.div key={dish.id} variants={staggerItem}
              className="group relative bg-charcoal rounded-[4px] overflow-hidden">

              {/* 16:9 Image Area */}
              <div className="relative aspect-video overflow-hidden bg-primary-black">
                <div className="absolute inset-0 bg-dark-gradient opacity-60 z-10 transition-opacity duration-500 group-hover:opacity-40" />
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${dish.image_url || 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?q=80&w=800&auto=format&fit=crop'})` }}
                />

                <div className="absolute top-4 left-4 z-20">
                  {dish.badge && (
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase bg-gold-500 text-primary-black px-3 py-1 rounded-[2px]">
                      {dish.badge}
                    </span>
                  )}
                </div>

                {/* Absolute overlay for hover Add to Cart */}
                <div className="absolute inset-0 z-20 flex items-end justify-center p-6 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[0.22,1,0.36,1]">
                  <Link to="/menu" className="btn-gold w-full text-center text-[11px] py-3 shadow-gold-lg">Order Now</Link>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8 border-t border-dark-border/50 group-hover:border-gold-500/30 transition-colors duration-500">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-display text-2xl font-bold text-cream group-hover:text-gold-500 transition-colors">{dish.name}</h3>
                  <span className="font-display text-xl font-bold text-gold-500">{dish.price}</span>
                </div>
                <p className="text-cream/50 text-sm font-body leading-relaxed line-clamp-2">{dish.description}</p>
              </div>

              {/* Subtle gold glow border on hover */}
              <div className="absolute inset-0 border border-gold-500/0 group-hover:border-gold-500/20 transition-colors duration-500 pointer-events-none rounded-[4px]" />
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ─── 5.4 Brand Philosophy Section ──────────────────────────────────
function BrandStoryPreview() {
  return (
    <section className="py-24 lg:py-32 bg-charcoal border-y border-dark-border relative overflow-hidden">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        {/* Soft Bronze-Gold Glow from Center-Right to accent the narrative */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[140px] translate-x-1/4" />
        {/* Soft Ember Glow from Bottom-Left */}
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-ember-500/5 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />

        {/* Luxury Background Watermark (Distinct Simmering Desi Karahi Food Texture representing authentic craft) */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-transparent to-charcoal z-10" />
        <div
          className="w-full h-full bg-cover bg-center opacity-[0.05] mix-blend-luminosity"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=1200&auto=format&fit=crop')` }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Editorial Image Left (55%) - Custom Cinematic Generated Feast Image */}
          <FadeUp className="lg:col-span-7 h-full min-h-[420px] relative">
            <div className="absolute inset-0 bg-primary-black overflow-hidden img-overlay rounded-[4px] shadow-lg">
              <div className="absolute inset-0 bg-[url('/our_story_homepage.png')] bg-cover bg-center opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-black/85 via-primary-black/40 to-transparent" />
            </div>
            {/* Overlay Quote */}
            <div className="absolute bottom-12 left-12 right-12 z-10">
              <div className="border-l-[3px] border-gold-500 pl-6">
                <p className="font-display text-2xl italic text-cream leading-relaxed drop-shadow-md">
                  "We cook the way our grandmothers cooked — with patience, real ingredients, and absolute pride."
                </p>
                <cite className="text-gold-500 text-xs font-body tracking-[0.2em] uppercase mt-4 block not-italic">Waqar Chattha, Founder</cite>
              </div>
            </div>
          </FadeUp>

          {/* Narrative Right (45%) */}
          <FadeUp delay={0.2} className="lg:col-span-5">
            <p className="section-label mb-6 text-gold-500">Our Philosophy</p>
            <h2 className="font-display text-4xl lg:text-5xl font-light text-cream leading-[1.1] mb-8">
              A commitment to the <span className="gold-text italic">authentic</span> craft.
            </h2>
            <p className="text-cream/60 font-body text-[15px] leading-[1.8] mb-6">
              Pakistan deserved better desi food. So we built something bold — with one non-negotiable rule: Farm-sourced organic desi ghee. Real milk. Real spices. Real food.
            </p>
            <p className="text-cream/60 font-body text-[15px] leading-[1.8] mb-10">
              No shortcuts. No compromises. Just the authentic taste of Pakistan, elevated for the modern dining experience.
            </p>
            <Link to="/our-story" className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-gold-500 hover:text-cream transition-colors border-b border-gold-500/30 hover:border-cream pb-1">
              Read the Full Story <FaArrowRight size={10} />
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── 5.5 Deals & Promotions ────────────────────────────────────────
function DealsSection() {
  const deals = [
    { title: 'Sunday Halwa Puri Special', desc: 'Complimentary extra Chana with every family platter before 11 AM.', badge: 'LIMITED TIME', time: '04:23:15' },
    { title: 'The Office Karahi', desc: '15% off all Karahis delivered to Blue Area & F-8 on weekdays.', badge: 'NEW', time: null },
  ];
  return (
    <section className="py-24 bg-primary-black relative overflow-hidden">
      {/* Cinematic Golden Ember & Dark Texture Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        {/* Soft Golden Focus Glow in the Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gold-500/5 rounded-full blur-[150px]" />

        {/* Premium Tandoor Sparkles / Flame Backdrop at low opacity */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-black via-transparent to-primary-black z-10" />
        <div
          className="w-full h-full bg-cover bg-center opacity-[0.05] mix-blend-screen scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop')` }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <FadeUp>
            <p className="section-label mb-4">Current Offers</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-cream leading-tight">
              Exclusive <span className="gold-text italic">Privileges</span>
            </h2>
          </FadeUp>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {deals.map((deal, i) => (
            <motion.div key={i} variants={staggerItem} className="relative bg-charcoal border border-dark-border/50 p-8 md:p-12 card-lift rounded-[4px] overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl" />

              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary-black bg-gold-500 px-3 py-1 rounded-[2px] animate-pulse">
                  {deal.badge}
                </span>
                {deal.time && (
                  <span className="font-body text-xs tracking-widest text-ember-500 font-semibold border border-ember-500/30 px-3 py-1 rounded-[2px]">
                    ⏱ {deal.time}
                  </span>
                )}
              </div>

              <h3 className="font-display text-3xl font-light text-cream mb-4">{deal.title}</h3>
              <p className="text-cream/50 text-sm font-body leading-relaxed mb-8 max-w-md">{deal.desc}</p>

              <Link to="/order" className="text-gold-500 text-[11px] uppercase tracking-[0.2em] font-semibold border-b border-gold-500/30 pb-1 hover:text-cream hover:border-cream transition-colors">
                Claim Offer
              </Link>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ─── 5.6 Crafted Live - The Kitchen Experience ─────────────────────
function CraftedLive() {
  return (
    <section className="relative py-32 lg:py-48 bg-primary-black overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-primary-black/75 z-10" />
        <div className="absolute inset-0 bg-[url('/live_kitchen_backdrop.png')] bg-cover bg-fixed bg-center opacity-35 mix-blend-screen" />
      </div>

      <div className="relative z-20 container-custom text-center">
        <FadeUp>
          <h2 className="font-display text-5xl md:text-7xl font-light text-cream italic mb-6">
            Made with Intention.
            <br />
            Served with Pride.
          </h2>
          <div className="gold-divider mb-12" />
        </FadeUp>

        <StaggerContainer className="flex flex-col md:flex-row justify-center items-center gap-12 lg:gap-24 mt-16 md:mt-24">
          {[
            { icon: '🔥', label: 'Fired Fresh' },
            { icon: '🥣', label: 'Ground Daily' },
            { icon: '🌿', label: 'Organic Ghee' }
          ].map((item) => (
            <motion.div key={item.label} variants={staggerItem} className="flex flex-col items-center gap-4">
              <span className="text-4xl grayscale opacity-70">{item.icon}</span>
              <span className="font-body text-xs tracking-[0.3em] uppercase text-gold-500">{item.label}</span>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ─── 5.7 Customer Reviews ──────────────────────────────────────────
function TestimonialsSection() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[active];

  return (
    <section className="section-pad bg-charcoal">
      <div className="container-custom">
        <div className="flex flex-col items-center text-center mb-16">
          <SectionHeader label="Social Proof" title={<>15,000+ Reasons to <span className="gold-text">Trust Us</span></>} />
          <div className="flex items-center gap-4 mt-6 bg-primary-black px-6 py-3 rounded-[4px] border border-dark-border">
            <Stars rating={4.8} size={16} />
            <span className="font-body text-sm font-bold text-cream tracking-widest">4.8 AVERAGE RATING</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-primary-black p-10 lg:p-16 border border-dark-border/50 rounded-[4px] relative card-lift">
            <FaQuoteLeft className="absolute top-10 left-10 text-gold-500/10" size={60} />
            <div className="relative z-10 text-center">
              <p className="font-display text-2xl md:text-3xl lg:text-4xl italic text-cream leading-[1.6] mb-10">"{t.text}"</p>
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-gold-500 font-body font-bold text-sm tracking-widest uppercase">{t.name}</p>
                <div className="opacity-60 grayscale scale-90"><PlatformBadge platform={t.platform} /></div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center gap-3 mt-12">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`h-[2px] transition-all duration-500 ${i === active ? 'bg-gold-500 w-12' : 'bg-dark-border w-6'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 5.8 Instagram / Social Wall ─────────────────────────────────────
function InstagramSection() {
  const posts = [
    { url: 'https://images.unsplash.com/photo-1542314831-c6a4d142986f?q=80&w=1000&auto=format&fit=crop', caption: 'Desi Ghee Mutton Karahi — the one that started it all.' },
    { url: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?q=80&w=1000&auto=format&fit=crop', caption: 'Sunday Halwa Puri Platter — a family ritual since 2016.' },
    { url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1000&auto=format&fit=crop', caption: "Chattha's Special Biryani — farm rice, fresh spices." },
    { url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop', caption: 'BBQ Night at F-10 — where the smoke tells the story.' },
    { url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=1000&auto=format&fit=crop', caption: '7:30 AM. The tandoor fires up. Come taste the morning.' },
  ];
  return (
    <section className="section-pad bg-charcoal border-t border-dark-border/50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <FadeUp>
            <p className="section-label mb-4">Follow Our Story</p>
            <h2 className="font-display text-4xl md:text-5xl font-light italic text-cream leading-tight">
              @chatthastheauthentic
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <a href="https://instagram.com/chatthastheauthentic" target="_blank" rel="noopener noreferrer" className="btn-outline-gold px-8 py-3 text-[10px]">View Instagram</a>
          </FadeUp>
        </div>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {posts.map((p, i) => (
            <motion.a key={i} variants={staggerItem}
              href="https://instagram.com/chatthastheauthentic" target="_blank" rel="noopener noreferrer"
              className="group relative aspect-square bg-primary-black overflow-hidden card-lift rounded-[4px]">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[0.22,1,0.36,1] group-hover:scale-110" style={{ backgroundImage: `url(${p.url})` }} />
              <div className="absolute inset-0 bg-primary-black/0 group-hover:bg-primary-black/80 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 p-6 text-center">
                <p className="text-cream text-[13px] font-body leading-snug">{p.caption}</p>
              </div>
            </motion.a>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ─── 5.9 Final CTA Section ─────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="relative py-32 lg:py-48 overflow-hidden bg-primary-black">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-hero-gradient z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
      </div>

      <div className="relative z-20 container-custom text-center">
        <FadeUp>
          <p className="section-label mb-6 text-[10px]">The Chattha's Experience</p>
          <h2 className="font-display text-5xl md:text-7xl font-light text-cream mb-10">
            Ready for something <span className="italic gold-text">extraordinary?</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto">
            <Link to="/order" className="btn-gold w-full sm:w-1/2 justify-center text-[11px] shadow-gold-lg">Order Now</Link>
            <Link to="/branches" className="btn-outline-gold w-full sm:w-1/2 justify-center text-[11px] bg-primary-black/50 backdrop-blur-md">Find a Branch</Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Home Page ────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="bg-primary-black">
      <HeroSection />
      <USPStrip />
      <SignatureDishes />
      <BrandStoryPreview />
      <DealsSection />
      <CraftedLive />
      <TestimonialsSection />
      <InstagramSection />
      <FinalCTA />
    </main>
  );
}
