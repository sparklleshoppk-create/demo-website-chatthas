/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-black': '#0A0A0A',
        charcoal: '#1C1C1C',
        'dark-card': '#1C1C1C',
        'dark-border': '#333333',
        cream: '#FAF7F0',
        'cream-dark': '#EBE5D8',
        'stone-gray': '#888888',
        gold: {
          50:  '#fcf8eb',
          100: '#f7edcc',
          200: '#efdba3',
          300: '#e5c470',
          400: '#d9aa42',
          500: '#C9A84C', // Signature Gold
          600: '#b08b34',
          700: '#B8860B', // Deep Gold
          800: '#755823',
          900: '#634b22',
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
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        heading2: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Lato"', 'system-ui', 'sans-serif'],
        urdu: ['"Noto Nastaliq Urdu"', 'serif'],
      },
      spacing: {
        'xs-token': '8px',
        'sm-token': '16px',
        'md-token': '24px',
        'lg-token': '48px',
        'xl-token': '80px',
        '2xl-token': '120px',
        '3xl-token': '180px',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #efdba3 50%, #C9A84C 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0A0A0A 0%, #1C1C1C 100%)',
        'hero-gradient': 'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.3) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'spin-slow': 'spin 20s linear infinite',
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
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'gold': '0 0 30px rgba(201,168,76,0.3)',
        'gold-lg': '0 0 60px rgba(201,168,76,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 12px 48px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
