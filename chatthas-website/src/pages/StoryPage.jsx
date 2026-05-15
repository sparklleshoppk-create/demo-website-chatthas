import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { PageHero, SectionHeader, FadeUp, StaggerContainer, staggerItem } from '../components/UI';
import { TIMELINE } from '../data/brandData';

export default function StoryPage() {
  return (
    <>
      <Helmet>
        <title>Our Story — Chattha's: From One Branch to a Legacy</title>
        <meta name="description" content="The story of Chattha's restaurant — how Waqar Chattha turned a vision for farm-to-table Pakistani food into Islamabad's most beloved desi dining experience." />
      </Helmet>
      <PageHero title="Our Story" subtitle="Every great restaurant begins with a belief. Ours was simple: Pakistan deserves better desi food." breadcrumb="Home / Our Story" />

      {/* Origin */}
      <section className="section-pad bg-charcoal">
        <div className="container-custom max-w-4xl mx-auto">
          <FadeUp>
            <p className="section-label mb-4 text-center">Where It Began</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream text-center mb-6">
              The <span className="gold-text">Origin</span> Story
            </h2>
            <div className="gold-divider mb-10" />
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="space-y-6 text-cream/60 font-body text-lg leading-relaxed">
              <p>Long before the rooftop at F-10 was built, before the Bahria Town expansion, before 15,000 Foodpanda reviews — there was one man and one belief.</p>
              <p><strong className="text-cream">Waqar Chattha</strong> had spent years in the UK, returned to Pakistan, and found himself teaching at a local Islamabad university. But food — specifically, authentic Pakistani desi food — was always on his mind. He had co-founded the beloved <strong className="text-cream">Cheema & Chattha's</strong> in F-11, which became a neighbourhood institution. But Waqar had a bigger vision.</p>
              <p>He wanted a restaurant where <strong className="text-cream">you knew exactly where every ingredient came from.</strong> Where the desi ghee wasn't imported, diluted, or substituted. Where the milk in your lassi came from a real farm. Where the rice in your biryani was grown on land he personally oversaw.</p>
              <p>In 2016, he opened the first <strong className="text-cream">Chattha's</strong> in Tariq Market, F-10/2 — 40 seats, one kitchen, and one unbreakable rule: <em>no shortcuts, ever.</em></p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Founder */}
      <section className="section-pad" style={{ background:'linear-gradient(135deg,#1a1206,#2a1e08)' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp delay={0.1}>
              <div className="space-y-6 text-cream/60 font-body text-base leading-relaxed">
                <p className="section-label">The Founder</p>
                <h2 className="font-display text-4xl font-bold text-cream">
                  Waqar Chattha — <span className="gold-text">The Visionary</span>
                </h2>
                <div className="gold-divider ml-0" />
                <p>A professor by profession, a restaurateur by passion, Waqar Chattha is the kind of founder who knows every dish on his menu not just by name — but by the farm it came from.</p>
                <p>His philosophy was shaped by years of observing what Pakistan's food scene lacked: a restaurant that took pride in provenance. Not just taste, but truth. <em>"Where does this food come from?"</em> was the question no other desi restaurant was asking — and Waqar made it his founding principle.</p>
                <p>He created Chattha's signature <strong className="text-cream">Sugarcane Brownie</strong> himself — replacing crystal sugar with sugarcane to give it a local, authentic flavour. He personally developed the whole wheat tandoori paratha that DAWN Magazine later called "the ace up Chattha's sleeve."</p>
                <blockquote className="border-l-2 border-gold-500 pl-5 italic text-cream/80 font-display text-xl">
                  "I wanted to prove that authentic Pakistani food and a world-class dining experience are not mutually exclusive."
                  <cite className="text-gold-500 text-sm block mt-2 not-italic font-body">— Waqar Chattha</cite>
                </blockquote>
              </div>
            </FadeUp>
            <FadeUp>
              <div className="relative aspect-[4/5] bg-dark-card border border-gold-500/20 flex items-center justify-center overflow-hidden">
                <div className="text-center p-12">
                  <div className="w-32 h-32 rounded-full border-2 border-gold-500/40 bg-gold-500/10 flex items-center justify-center mx-auto mb-6">
                    <span className="font-display text-5xl font-bold gold-text">WC</span>
                  </div>
                  <p className="font-display text-2xl font-bold text-cream">Waqar Chattha</p>
                  <p className="text-gold-500 text-sm font-body mt-1">Founder & Visionary</p>
                  <p className="text-cream/40 text-xs font-body mt-2">Chattha's Restaurant — Est. 2016</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background:'linear-gradient(90deg,transparent,#D4A017,transparent)' }} />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Growth Journey */}
      <section className="section-pad bg-charcoal">
        <div className="container-custom">
          <SectionHeader label="The Growth" title={<>From 40 Seats to <span className="gold-text">4 Cities</span></>}
            subtitle="Every expansion was earned. Every branch is a testament to what happens when a city falls in love with real food." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {TIMELINE.map((t, i) => (
              <FadeUp key={t.year} delay={i*0.1}>
                <div className="p-8 bg-dark-card border border-dark-border hover:border-gold-500/30 transition-colors">
                  <div className="font-display text-5xl font-black gold-text mb-4 opacity-60">{t.year}</div>
                  <h3 className="font-display text-xl font-bold text-cream mb-3">{t.title}</h3>
                  <p className="text-cream/50 text-sm font-body leading-relaxed">{t.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Authenticity */}
      <section className="section-pad" style={{ background:'linear-gradient(135deg,#1a1206,#2a1e08)' }}>
        <div className="container-custom text-center max-w-3xl mx-auto">
          <SectionHeader label="Authenticity" title={<>The <span className="gold-text">Farm-to-Table</span> Promise</>}
            subtitle="When Waqar says 'farm-to-table,' he means it literally. Not as a marketing line. As a daily operational commitment." />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {[
              { emoji:'🌾', title:'Own-Farm Rice', desc:'The biryani rice is grown on Chattha\'s own farmland. Not sourced. Grown.' },
              { emoji:'🐄', title:'Fresh Farm Milk', desc:'The lassi, the chai, the handi — all made with pure milk from the farm. Daily.' },
              { emoji:'🧈', title:'Organic Desi Ghee', desc:'The desi ghee — the cornerstone of every dish — is organic, farm-sourced, and uncompromised.' },
            ].map(c => (
              <motion.div key={c.title} variants={staggerItem}
                className="p-8 border border-dark-border bg-charcoal/50 hover:border-gold-500/30 transition-colors">
                <div className="text-5xl mb-4">{c.emoji}</div>
                <h3 className="font-display text-xl font-bold text-cream mb-3">{c.title}</h3>
                <p className="text-cream/50 text-sm font-body leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Founder Message */}
      <section className="section-pad bg-charcoal">
        <div className="container-custom max-w-3xl mx-auto text-center">
          <FadeUp>
            <p className="section-label mb-6">A Message from Our Founder</p>
            <FaQuoteLeft className="text-gold-500/30 mx-auto mb-6" size={48} />
            <p className="font-display text-2xl md:text-3xl italic text-cream leading-relaxed mb-8">
              "This was never about running a restaurant. It was about proving that Pakistani food — cooked right, sourced right, and served right — can stand alongside any cuisine in the world. We are just getting started."
            </p>
            <p className="text-gold-500 font-semibold font-body">— Waqar Chattha, Founder</p>
            <div className="gold-divider mt-8 mb-8" />
            <p className="text-cream/50 font-body">
              With 4 branches across Islamabad and Rawalpindi, and plans for continued expansion — the vision is alive, growing, and as hungry as ever.
            </p>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

function FaQuoteLeft({ className, size }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>;
}
