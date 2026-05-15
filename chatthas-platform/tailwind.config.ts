import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf9ed',
          100: '#faf0cc',
          200: '#f5de94',
          300: '#f0c85b',
          400: '#ebb22e',
          500: '#D4A017',
          600: '#b8810f',
          700: '#946210',
          800: '#7a4e14',
          900: '#664115',
        },
        ember: {
          50:  '#fff1f0',
          100: '#ffe0dd',
          200: '#ffc6c1',
          300: '#ff9f97',
          400: '#ff6a5e',
          500: '#C0392B',
          600: '#a02a1e',
          700: '#872318',
          800: '#721f16',
          900: '#621f17',
        },
        charcoal: '#1A1A1A',
        'dark-card': '#242424',
        'dark-border': '#333333',
        cream: '#F5EDD0',
        'cream-dark': '#e8dab8',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        urdu: ['"Noto Nastaliq Urdu"', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4A017 0%, #f0c85b 50%, #D4A017 100%)',
        'dark-gradient': 'linear-gradient(180deg, #1A1A1A 0%, #242424 100%)',
        'hero-gradient': 'linear-gradient(to bottom, rgba(26,26,26,0.3) 0%, rgba(26,26,26,0.7) 60%, rgba(26,26,26,1) 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-infinite': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'spin-slow': 'spin 20s linear infinite',
        'slide-infinite': 'slide-infinite 2s linear infinite',
      },
      boxShadow: {
        'gold': '0 0 30px rgba(212,160,23,0.3)',
        'gold-lg': '0 0 60px rgba(212,160,23,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 12px 48px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
export default config;
