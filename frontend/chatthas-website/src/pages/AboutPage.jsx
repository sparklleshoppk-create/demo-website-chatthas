import React, { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PageHero, SectionHeader, FadeUp, StaggerContainer, staggerItem } from '../components/UI';
import { TIMELINE } from '../data/brandData';

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <>
      <Helmet>
        <title>About Us — Chattha's Restaurant</title>
        <meta name="description" content="Discover the story of Chattha's. How one man's vision to serve authentic Pakistani food with organic desi ghee became an Islamabad icon." />
      </Helmet>
      
      <PageHero title="Our Philosophy" subtitle="We cook the way our grandmothers cooked — with patience, real ingredients, and absolute pride." breadcrumb="Home / About" />

      {/* Editorial Introduction */}
      <section className="py-24 lg:py-32 bg-primary-black">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <FadeUp>
              <p className="text-gold-500 text-[10px] tracking-[0.3em] uppercase mb-6">The Chattha's Standard</p>
              <h2 className="font-display text-4xl lg:text-6xl font-light italic text-cream mb-10 leading-[1.2]">
                Real food requires <span className="gold-text">real integrity.</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-cream/60 font-body text-[16px] leading-[1.8] mb-8">
                When Waqar Chattha opened our first branch in 2016, the local food scene was obsessed with fast food and shortcuts. Authentic, slow-cooked Pakistani cuisine was becoming rare. He made a radical decision: to do everything the hard way.
              </p>
              <p className="text-cream/60 font-body text-[16px] leading-[1.8]">
                We source our own milk. We cultivate our own farm to produce pure, unadulterated Desi Ghee. Every grain of rice, every spice blend is meticulously vetted. We don't just serve food; we preserve heritage.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Cinematic Image Break */}
      <section className="relative h-[60vh] min-h-[500px]">
         <div className="absolute inset-0 bg-primary-black">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=2185&auto=format&fit=crop')] bg-cover bg-fixed bg-center opacity-40 mix-blend-luminosity" />
           <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-transparent to-primary-black" />
         </div>
      </section>

      {/* Animated Timeline */}
      <section className="py-32 bg-primary-black relative" ref={containerRef}>
        <div className="container-custom">
          <SectionHeader label="Our Heritage" title={<>The Journey <span className="gold-text">Forward</span></>} center={true} />
          
          <div className="max-w-5xl mx-auto mt-24 relative">
            
            {/* Center Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-dark-border/50 transform md:-translate-x-1/2">
              <motion.div 
                className="absolute top-0 left-0 right-0 bg-gold-500 origin-top"
                style={{ height: "100%", scaleY: scrollYProgress }}
              />
            </div>

            <div className="space-y-24">
              {TIMELINE.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div 
                    key={item.year}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                  >
                    
                    {/* Timeline Node */}
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary-black border-2 border-gold-500 rounded-full transform -translate-x-1/2 z-10" />

                    {/* Content */}
                    <div className={`ml-12 md:ml-0 md:w-1/2 flex ${isEven ? 'md:justify-start md:pl-16' : 'md:justify-end md:pr-16'}`}>
                      <div className="bg-charcoal p-10 border border-dark-border/50 card-lift">
                        <span className="font-display text-5xl font-light italic text-gold-500 mb-4 block">
                          {item.year}
                        </span>
                        <h3 className="font-display text-2xl font-bold text-cream mb-4">{item.title}</h3>
                        <p className="text-cream/50 font-body text-sm leading-[1.8]">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="py-32 bg-charcoal border-t border-dark-border/50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-5xl font-light italic text-cream leading-[1.4] mb-12">
              "To eat at Chattha's is to experience the uncompromising passion of Pakistani hospitality. We invite you to our table."
            </h2>
            <p className="text-gold-500 text-xs tracking-[0.3em] uppercase font-semibold">
              Waqar Chattha, Founder
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
