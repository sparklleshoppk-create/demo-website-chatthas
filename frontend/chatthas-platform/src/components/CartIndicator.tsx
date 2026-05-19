'use client';

import { useCart } from '@/context/CartContext';
import { FaUtensils } from 'react-icons/fa';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartIndicator() {
  const { totalItems, totalPrice } = useCart();

  if (totalItems === 0) return null;

  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Link href="/order">
        <button className="bg-gold-500 text-charcoal px-6 py-4 rounded-full shadow-gold-lg flex items-center gap-3 group relative transition-all duration-300 hover:scale-105">
          <FaUtensils size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="font-bold text-xs uppercase tracking-widest">View Your Plate</span>
          <span className="bg-charcoal text-gold-500 text-[10px] min-w-[20px] h-5 flex items-center justify-center rounded-full font-black absolute -top-1 -right-1 border-2 border-gold-500">
            {totalItems}
          </span>
          <div className="absolute right-full mr-4 bg-dark-card border border-dark-border px-4 py-2 rounded-sm text-cream text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl">
            Rs. {totalPrice}
          </div>
        </button>
      </Link>
    </motion.div>
  );
}
