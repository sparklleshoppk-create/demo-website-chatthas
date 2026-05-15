'use client';

import { useState } from 'react';
import { submitContact } from './actions';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(fd: FormData) {
    setStatus('loading');
    const res = await submitContact(fd);
    if (res?.success) setStatus('success');
    else setStatus('error');
  }

  if (status === 'success') {
    return (
      <div className="bg-dark-card border border-gold-500/20 p-12 text-center rounded-sm">
        <FaCheckCircle className="text-gold-500 mx-auto mb-4" size={48} />
        <h3 className="text-2xl font-display font-bold text-cream mb-2">Message Sent!</h3>
        <p className="text-cream/50">Thank you for reaching out. We will get back to you shortly.</p>
        <button onClick={() => setStatus('idle')} className="mt-6 text-gold-500 font-bold uppercase tracking-widest text-xs">Send another message</button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-dark-card border border-dark-border p-8 md:p-12 rounded-sm shadow-card">
      <div>
        <label className="block text-xs font-bold text-cream/40 uppercase tracking-widest mb-2">Name *</label>
        <input name="name" required className="admin-input" placeholder="Your full name" />
      </div>
      <div>
        <label className="block text-xs font-bold text-cream/40 uppercase tracking-widest mb-2">Phone *</label>
        <input name="phone" required className="admin-input" placeholder="03xx xxxxxxx" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-bold text-cream/40 uppercase tracking-widest mb-2">Email (Optional)</label>
        <input name="email" type="email" className="admin-input" placeholder="email@example.com" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-bold text-cream/40 uppercase tracking-widest mb-2">Message *</label>
        <textarea name="message" required rows={4} className="admin-input" placeholder="How can we help you?"></textarea>
      </div>
      <div className="md:col-span-2">
        <button 
          disabled={status === 'loading'}
          className="btn-gold w-full py-4 text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending...' : <><FaPaperPlane size={14} /> Send Message</>}
        </button>
      </div>
    </form>
  );
}
