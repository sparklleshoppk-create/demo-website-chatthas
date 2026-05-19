'use client';

import React, { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaWhatsapp, FaUserCircle, FaUtensils } from 'react-icons/fa';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/our-story', label: 'Our Story' },
  { path: '/menu', label: 'Menu' },
  { path: '/branches', label: 'Branches' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/reviews', label: 'Reviews' },
  { path: '/order', label: 'Order Online' },
  { path: '/contact', label: 'Contact' },
];

const Navbar = memo(function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'liquid-glass py-3 shadow-2xl' : 'bg-charcoal/40 backdrop-blur-sm py-5'
        }`}
      >
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span className="font-display text-2xl md:text-3xl font-bold gold-text tracking-tight">
              Chattha's
            </span>
            <span className="text-[9px] tracking-[0.35em] uppercase text-cream/50 font-body mt-0.5">
              Making Desi Food Great Again
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map(({ path, label }) => {
              const isActive = pathname === path;
              return (
                <li key={path}>
                  <Link
                    href={path}
                    className={`nav-link text-sm font-body font-medium tracking-wide transition-colors duration-200 ${
                      isActive ? 'text-gold-500 active' : 'text-cream/80 hover:text-cream'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-5">
            <Link 
              href="/profile" 
              className="text-cream/70 hover:text-gold-500 transition-colors flex items-center gap-2 group"
              title="My Account"
            >
              <FaUserCircle size={22} className="group-hover:scale-110 transition-transform" />
            </Link>
            
            <Link
              href="/order"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-widest uppercase text-charcoal rounded-sm transition-all duration-300 hover:shadow-gold group"
              style={{ background: 'linear-gradient(135deg,#D4A017,#f0c85b)' }}
            >
              <FaUtensils size={14} className="group-hover:rotate-12 transition-transform" /> View Plate
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-cream p-2 rounded-sm"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 z-40 glass flex flex-col pt-24 px-8 pb-8 lg:hidden"
          >
            <ul className="flex flex-col gap-6 flex-1">
              {navLinks.map(({ path, label }, i) => {
                const isActive = pathname === path;
                return (
                  <motion.li
                    key={path}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      href={path}
                      className={`font-display text-2xl font-bold transition-colors ${
                        isActive ? 'gold-text' : 'text-cream hover:text-gold-400'
                      }`}
                    >
                      {label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <div className="flex gap-4 mt-6">
              <Link href="/order" className="btn-gold flex-1 justify-center text-center text-xs">Order Online</Link>
              <Link href="/franchise" className="btn-outline-gold flex-1 justify-center text-center text-xs">Franchise</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default Navbar;
