import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { BRAND, BRANCHES } from '../data/brandData';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', inquiryType: 'general', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="bg-charcoal min-h-screen text-cream pb-20 pt-24">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold-500 tracking-widest uppercase text-sm font-semibold mb-4 block">Get In Touch</span>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6">Contact Us</h1>
            <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
              Whether you have a question, want to make a reservation, or just want to say hello, we'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-playfair font-bold text-white mb-8">Reach Out Directly</h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500 shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Phone & WhatsApp</h3>
                  <p className="text-gray-400 mb-1">Head Office: +92 51 844 4636</p>
                  <p className="text-gray-400">WhatsApp: {BRAND.whatsapp}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500 shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Email</h3>
                  <p className="text-gray-400 mb-1">General Inquiries: {BRAND.email}</p>
                  <p className="text-gray-400">Feedback: feedback@{BRAND.website}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500 shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Operating Hours</h3>
                  <p className="text-gray-400 mb-1">Monday - Sunday</p>
                  <p className="text-gray-400">7:30 AM – 12:30 AM</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-playfair font-bold text-white mb-8">Our Locations</h2>
            <div className="space-y-4">
              {BRANCHES.map(branch => (
                <div key={branch.id} className="bg-dark-card/30 p-4 rounded-xl border border-white/5 flex items-start gap-3">
                   <MapPin size={20} className="text-gold-500 shrink-0 mt-1" />
                   <div>
                     <h4 className="text-white font-semibold">{branch.name}</h4>
                     <p className="text-sm text-gray-400 mt-1">{branch.address}</p>
                     <p className="text-xs text-gold-500 mt-2">Ph: {branch.phone}</p>
                   </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-dark-card/30 p-8 md:p-10 rounded-2xl border border-white/10"
          >
            <h2 className="text-3xl font-playfair font-bold text-white mb-2">Send a Message</h2>
            <p className="text-gray-400 mb-8">Fill out the form below and our team will get back to you promptly.</p>
            
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-green-200/70">Thank you for reaching out. We will get back to you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-300">Full Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-300">Phone Number *</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
                      placeholder="+92 3XX XXXXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="inquiryType" className="text-sm font-medium text-gray-300">Inquiry Type</label>
                  <select 
                    id="inquiryType" 
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors appearance-none"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="reservation">Reservation / Large Booking</option>
                    <option value="feedback">Feedback / Complaint</option>
                    <option value="career">Career / Job</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-300">Message *</label>
                  <textarea 
                    id="message" 
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Send Message <Send size={20} /></>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Embedded Map for Flagship */}
      <section className="mt-16 w-full h-[500px] grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
         <iframe 
          src={BRANCHES[0].mapEmbed}
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true}
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Chattha's Flagship Location"
        ></iframe>
      </section>
    </div>
  );
}
