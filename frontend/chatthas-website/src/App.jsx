import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

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
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));

function PageShell({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

function LazyPage({ children }) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      {children}
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="always">
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: { background: '#242424', color: '#F5EDD0', border: '1px solid #D4A017' },
                }}
              />
              <Routes>
                <Route path="/" element={<PageShell><HomePage /></PageShell>} />
                <Route path="/about" element={<PageShell><LazyPage><AboutPage /></LazyPage></PageShell>} />
                <Route path="/our-story" element={<PageShell><LazyPage><StoryPage /></LazyPage></PageShell>} />
                <Route path="/menu" element={<PageShell><LazyPage><MenuPage /></LazyPage></PageShell>} />
                <Route path="/branches" element={<PageShell><LazyPage><BranchesPage /></LazyPage></PageShell>} />
                <Route path="/gallery" element={<PageShell><LazyPage><GalleryPage /></LazyPage></PageShell>} />
                <Route path="/reviews" element={<PageShell><LazyPage><ReviewsPage /></LazyPage></PageShell>} />
                <Route path="/order" element={<PageShell><LazyPage><OrderOnlinePage /></LazyPage></PageShell>} />
                <Route path="/contact" element={<PageShell><LazyPage><ContactPage /></LazyPage></PageShell>} />
                <Route path="/owner" element={<PageShell><LazyPage><OwnerMessagePage /></LazyPage></PageShell>} />
                <Route path="/franchise" element={<PageShell><LazyPage><FranchisePage /></LazyPage></PageShell>} />
                <Route path="/profile" element={<PageShell><LazyPage><ProfilePage /></LazyPage></PageShell>} />
                <Route path="/checkout" element={<PageShell><LazyPage><CheckoutPage /></LazyPage></PageShell>} />
                <Route path="/order-success" element={<PageShell><LazyPage><OrderSuccessPage /></LazyPage></PageShell>} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
