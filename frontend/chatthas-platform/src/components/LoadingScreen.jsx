import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      id="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Animated logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 h-px mx-auto mb-6"
          style={{ background: 'linear-gradient(90deg,transparent,#D4A017,transparent)' }}
        />
        <motion.h1
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.15em' }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-display text-5xl md:text-7xl font-bold gold-text mb-3"
        >
          Chattha's
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-xs tracking-[0.45em] uppercase text-cream/60 font-body"
        >
          Making Desi Food Great Again
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 h-px mx-auto mt-6"
          style={{ background: 'linear-gradient(90deg,transparent,#D4A017,transparent)' }}
        />
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="w-40 h-px bg-dark-border rounded-full overflow-hidden">
          <motion.div
            className="h-full"
            style={{ background: 'linear-gradient(90deg,#D4A017,#f0c85b)' }}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.8, delay: 0.3, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
