import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShieldCheck, Award, Briefcase, Send, CheckCircle2 } from 'lucide-react';
import { BRAND } from '../data/brandData';

export default function FranchisePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    investment: '',
    experience: '',
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
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', location: '', investment: '', experience: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 8000);
    }, 1500);
  };

  return (
    <div className="bg-restaurant-dark min-h-screen text-restaurant-light pb-20 pt-24">
      {/* Hero Section */}
      <section className="relative py-24 px-4 text-center">
        <div className="absolute inset-0 bg-restaurant-dark z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-restaurant-dark/90 to-restaurant-dark z-10" />
          <img 
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Business Growth" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="relative z-20 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-restaurant-gold tracking-widest uppercase text-sm font-semibold mb-4 block">Partner With Us</span>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6">Franchise Opportunities</h1>
            <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto mb-10">
              Join the {BRAND.name} family and bring the most authentic Pakistani dining experience to your city.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 relative z-30 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-restaurant-gray/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl"
          >
            <TrendingUp className="text-restaurant-gold w-12 h-12 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Proven Business Model</h3>
            <p className="text-gray-400 text-sm">Highly profitable operational model refined over years of successful branch management.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-restaurant-gray/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl"
          >
            <Award className="text-restaurant-gold w-12 h-12 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Strong Brand Equity</h3>
            <p className="text-gray-400 text-sm">Leverage a recognized and deeply loved brand with incredibly high customer loyalty.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-restaurant-gray/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl"
          >
            <ShieldCheck className="text-restaurant-gold w-12 h-12 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Comprehensive Support</h3>
            <p className="text-gray-400 text-sm">Full support from site selection, architectural design, to staff training and marketing.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-restaurant-gray/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl"
          >
            <Users className="text-restaurant-gold w-12 h-12 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Market Demand</h3>
            <p className="text-gray-400 text-sm">Tap into the massive and continuously growing demand for premium authentic desi food.</p>
          </motion.div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <Briefcase className="w-12 h-12 text-restaurant-gold mx-auto mb-6" />
          <h2 className="text-4xl font-playfair font-bold text-white mb-4">Submit Your Proposal</h2>
          <p className="text-gray-400">Please provide your details below and our franchise development team will contact you to discuss potential opportunities.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-restaurant-gray/30 p-8 md:p-12 rounded-3xl border border-white/5"
        >
          {isSubmitted ? (
            <div className="text-center py-10">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white mb-4">Application Received</h3>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                Thank you for your interest in franchising with {BRAND.name}. Our development team will review your profile and contact you within 5-7 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Full Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-restaurant-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Phone Number *</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-restaurant-gold outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-restaurant-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Proposed City/Location *</label>
                  <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-restaurant-gold outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Available Investment Capital *</label>
                  <select name="investment" required value={formData.investment} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-restaurant-gold outline-none appearance-none">
                    <option value="" disabled>Select range</option>
                    <option value="10M-30M">PKR 10M - 30M</option>
                    <option value="30M-50M">PKR 30M - 50M</option>
                    <option value="50M+">PKR 50M+</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">F&B Experience *</label>
                  <select name="experience" required value={formData.experience} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-restaurant-gold outline-none appearance-none">
                    <option value="" disabled>Select experience level</option>
                    <option value="none">No prior F&B experience</option>
                    <option value="investor">Investor only (No operations)</option>
                    <option value="some">1-3 years experience</option>
                    <option value="extensive">3+ years extensive experience</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Additional Information</label>
                <textarea name="message" rows="4" value={formData.message} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-restaurant-gold outline-none resize-none" placeholder="Tell us about yourself and why you want to partner with us..."></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg disabled:opacity-70">
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Submit Application <Send size={20} /></>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </section>
    </div>
  );
}
