'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero.png" 
          alt="Chattha's Mutton Karahi" 
          fill
          priority
          quality={90}
          className="object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
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
          className="text-cream/80 font-body text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
          Cooked in organic desi ghee from our own farm. From halwa puri to midnight karahi — across 4 branches in the twin cities.
        </motion.p>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:1.0 }}
          className="flex flex-wrap gap-4">
          <Link href="/menu" className="btn-gold">Explore Menu</Link>
          <a href="https://www.foodpanda.pk" target="_blank" rel="noopener noreferrer" className="btn-outline-gold">
            <MdDeliveryDining size={18} /> Order Online
          </a>
          <Link href="/branches" className="btn-ember">
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
    </section>
  );
}
