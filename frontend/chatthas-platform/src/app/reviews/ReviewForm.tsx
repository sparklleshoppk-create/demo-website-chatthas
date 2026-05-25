'use client';

import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { submitReview } from './actions';
import { createClient } from '@/utils/supabase/client';

export default function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    }
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return;

    setStatus('submitting');
    setErrorMessage('');

    const result = await submitReview(rating, comment);

    if (result.error) {
      setStatus('error');
      setErrorMessage(result.error);
    } else {
      setStatus('success');
      setComment('');
      setRating(5);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-dark-card border border-dark-border p-8 rounded-sm text-center">
        <h3 className="text-xl font-display font-bold text-cream mb-2">Write a <span className="gold-text italic">Review</span></h3>
        <p className="text-cream/50 mb-6">Please log in to share your experience with us.</p>
        <a href="/login" className="btn-gold px-8">Log In</a>
      </div>
    );
  }

  return (
    <div className="bg-dark-card border border-dark-border p-8 rounded-sm">
      <h3 className="text-xl font-display font-bold text-cream mb-6">Write a <span className="gold-text italic">Review</span></h3>
      
      {status === 'success' ? (
        <div className="text-center py-6">
          <p className="text-green-400 font-bold mb-2">Thank you!</p>
          <p className="text-cream/70 text-sm">Your review has been submitted and will be published after admin approval.</p>
          <button onClick={() => setStatus('idle')} className="text-gold-500 text-sm mt-4 hover:underline">Write another review</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-cream/40 uppercase tracking-widest mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`transition-colors ${star <= rating ? 'text-gold-500' : 'text-cream/20 hover:text-gold-500/50'}`}
                >
                  <FaStar size={24} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-cream/40 uppercase tracking-widest mb-2">Your Experience</label>
            <textarea
              required
              minLength={5}
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-charcoal border border-dark-border text-cream rounded-sm p-4 focus:border-gold-500 outline-none transition-colors"
              placeholder="Tell us what you loved..."
            />
          </div>

          {status === 'error' && (
            <p className="text-ember-500 text-sm">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="btn-gold w-full"
          >
            {status === 'submitting' ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}
    </div>
  );
}
