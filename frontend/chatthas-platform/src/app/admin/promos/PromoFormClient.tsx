'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import { createPromo } from './actions';

export default function PromoFormClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    const fd = new FormData(e.currentTarget);
    const res = await createPromo(fd);

    if (res?.error) {
      setFeedback({ type: 'error', message: res.error });
    } else {
      setFeedback({ type: 'success', message: 'Campaign active! Promo code created.' });
      e.currentTarget.reset();
      router.refresh();
      // Auto-clear success message after 4 seconds
      setTimeout(() => setFeedback(null), 4000);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-charcoal p-8 border border-dark-border rounded-sm shadow-card card-lift space-y-5">
      <h3 className="text-sm font-display font-light italic gold-text border-b border-dark-border pb-4">Create Promo Code</h3>
      
      {feedback && (
        <div className={`p-4 text-xs font-bold tracking-widest uppercase rounded-sm border ${
          feedback.type === 'success' 
            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
            : 'bg-ember-500/10 text-ember-500 border-ember-500/20'
        }`}>
          {feedback.type === 'success' ? '✓ ' : '✗ '} {feedback.message}
        </div>
      )}

      <div>
        <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Code *</label>
        <input name="code" placeholder="SAVE20" className="admin-input bg-primary-black uppercase" required />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Type</label>
          <select name="discount_type" className="admin-input bg-primary-black text-base uppercase">
            <option value="percentage">% Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Value</label>
          <input name="discount_value" type="number" placeholder="20" className="admin-input bg-primary-black" required min="1" />
        </div>
      </div>

      <div>
        <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Min Order (Rs.)</label>
        <input name="min_order_amount" type="number" placeholder="1000" className="admin-input bg-primary-black" min="0" />
      </div>

      <div>
        <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Expiry Date</label>
        <input name="expires_at" type="date" className="admin-input bg-primary-black text-base" />
      </div>

      <button type="submit" className="btn-gold w-full justify-center py-3" disabled={isLoading}>
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin mr-2" /> Saving...
          </>
        ) : (
          <>
            <FaPlus size={12} /> Create Promo Code
          </>
        )}
      </button>
    </form>
  );
}
