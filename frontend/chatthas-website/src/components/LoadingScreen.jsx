import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      id="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
        {/* Top Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: 'clamp(360px, 32vw, 500px)',
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, #C9A84C 15%, #efdba3 50%, #C9A84C 85%, transparent 100%)',
            transformOrigin: 'center',
          }}
        />

        {/* Pre-Logo Tagline (Above Logo) */}
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: '0.7rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            margin: 0,
            paddingLeft: '0.4em', /* Balance out the letter-spacing on the right */
          }}
        >
          Authentic Pakistani Cuisine
        </motion.p>

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.15em' }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 700,
            margin: 0,
            paddingLeft: '0.15em', /* Balance out the letter-spacing on the right */
            background: 'linear-gradient(135deg, #C9A84C, #efdba3, #C9A84C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Chattha's
        </motion.h1>

        {/* Slogan */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: 'easeOut' }}
          style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: '0.7rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(250, 247, 240, 0.5)',
            margin: 0,
            paddingLeft: '0.35em', /* Balance out the letter-spacing on the right */
          }}
        >
          Making Desi Food Great Again
        </motion.p>

        {/* Bottom Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: 'clamp(360px, 32vw, 500px)',
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, #C9A84C 15%, #efdba3 50%, #C9A84C 85%, transparent 100%)',
            transformOrigin: 'center',
          }}
        />
      </div>
    </motion.div>
  );
}
