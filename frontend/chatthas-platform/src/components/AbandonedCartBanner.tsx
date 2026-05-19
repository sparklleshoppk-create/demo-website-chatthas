'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaShoppingBag, FaTimes, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function AbandonedCartBanner() {
  const { items, totalPrice } = useCart();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show on order page, admin, or if already dismissed
    if (pathname.startsWith('/order') || pathname.startsWith('/admin') || dismissed) {
      setShow(false);
      return;
    }

    // Check if user has items in cart and has been away
    if (items.length > 0) {
      const lastVisit = localStorage.getItem('chatthas_last_visit');
      const now = Date.now();

      if (lastVisit) {
        const timeSinceLastVisit = now - parseInt(lastVisit);
        // Show if user was away for more than 30 minutes (1800000ms)
        if (timeSinceLastVisit > 1800000) {
          setShow(true);
        }
      }
    }

    // Update last visit timestamp
    localStorage.setItem('chatthas_last_visit', Date.now().toString());
  }, [items, pathname, dismissed]);

  // Also track page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && items.length > 0 && !dismissed) {
        const lastActive = localStorage.getItem('chatthas_last_active');
        if (lastActive) {
          const inactiveTime = Date.now() - parseInt(lastActive);
          // Show after 10 minutes of inactivity
          if (inactiveTime > 600000) {
            setShow(true);
          }
        }
      }
      if (document.visibilityState === 'hidden') {
        localStorage.setItem('chatthas_last_active', Date.now().toString());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [items, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[420px] z-50"
        >
          <div className="bg-dark-card border border-gold-500/30 rounded-sm p-6 shadow-2xl shadow-gold-500/5 backdrop-blur-sm">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-cream/20 hover:text-cream/60 transition-colors"
            >
              <FaTimes size={14} />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                <FaShoppingBag className="text-gold-500" size={18} />
              </div>
              <div className="flex-1">
                <h4 className="font-display font-bold text-cream text-lg">
                  Your plate is waiting!
                </h4>
                <p className="text-cream/50 text-sm mt-1">
                  You have <span className="text-gold-500 font-bold">{items.length} item{items.length > 1 ? 's' : ''}</span> worth <span className="text-gold-500 font-bold">Rs. {totalPrice}</span> in your plate.
                </p>

                <Link
                  href="/order"
                  onClick={handleDismiss}
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gold-500 text-charcoal text-xs font-black uppercase tracking-[0.15em] rounded-sm hover:bg-gold-400 transition-colors group"
                >
                  Complete Order
                  <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
