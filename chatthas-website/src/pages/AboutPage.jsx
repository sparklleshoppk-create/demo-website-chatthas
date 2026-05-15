import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaLeaf, FaHeart, FaUsers, FaMedal, FaUtensils } from 'react-icons/fa';
import { PageHero, SectionHeader, FadeUp, StaggerContainer, staggerItem } from '../components/UI';
import { TIMELINE } from '../data/brandData';
import { motion } from 'framer-motion';

const whys = [
  { icon: FaLeaf, title: 'Farm-Sourced Ingredients', desc: 'Our desi ghee, pure milk, and biryani rice come directly from our own farm. Every ingredient is hand-selected.' },
  { icon: FaHeart, title: 'Cooked with Passion', desc: 'Every dish is prepared with the same care and love that Waqar Chattha built into this brand from day one.' },
  { icon: FaUsers, title: 'Family Environment', desc: 'From rooftop seating to garden dining — every branch is designed for families to gather, eat, and make memories.' },
  { icon: FaMedal, title: 'Proven Quality', desc: '4.8/5 on Foodpanda, 15,000+ reviews, DAWN Media coverage. Our quality speaks for itself.' },
  { icon: FaUtensils, title: 'All-Day Menu', desc: 'From 7:30 AM halwa puri to midnight karahi — we serve the full spectrum of Pakistani cuisine, all day, every day.' },
];

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us — Chattha's: Pakistan's Farm-to-Table Desi Restaurant</title>
        <meta name="description" content="Learn about Chattha's restaurant, founded by Waqar Chattha in 2016. Islamabad's original farm-to-table desi food experience — from halwa puri to midnight karahi." />
      </Helmet>
      <PageHero title="About Chattha's" subtitle="Where authenticity is not a tagline — it's a promise." breadcrumb="Home / About Us" />

      {/* Introduction */}
      <section className="section-pad bg-charcoal">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <p className="section-label mb-4">Who We Are</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-cream mb-6">
                Islamabad's Most Talked-About<br /><span className="gold-text">Desi Restaurant</span>
              </h2>
              <div className="gold-divider ml-0 mb-6" />
              <p className="text-cream/60 font-body leading-relaxed mb-4">
                Chattha's was born from a simple but powerful idea: that authentic Pakistani food deserves to be served in an environment worthy of its flavours. Founded in 2016 by <strong className="text-cream">Waqar Chattha</strong> — a UK-returned professor and former co-owner of the legendary Cheema & Chattha's — the brand set out to redefine what desi food could be.
              </p>
              <p className="text-cream/60 font-body leading-relaxed mb-8">
                What started as a 40-seat restaurant in Tariq Market, F-10/2, has grown into a four-branch institution — praised by DAWN Magazine, loved by over 53,000 Facebook followers, and rated 4.8/5 by more than 15,000 Foodpanda customers.
              </p>
              <Link to="/our-story" className="btn-gold">Read Our Full Story</Link>
            </FadeUp>
            <FadeUp delay={0.2}>
              {/* Mission & Vision cards */}
              <div className="space-y-4">
                {[
                  { label:'Our Mission', icon:'🎯', text:'To make authentic Pakistani cuisine accessible without compromise — in quality, hygiene, or taste. Every dish must honour the tradition it comes from.' },
                  { label:'Our Vision', icon:'🌟', text:'To become Pakistan\'s most trusted farm-to-table restaurant brand — expanding across major cities while never losing the soul of what makes us authentic.' },
                  { label:'Our Promise', icon:'🤝', text:'Every gram of desi ghee, every grain of rice, every spice in your dish — sourced, selected, and cooked with the same care as your first visit.' },
                ].map(({ label, icon, text }) => (
                  <div key={label} className="bg-dark-card border border-dark-border p-6 hover:border-gold-500/30 transition-colors">
                    <div className="flex gap-4 items-start">
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <h4 className="font-body font-semibold text-cream mb-2">{label}</h4>
                        <p className="text-cream/50 text-sm font-body leading-relaxed">{text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-pad" style={{ background: 'linear-gradient(135deg,#1a1206,#2a1e08)' }}>
        <div className="container-custom">
          <SectionHeader label="Why Choose Chattha's" title={<>5 Reasons Islamabad <span className="gold-text">Keeps Coming Back</span></>} />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {whys.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={staggerItem}
                className="bg-charcoal/50 border border-dark-border p-8 hover:border-gold-500/40 transition-all duration-300 group">
                <div className="w-12 h-12 flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg,rgba(212,160,23,0.15),rgba(212,160,23,0.05))' }}>
                  <Icon className="text-gold-500 group-hover:scale-110 transition-transform" size={22} />
                </div>
                <h3 className="font-display text-xl font-bold text-cream mb-3">{title}</h3>
                <p className="text-cream/50 text-sm font-body leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-pad bg-charcoal">
        <div className="container-custom">
          <SectionHeader label="Brand Journey" title={<>A <span className="gold-text">Legacy</span> Built One Dish at a Time</>} />
          <div className="relative mt-14 max-w-3xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-dark-border" />
            {TIMELINE.map((t, i) => (
              <FadeUp key={t.year} delay={i * 0.1}>
                <div className="flex gap-8 mb-10">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full border-2 border-gold-500 bg-charcoal flex flex-col items-center justify-center z-10 relative">
                      <span className="text-gold-500 font-bold text-sm">{t.year}</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <h4 className="font-display text-xl font-bold text-cream mb-2">{t.title}</h4>
                    <p className="text-cream/50 font-body text-sm leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Team Culture */}
      <section className="section-pad" style={{ background:'linear-gradient(135deg,#1a1206,#2a1e08)' }}>
        <div className="container-custom text-center">
          <SectionHeader label="Our Culture" title={<>The Heart Behind <span className="gold-text">Every Dish</span></>}
            subtitle="At Chattha's, the kitchen is sacred. Every cook, every server, every team member is trained to uphold one standard: the Chattha's standard." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {[
              { title:'Kitchen Discipline', desc:'Every dish follows a strict recipe developed by Waqar Chattha himself. No improvisation — only consistency.' },
              { title:'Hygiene First', desc:'DAWN Magazine praised our hygiene in 2017. Eight years later, it remains our most non-negotiable standard.' },
              { title:'Hospitality Culture', desc:'We treat every table like a guest in our home. Your experience matters from the moment you walk in.' },
            ].map(c => (
              <FadeUp key={c.title}>
                <div className="p-8 border border-dark-border bg-charcoal/50 hover:border-gold-500/30 transition-colors">
                  <h3 className="font-display text-xl font-bold text-cream mb-3">{c.title}</h3>
                  <p className="text-cream/50 text-sm font-body leading-relaxed">{c.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
