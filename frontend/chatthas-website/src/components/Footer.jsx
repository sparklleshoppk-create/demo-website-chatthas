import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { BRANCHES, BRAND } from '../data/brandData';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111] border-t border-dark-border">
      {/* CTA Banner */}
      <div className="py-12 md:py-16" style={{ background: 'linear-gradient(135deg,#1a1206 0%,#2a1e08 50%,#1a1206 100%)' }}>
        <div className="container-custom text-center">
          <p className="section-label mb-2 md:mb-3 text-[10px] md:text-xs">Ready to Experience?</p>
          <h2 className="font-display text-2xl md:text-5xl font-bold text-cream mb-4 md:mb-6">
            Taste the <span className="gold-text">Authenticity</span>
          </h2>
          <p className="text-cream/60 font-body text-sm md:text-base mb-6 md:mb-8 max-w-xl mx-auto px-4 md:px-0">
            Cooked in organic desi ghee, from our farm to your table — across 4 locations in Islamabad & Rawalpindi.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/checkout" className="btn-gold text-xs">
              Order Directly
            </Link>
            <a href="https://www.foodpanda.pk" target="_blank" rel="noopener noreferrer" className="btn-outline-gold text-xs">
              Foodpanda
            </a>
            <Link to="/branches" className="btn-outline-gold text-xs">Find a Branch</Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-10 md:py-16 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
        {/* Brand */}
        <div>
          <Link to="/" className="block mb-4">
            <span className="font-display text-2xl md:text-3xl font-bold gold-text">Chattha's</span>
          </Link>
          <p className="text-cream/50 font-body text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
            Pakistan's original farm-to-table desi restaurant. Making Desi Food Great Again since 2016.
          </p>
          <div className="flex gap-3 mb-6 md:mb-0">
            {[
              { href: BRAND.facebook, Icon: FaFacebook },
              { href: BRAND.instagram1, Icon: FaInstagram },
              { href: `https://wa.me/${BRAND.whatsapp.replace(/\D/g, '')}`, Icon: FaWhatsapp },
            ].map(({ href, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-sm border border-dark-border flex items-center justify-center text-cream/50 hover:text-gold-500 hover:border-gold-500 transition-all duration-200"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-body font-semibold text-cream text-xs md:text-sm tracking-widest uppercase mb-3 md:mb-5">Quick Links</h4>
          <ul className="space-y-2 md:space-y-3">
            {[
              ['/', 'Home'],
              ['/about', 'About Us'],
              ['/our-story', 'Our Story'],
              ['/menu', 'Full Menu'],
              ['/branches', 'Our Branches'],
              ['/gallery', 'Gallery'],
              ['/reviews', 'Reviews'],
              ['/franchise', 'Franchise'],
            ].map(([path, label]) => (
              <li key={path}>
                <Link
                  to={path}
                  className="text-xs md:text-sm text-cream/50 hover:text-gold-400 transition-colors duration-200 font-body"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Branches */}
        <div>
          <h4 className="font-body font-semibold text-cream text-xs md:text-sm tracking-widest uppercase mb-3 md:mb-5">Our Branches</h4>
          <ul className="space-y-3 md:space-y-4">
            {BRANCHES.map((b) => (
              <li key={b.id} className="flex gap-2">
                <FaMapMarkerAlt className="text-gold-500 mt-0.5 flex-shrink-0" size={12} />
                <div>
                  <p className="text-cream/80 text-xs md:text-sm font-body font-medium">{b.name}</p>
                  <p className="text-cream/40 text-[10px] md:text-xs font-body leading-snug">{b.hours}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-body font-semibold text-cream text-xs md:text-sm tracking-widest uppercase mb-3 md:mb-5">Contact Us</h4>
          <ul className="space-y-3 md:space-y-4">
            <li className="flex gap-3 items-start">
              <FaPhoneAlt className="text-gold-500 mt-0.5 flex-shrink-0" size={13} />
              <div>
                <a href="tel:+92518444636" className="text-cream/70 hover:text-gold-400 text-xs md:text-sm font-body block">+92 51 844 4636</a>
                <a href="tel:+92518444637" className="text-cream/70 hover:text-gold-400 text-xs md:text-sm font-body block">+92 51 844 4637</a>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <FaWhatsapp className="text-gold-500 mt-0.5 flex-shrink-0" size={14} />
              <a href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, '')}`} className="text-cream/70 hover:text-gold-400 text-xs md:text-sm font-body">WhatsApp Us</a>
            </li>
            <li className="flex gap-3 items-start">
              <MdEmail className="text-gold-500 mt-0.5 flex-shrink-0" size={14} />
              <a href="mailto:info@chatthas.pk" className="text-cream/70 hover:text-gold-400 text-xs md:text-sm font-body">info@chatthas.pk</a>
            </li>
          </ul>

          {/* Newsletter */}
          <div className="mt-6 md:mt-8">
            <p className="text-cream/60 text-[10px] md:text-xs font-body mb-2 md:mb-3 uppercase tracking-wider">Get Offers & Updates</p>
            <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 w-full min-w-0 bg-dark-card border border-dark-border px-3 py-2 text-xs text-cream placeholder-cream/30 focus:outline-none focus:border-gold-500 transition-colors"
              />
              <button type="submit" className="px-4 py-2 text-xs font-semibold text-charcoal" style={{ background: 'linear-gradient(135deg,#D4A017,#f0c85b)' }}>
                Go
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-border">
        <div className="container-custom py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-cream/30 text-xs font-body">
            &copy; {year} Chattha's Restaurant. All rights reserved.
          </p>
          <p className="text-cream/20 text-xs font-body">
            Making Desi Food Great Again — Since 2016
          </p>
          <a href={import.meta.env.VITE_PLATFORM_URL ? `${import.meta.env.VITE_PLATFORM_URL}/admin/login` : "https://chatthas-platform.vercel.app/admin/login"} className="text-cream/20 hover:text-cream/40 text-xs font-body transition-colors">
            Staff Login
          </a>
        </div>
      </div>
    </footer>
  );
}
