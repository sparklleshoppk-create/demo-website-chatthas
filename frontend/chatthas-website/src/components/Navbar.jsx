import React, { useState, useEffect, memo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaWhatsapp, FaUserCircle, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const PLATFORM_URL = import.meta.env.VITE_PLATFORM_URL || 'http://localhost:5174';

const leftLinks = [
  { path: '/', label: 'Home' },
  { path: '/menu', label: 'Menu' },
  { path: '/branches', label: 'Branches' },
  { path: '/reviews', label: 'Reviews' },
];

const rightLinks = [
  { path: '/gallery', label: 'Gallery' },
  { path: '/about', label: 'About Us' },
  { path: '/contact', label: 'Contact Us' },
];

const mobileLinks = [...leftLinks, ...rightLinks, { path: '/contact', label: 'Contact' }];

const Navbar = memo(function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();

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

  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-primary-black/80 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)] py-3' : 'bg-transparent py-6'
        }`}
      >
        <div className="container-custom flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
          
          {/* Mobile Hamburger (Left on mobile) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-cream p-2 rounded-sm -ml-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>

          {/* Desktop Nav - Left */}
          <ul className="hidden lg:flex items-center justify-end gap-10 pr-12">
              <li className="mr-4">
                <a href={`${PLATFORM_URL}/profile`} className="text-cream/60 hover:text-gold-500 transition-colors" title="My Profile">
                  <FaUserCircle size={20} />
                </a>
              </li>
            {leftLinks.map(({ path, label }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `nav-link font-body text-[13px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                      isActive ? 'text-gold-500 active' : 'text-cream/80 hover:text-cream'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Logo - Centered */}
          <Link to="/" className={`flex flex-col items-center justify-center leading-none group transition-transform duration-500 mx-auto ${scrolled ? 'scale-85' : 'scale-100'}`}>
            <span className="font-display text-4xl md:text-5xl font-light italic gold-text tracking-wider">
              Chattha's
            </span>
            <span className="text-[10px] tracking-[0.4em] uppercase text-cream/40 font-body mt-1 transition-opacity duration-300">
              Restaurant Group
            </span>
          </Link>

          {/* Desktop Nav - Right */}
          <ul className="hidden lg:flex items-center justify-start gap-8 pl-8">
            {rightLinks.map(({ path, label }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `nav-link font-body text-[13px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                      isActive ? 'text-gold-500 active' : 'text-cream/80 hover:text-cream'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li className="flex items-center gap-4 ml-auto flex-shrink-0">
              <Link to="/checkout" className="text-cream/60 hover:text-gold-500 transition-colors relative" title="Cart">
                <FaShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold-500 text-primary-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/checkout" className="btn-gold py-2.5 px-6 text-[11px] font-bold tracking-[0.12em] whitespace-nowrap ml-1 rounded-sm shadow-card hover:shadow-card-hover transition-all">
                Order Now
              </Link>
            </li>
          </ul>

          <div className="lg:hidden flex items-center gap-2 sm:gap-4">
            <Link to="/checkout" className="text-cream/60 hover:text-gold-500 transition-colors relative" title="Cart">
              <FaShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold-500 text-primary-black text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/checkout" className="btn-gold py-2.5 px-5 text-[10px] font-bold tracking-[0.1em] whitespace-nowrap ml-1 rounded-sm shadow-card hover:shadow-card-hover transition-all">
              Order
            </Link>
          </div>
        </div>
      </nav>

      {/* Premium Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-primary-black flex flex-col pt-32 px-10 pb-12 lg:hidden overflow-y-auto"
          >
            <ul className="flex flex-col gap-8 flex-1">
              {mobileLinks.map(({ path, label }, i) => (
                <motion.li
                  key={path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 + 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `font-display text-3xl sm:text-4xl font-light italic transition-colors ${
                        isActive ? 'gold-text' : 'text-cream hover:text-gold-400'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mobileLinks.length * 0.08 + 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <a
                  href={`${PLATFORM_URL}/profile`}
                  className="font-display text-3xl sm:text-4xl font-light italic transition-colors text-cream hover:text-gold-400 flex items-center gap-4"
                >
                  <FaUserCircle size={28} /> My Profile
                </a>
              </motion.li>
            </ul>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-12 flex flex-col gap-6"
            >
              <div className="w-12 h-px bg-gold-500/30"></div>
              <div className="flex flex-col gap-4">
                <a href="tel:+92518444636" className="font-body text-cream/70 text-sm tracking-widest">+92 51 844 4636</a>
                <a href="mailto:info@chatthas.pk" className="font-body text-cream/70 text-sm tracking-widest">INFO@CHATTHAS.PK</a>
              </div>
              <Link to="/order" className="btn-gold w-full justify-center text-center mt-4">Start Your Order</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default Navbar;
