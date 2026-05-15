import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import LoadingScreen from './components/LoadingScreen';

// Lazy loading pages for code splitting and better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const StoryPage = lazy(() => import('./pages/StoryPage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const BranchesPage = lazy(() => import('./pages/BranchesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const OrderOnlinePage = lazy(() => import('./pages/OrderOnlinePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const OwnerMessagePage = lazy(() => import('./pages/OwnerMessagePage'));
const FranchisePage = lazy(() => import('./pages/FranchisePage'));

import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
};

function AnimatedRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Suspense fallback={<LoadingScreen />}>
          <Routes location={location}>
            {/* Public pages */}
            <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
            <Route path="/about" element={<><Navbar /><AboutPage /><Footer /></>} />
            <Route path="/our-story" element={<><Navbar /><StoryPage /><Footer /></>} />
            <Route path="/menu" element={<><Navbar /><MenuPage /><Footer /></>} />
            <Route path="/branches" element={<><Navbar /><BranchesPage /><Footer /></>} />
            <Route path="/gallery" element={<><Navbar /><GalleryPage /><Footer /></>} />
            <Route path="/reviews" element={<><Navbar /><ReviewsPage /><Footer /></>} />
            <Route path="/order" element={<><Navbar /><OrderOnlinePage /><Footer /></>} />
            <Route path="/contact" element={<><Navbar /><ContactPage /><Footer /></>} />
            <Route path="/owner" element={<><Navbar /><OwnerMessagePage /><Footer /></>} />
            <Route path="/franchise" element={<><Navbar /><FranchisePage /><Footer /></>} />
          </Routes>
        </Suspense>
        {!isAdmin && <WhatsAppFloat />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic loading delay for the initial splash screen
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#242424', color: '#F5EDD0', border: '1px solid #D4A017' },
          }}
        />
        {loading && <LoadingScreen />}
        {!loading && <AnimatedRoutes />}
      </BrowserRouter>
    </AuthProvider>
  );
}
