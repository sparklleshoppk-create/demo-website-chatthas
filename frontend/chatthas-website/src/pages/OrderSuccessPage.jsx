import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaHome, FaUtensils, FaReceipt, FaPhoneAlt } from 'react-icons/fa';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order') || '—';
  const paymentMethod = searchParams.get('method') || 'cod';
  const total = searchParams.get('total') || '0';
  const name = searchParams.get('name') || 'Valued Customer';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isOnline = paymentMethod !== 'cod';

  return (
    <>
      <Helmet>
        <title>Order Confirmed — Chattha's Restaurant</title>
        <meta name="description" content="Your order has been placed successfully at Chattha's Restaurant." />
      </Helmet>

      <div className="min-h-screen bg-primary-black pt-32 pb-24 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="relative z-10 text-center px-6 max-w-2xl mx-auto"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.2 }}
            className="w-28 h-28 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-10 text-primary-black shadow-[0_0_60px_rgba(212,160,23,0.35)]"
          >
            <FaCheckCircle size={50} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-display text-4xl md:text-6xl font-light italic text-cream mb-4 leading-tight"
          >
            Order <span className="gold-text">Confirmed!</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-cream/60 font-body text-lg mb-10"
          >
            Thank you, <span className="text-gold-500 font-semibold">{name.split(' ')[0]}</span>. 
            Your delicious meal is being prepared with love.
          </motion.p>

          {/* Order Details Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-charcoal border border-dark-border rounded-sm p-8 mb-10 shadow-card"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <FaReceipt className="text-gold-500" size={20} />
              <h3 className="font-body text-xs font-bold uppercase tracking-[0.25em] text-cream/50">Order Details</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-dark-border/30">
                <span className="text-cream/50 font-body text-sm uppercase tracking-widest">Order Number</span>
                <span className="font-display text-2xl font-bold text-gold-500">#{orderNumber}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-dark-border/30">
                <span className="text-cream/50 font-body text-sm uppercase tracking-widest">Total Amount</span>
                <span className="font-display text-xl text-cream">Rs. {Number(total).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-cream/50 font-body text-sm uppercase tracking-widest">Payment</span>
                <span className={`font-body text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-sm border ${
                  isOnline 
                    ? 'text-green-400 bg-green-500/10 border-green-500/20' 
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                }`}>
                  {isOnline ? '✓ Paid Online' : 'Cash on Delivery'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Status Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gold-500/5 border border-gold-500/20 rounded-sm p-5 mb-10"
          >
            <p className="text-sm text-gold-500/80 leading-relaxed">
              {isOnline 
                ? '✅ Payment confirmed! Your order is being processed. You will receive updates shortly.'
                : '📋 Your order has been placed! Please keep the cash ready. Our rider will collect payment upon delivery.'
              }
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/" className="btn-gold w-full sm:w-auto justify-center py-4 px-8 flex items-center gap-2">
              <FaHome size={14} /> Back to Home
            </Link>
            <Link to="/menu" className="btn-outline-gold w-full sm:w-auto justify-center py-4 px-8 flex items-center gap-2">
              <FaUtensils size={14} /> Order More
            </Link>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 pt-8 border-t border-dark-border/30"
          >
            <p className="text-cream/30 text-xs uppercase tracking-widest mb-2">Need Help?</p>
            <a 
              href="tel:+92518444636" 
              className="inline-flex items-center gap-2 text-gold-500/60 hover:text-gold-500 text-xs uppercase tracking-widest transition-colors"
            >
              <FaPhoneAlt size={10} /> Call +92 51 844 4636
            </a>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
