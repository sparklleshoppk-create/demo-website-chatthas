'use client';

import React from 'react';
import { updateReviewStatus } from './actions';
import { FaCheck, FaTimes, FaStar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function ReviewsModerationTable({ initialReviews }: { initialReviews: any[] }) {
  const router = useRouter();
  
  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    const res = await updateReviewStatus(id, status);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="bg-charcoal border border-dark-border rounded-sm overflow-hidden shadow-card card-lift">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-primary-black border-b border-dark-border">
            <th className="px-6 py-4 text-sm font-bold text-cream/40 uppercase tracking-widest">Customer</th>
            <th className="px-6 py-4 text-sm font-bold text-cream/40 uppercase tracking-widest">Dish</th>
            <th className="px-6 py-4 text-sm font-bold text-cream/40 uppercase tracking-widest">Comment</th>
            <th className="px-6 py-4 text-sm font-bold text-cream/40 uppercase tracking-widest">Status</th>
            <th className="px-6 py-4 text-sm font-bold text-cream/40 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-border">
          {initialReviews.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-16 text-center">
                <p className="text-sm font-display font-light italic gold-text mb-1">No Reviews Yet</p>
                <p className="text-sm tracking-widest uppercase text-cream/30">Customer reviews will appear here for moderation</p>
              </td>
            </tr>
          ) : (
            initialReviews.map(review => (
              <tr key={review.id} className="hover:bg-primary-black/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-display font-bold text-cream">{review.users?.full_name || 'Guest'}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-cream/80">{review.menu_items?.name}</p>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={12} className={i < review.rating ? 'text-gold-500' : 'text-cream/10'} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 max-w-md">
                  <p className="text-base text-cream/50 italic line-clamp-2 font-body leading-relaxed">"{review.comment}"</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm px-2 py-1 rounded-sm border uppercase font-bold tracking-widest ${
                    review.status === 'approved' ? 'border-green-500/30 text-green-500 bg-green-500/5' :
                    review.status === 'rejected' ? 'border-ember-500/30 text-ember-500 bg-ember-500/5' :
                    'border-gold-500/30 text-gold-500 bg-gold-500/5'
                  }`}>
                    {review.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {review.status !== 'approved' && (
                      <button 
                        onClick={() => handleAction(review.id, 'approved')}
                        className="p-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-sm hover:bg-green-500/20 transition-all"
                      >
                        <FaCheck size={14} />
                      </button>
                    )}
                    {review.status !== 'rejected' && (
                      <button 
                        onClick={() => handleAction(review.id, 'rejected')}
                        className="p-2 bg-ember-500/10 text-ember-500 border border-ember-500/20 rounded-sm hover:bg-ember-500/20 transition-all"
                      >
                        <FaTimes size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
