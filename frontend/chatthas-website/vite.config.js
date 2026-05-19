import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    open: '/',
    proxy: {
      '/api': {
        target: 'http://localhost:5174',
      },
      '/admin': {
        target: 'http://localhost:5174',
      },
      '/_next': {
        target: 'http://localhost:5174',
      },
      '/auth': {
        target: 'http://localhost:5174',
      },
    },
  },
  preview: {
    port: 5173,
    strictPort: true,
    host: true,
    proxy: {
      '/api': { target: 'http://localhost:5174' },
      '/admin': { target: 'http://localhost:5174' },
      '/_next': { target: 'http://localhost:5174' },
      '/auth': { target: 'http://localhost:5174' },
    },
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          animations: ['framer-motion'],
        },
      },
    },
  },
});
