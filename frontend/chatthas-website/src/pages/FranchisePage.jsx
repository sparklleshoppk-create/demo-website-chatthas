import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { PageHero, FadeUp, SectionHeader } from '../components/UI';
import { BRAND } from '../data/brandData';
import { FaChartLine, FaUsers, FaShieldAlt, FaAward, FaBriefcase, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

export default function FranchisePage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', location: '', investment: '', experience: '', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

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

  const benefits = [
    { icon: FaChartLine, title: 'Proven Business Model', desc: 'Highly profitable operational model refined over years of successful branch management.' },
    { icon: FaAward, title: 'Strong Brand Equity', desc: 'Leverage a recognized and deeply loved brand with incredibly high customer loyalty.' },
    { icon: FaShieldAlt, title: 'Comprehensive Support', desc: 'Full support from site selection, architectural design, to staff training and marketing.' },
    { icon: FaUsers, title: 'Market Demand', desc: 'Tap into the massive and continuously growing demand for premium authentic desi food.' },
  ];

  return (
    <>
      <Helmet>
        <title>Franchise — Chattha's Restaurant</title>
        <meta name="description" content="Join the Chattha's family. Franchise opportunities for premium authentic Pakistani dining." />
      </Helmet>

      <PageHero title="Franchise Opportunities" subtitle={`Join the ${BRAND.name} family and bring the most authentic Pakistani dining experience to your city.`} breadcrumb="Home / Franchise" />

      {/* Benefits */}
      <section className="py-24 bg-primary-black">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((item, idx) => (
              <FadeUp key={item.title} delay={idx * 0.1}>
                <div className="bg-charcoal border border-dark-border/50 p-8 card-lift h-full">
                  <item.icon className="text-gold-500 mb-6" size={32} />
                  <h3 className="font-display text-xl font-bold text-cream mb-3">{item.title}</h3>
                  <p className="text-cream/50 text-sm font-body leading-relaxed">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-24 bg-charcoal border-t border-dark-border/50">
        <div className="container-custom max-w-4xl">
          <FadeUp className="text-center mb-16">
            <FaBriefcase className="text-gold-500 mx-auto mb-6" size={32} />
            <h2 className="font-display text-4xl font-light italic text-cream mb-4">Submit Your Proposal</h2>
            <p className="text-cream/50 font-body">Provide your details below and our franchise development team will contact you.</p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="bg-primary-black border border-dark-border/50 p-8 md:p-12">
              {isSubmitted ? (
                <div className="text-center py-10">
                  <FaCheckCircle className="text-green-500 mx-auto mb-6" size={64} />
                  <h3 className="font-display text-3xl text-cream mb-4">Application Received</h3>
                  <p className="text-cream/60 font-body max-w-md mx-auto">
                    Thank you for your interest in franchising with {BRAND.name}. Our team will contact you within 5-7 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-cream/40 uppercase tracking-widest">Full Name *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="admin-input" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-cream/40 uppercase tracking-widest">Phone Number *</label>
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="admin-input" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-cream/40 uppercase tracking-widest">Email Address *</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className="admin-input" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-cream/40 uppercase tracking-widest">Proposed City/Location *</label>
                      <input type="text" name="location" required value={formData.location} onChange={handleChange} className="admin-input" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-cream/40 uppercase tracking-widest">Investment Capital *</label>
                      <select name="investment" required value={formData.investment} onChange={handleChange} className="admin-input">
                        <option value="" disabled>Select range</option>
                        <option value="10M-30M">PKR 10M - 30M</option>
                        <option value="30M-50M">PKR 30M - 50M</option>
                        <option value="50M+">PKR 50M+</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-cream/40 uppercase tracking-widest">F&B Experience *</label>
                      <select name="experience" required value={formData.experience} onChange={handleChange} className="admin-input">
                        <option value="" disabled>Select experience level</option>
                        <option value="none">No prior F&B experience</option>
                        <option value="investor">Investor only</option>
                        <option value="some">1-3 years experience</option>
                        <option value="extensive">3+ years extensive</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-cream/40 uppercase tracking-widest">Additional Information</label>
                    <textarea name="message" rows="4" value={formData.message} onChange={handleChange} className="admin-input resize-none" placeholder="Tell us about yourself..." />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="btn-gold w-full py-4 flex items-center justify-center gap-3 text-[11px] disabled:opacity-70">
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-primary-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Submit Application <FaPaperPlane size={14} /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
