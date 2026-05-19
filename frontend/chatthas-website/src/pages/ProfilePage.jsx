import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { PageHero, FadeUp } from '../components/UI';
import { FaUserCircle, FaHistory, FaHeart, FaMapMarkerAlt, FaCog, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const profileSections = [
  {
    icon: FaHistory,
    title: 'Order History',
    desc: 'View your past orders and re-order your favorites with one click.',
    link: '/order',
    cta: 'View Orders',
  },
  {
    icon: FaHeart,
    title: 'Saved Favorites',
    desc: 'Your handpicked collection of go-to dishes, ready when you are.',
    link: '/menu',
    cta: 'Browse Menu',
  },
  {
    icon: FaMapMarkerAlt,
    title: 'Delivery Addresses',
    desc: 'Manage your saved addresses for faster checkout.',
    link: '/branches',
    cta: 'Manage',
  },
  {
    icon: FaCog,
    title: 'Account Settings',
    desc: 'Update your name, phone, email, and notification preferences.',
    link: '/contact',
    cta: 'Settings',
  },
];

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title>My Profile — Chattha's Restaurant</title>
        <meta name="description" content="Manage your Chattha's profile, view order history, and update preferences." />
      </Helmet>

      <PageHero title="Your Profile" subtitle="Welcome back to the Chattha's experience." breadcrumb="Home / Profile" />

      <section className="py-24 lg:py-32 bg-primary-black min-h-screen">
        <div className="container-custom">
          
          {/* Profile Card */}
          <FadeUp className="max-w-3xl mx-auto mb-20">
            <div className="bg-charcoal border border-dark-border/50 p-10 md:p-14 flex flex-col sm:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-full bg-primary-black border-2 border-gold-500/30 flex items-center justify-center flex-shrink-0">
                <FaUserCircle className="text-gold-500" size={48} />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="font-display text-3xl lg:text-4xl font-light italic text-cream mb-2">
                  Welcome, <span className="gold-text">Guest</span>
                </h2>
                <p className="text-cream/50 font-body text-sm leading-relaxed mb-6">
                  Sign in to track your orders, earn Plate Points, and unlock exclusive rewards.
                </p>
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                  <a href={`${PLATFORM_URL}/auth`} target="_blank" rel="noopener noreferrer" className="btn-gold py-2.5 px-8 text-[10px] tracking-[0.15em]">
                    Sign In
                  </a>
                  <a href={`${PLATFORM_URL}/auth`} target="_blank" rel="noopener noreferrer" className="btn-outline-gold py-2.5 px-8 text-[10px] tracking-[0.15em]">
                    Create Account
                  </a>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Loyalty Points */}
          <FadeUp delay={0.1} className="max-w-3xl mx-auto mb-20">
            <div className="bg-charcoal border border-gold-500/20 p-10 text-center">
              <p className="text-gold-500 text-[10px] tracking-[0.3em] uppercase font-semibold mb-4">Plate Points</p>
              <h3 className="font-display text-6xl font-light italic gold-text mb-3">0</h3>
              <p className="text-cream/50 font-body text-sm mb-6">
                Earn 1 point for every Rs. 100 spent. Redeem 10 points for Rs. 1 off your next order.
              </p>
              <div className="w-full bg-primary-black h-2 rounded-full overflow-hidden">
                <div className="bg-gold-500 h-full rounded-full" style={{ width: '0%' }} />
              </div>
              <p className="text-cream/30 text-[10px] tracking-widest uppercase mt-3">0 / 100 points to next reward</p>
            </div>
          </FadeUp>

          {/* Quick Action Grid */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileSections.map((section, idx) => (
              <FadeUp key={section.title} delay={idx * 0.1}>
                <div className="group bg-charcoal border border-dark-border/50 p-8 card-lift h-full flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-primary-black border border-gold-500/20 flex items-center justify-center mb-6 group-hover:border-gold-500/50 transition-colors">
                    <section.icon className="text-gold-500" size={18} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-cream mb-3">{section.title}</h3>
                  <p className="text-cream/50 font-body text-sm leading-relaxed flex-grow mb-6">{section.desc}</p>
                  <Link 
                    to={section.link} 
                    className="flex items-center gap-2 text-[10px] font-semibold text-gold-500 group-hover:text-gold-300 transition-colors uppercase tracking-[0.2em]"
                  >
                    {section.cta} <FaArrowRight size={10} />
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
