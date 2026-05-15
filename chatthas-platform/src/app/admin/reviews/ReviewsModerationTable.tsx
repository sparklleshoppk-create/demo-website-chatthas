'use client';

import React, { useState } from 'react';
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
    <div className="bg-dark-card border border-dark-border rounded-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-charcoal border-b border-dark-border">
            <th className="px-6 py-4 text-xs font-bold text-cream/40 uppercase tracking-widest">Customer</th>
            <th className="px-6 py-4 text-xs font-bold text-cream/40 uppercase tracking-widest">Dish</th>
            <th className="px-6 py-4 text-xs font-bold text-cream/40 uppercase tracking-widest">Comment</th>
            <th className="px-6 py-4 text-xs font-bold text-cream/40 uppercase tracking-widest">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-cream/40 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-border">
          {initialReviews.map(review => (
            <tr key={review.id} className="hover:bg-charcoal/50 transition-colors">
              <td className="px-6 py-4">
                <p className="text-sm font-bold text-cream">{review.users?.full_name || 'Guest'}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-cream/80">{review.menu_items?.name}</p>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={10} className={i < review.rating ? 'text-gold-500' : 'text-cream/10'} />
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 max-w-md">
                <p className="text-sm text-cream/50 italic line-clamp-2">"{review.comment}"</p>
              </td>
              <td className="px-6 py-4">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold ${
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
                      <FaCheck size={12} />
                    </button>
                  )}
                  {review.status !== 'rejected' && (
                    <button 
                      onClick={() => handleAction(review.id, 'rejected')}
                      className="p-2 bg-ember-500/10 text-ember-500 border border-ember-500/20 rounded-sm hover:bg-ember-500/20 transition-all"
                    >
                      <FaTimes size={12} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
