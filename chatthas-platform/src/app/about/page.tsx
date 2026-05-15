import { PageHero, SectionHeader, FadeUp, StaggerContainer, staggerItem } from '@/components/UI';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <main className="bg-charcoal">
      <PageHero 
        title="About Us" 
        subtitle="Pakistan's first farm-to-table desi dining experience." 
        breadcrumb="Home / About" 
        image="/ambiance.png"
      />

      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <div className="space-y-6">
                <SectionHeader 
                  center={false}
                  label="The Philosophy" 
                  title={<>Food with <span className="gold-text">Provenance.</span></>}
                  subtitle="We believe you deserve to know where your food comes from. At Chattha's, transparency is our main ingredient." 
                />
                <div className="space-y-4 text-cream/60 font-body">
                  <p>Most restaurants focus only on the final taste. We focus on the journey. Our founder, Waqar Chattha, personally oversees the sourcing of every major ingredient.</p>
                  <p>Our milk, sugarcane, and rice are grown on our own family farms. This isn't a marketing line—it's how we ensure that the desi ghee in your karahi is 100% pure and organic.</p>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-card p-8 border border-dark-border rounded-sm text-center">
                  <div className="text-4xl mb-3">🌾</div>
                  <h4 className="text-gold-500 font-bold text-sm uppercase tracking-widest">Own Farm</h4>
                  <p className="text-cream/40 text-xs mt-1">Sourced Directly</p>
                </div>
                <div className="bg-dark-card p-8 border border-dark-border rounded-sm text-center">
                  <div className="text-4xl mb-3">🧈</div>
                  <h4 className="text-gold-500 font-bold text-sm uppercase tracking-widest">Pure Ghee</h4>
                  <p className="text-cream/40 text-xs mt-1">No Substitutes</p>
                </div>
                <div className="bg-dark-card p-8 border border-dark-border rounded-sm text-center">
                  <div className="text-4xl mb-3">🍲</div>
                  <h4 className="text-gold-500 font-bold text-sm uppercase tracking-widest">Authentic</h4>
                  <p className="text-cream/40 text-xs mt-1">Traditional Ways</p>
                </div>
                <div className="bg-dark-card p-8 border border-dark-border rounded-sm text-center">
                  <div className="text-4xl mb-3">🛡️</div>
                  <h4 className="text-gold-500 font-bold text-sm uppercase tracking-widest">Trusted</h4>
                  <p className="text-cream/40 text-xs mt-1">15k+ Reviews</p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </main>
  );
}
