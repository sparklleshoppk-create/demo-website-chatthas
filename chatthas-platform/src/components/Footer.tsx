'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

// We'll replace these with dynamic data from Supabase later
const BRANCHES = [
  { id: 1, name: 'Tariq Market F-10/2', hours: '7:30 AM – 12:30 AM' },
  { id: 2, name: 'Beverly Centre F-6', hours: '7:30 AM – 12:30 AM' },
  { id: 3, name: 'Bahria Town Phase 4', hours: '7:30 AM – 12:30 AM' },
  { id: 4, name: 'Bahria Phase 7', hours: '7:30 AM – 12:30 AM' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111] border-t border-dark-border mt-auto">
      {/* CTA Banner */}
      <div className="py-16" style={{ background: 'linear-gradient(135deg,#1a1206 0%,#2a1e08 50%,#1a1206 100%)' }}>
        <div className="container-custom text-center">
          <p className="section-label mb-3">Ready to Experience?</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-6">
            Taste the <span className="gold-text">Authenticity</span>
          </h2>
          <p className="text-cream/60 font-body mb-8 max-w-xl mx-auto">
            Cooked in organic desi ghee, from our farm to your table — across 4 locations in Islamabad & Rawalpindi.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/menu" className="btn-gold text-xs">
              Order from Website
            </Link>
            <Link href="/branches" className="btn-outline-gold text-xs">Find a Branch</Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {/* Brand */}
        <div>
          <Link href="/" className="block mb-4">
            <span className="font-display text-3xl font-bold gold-text">Chattha's</span>
          </Link>
          <p className="text-cream/50 font-body text-sm leading-relaxed mb-6">
            Pakistan's original farm-to-table desi restaurant. Making Desi Food Great Again since 2016.
          </p>
          <div className="flex gap-3">
            {[
              { href: 'https://facebook.com/Chatthas', Icon: FaFacebook },
              { href: 'https://instagram.com/chatthastheauthentic', Icon: FaInstagram },
              { href: 'https://wa.me/923001234567', Icon: FaWhatsapp },
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
          <h4 className="font-body font-semibold text-cream text-sm tracking-widest uppercase mb-5">Quick Links</h4>
          <ul className="space-y-3">
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
                  href={path}
                  className="text-sm text-cream/50 hover:text-gold-400 transition-colors duration-200 font-body"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Branches */}
        <div>
          <h4 className="font-body font-semibold text-cream text-sm tracking-widest uppercase mb-5">Our Branches</h4>
          <ul className="space-y-4">
            {BRANCHES.map((b) => (
              <li key={b.id} className="flex gap-2">
                <FaMapMarkerAlt className="text-gold-500 mt-0.5 flex-shrink-0" size={12} />
                <div>
                  <p className="text-cream/80 text-sm font-body font-medium">{b.name}</p>
                  <p className="text-cream/40 text-xs font-body leading-snug">{b.hours}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-body font-semibold text-cream text-sm tracking-widest uppercase mb-5">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <FaPhoneAlt className="text-gold-500 mt-0.5 flex-shrink-0" size={13} />
              <div>
                <a href="tel:+92518444636" className="text-cream/70 hover:text-gold-400 text-sm font-body block">+92 51 844 4636</a>
                <a href="tel:+92518444637" className="text-cream/70 hover:text-gold-400 text-sm font-body block">+92 51 844 4637</a>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <FaWhatsapp className="text-gold-500 mt-0.5 flex-shrink-0" size={14} />
              <a href="https://wa.me/923001234567" className="text-cream/70 hover:text-gold-400 text-sm font-body">WhatsApp Us</a>
            </li>
            <li className="flex gap-3 items-start">
              <MdEmail className="text-gold-500 mt-0.5 flex-shrink-0" size={14} />
              <a href="mailto:info@chatthas.pk" className="text-cream/70 hover:text-gold-400 text-sm font-body">info@chatthas.pk</a>
            </li>
          </ul>
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
          <Link href="/admin/login" className="text-cream/20 hover:text-cream/40 text-xs font-body transition-colors">
            Staff Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
