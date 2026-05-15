'use client';

import React from 'react';
import { createCategory } from './actions';

export default function CreateCategoryForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    const formData = new FormData(e.currentTarget);
    const result = await createCategory(formData);
    
    setIsSubmitting(false);
    if (result?.error) {
      setMessage(`Error: ${result.error}`);
    } else {
      setMessage('Category created successfully! ✨');
      formRef.current?.reset();
    }
  };

  return (
    <div className="space-y-4">
      <form ref={formRef} onSubmit={handleSubmit} className="bg-dark-card p-6 border border-dark-border rounded-sm space-y-4 shadow-card">
        <h3 className="text-lg font-display font-bold text-cream mb-4 text-center">Add New Category</h3>
        
        {message && (
          <div className={`p-3 text-xs font-bold text-center rounded-sm border ${message.includes('Error') ? 'bg-ember/10 border-ember text-ember' : 'bg-gold-500/10 border-gold-500 text-gold-500'}`}>
            {message}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-cream/40 uppercase mb-1 tracking-widest">Category Name</label>
          <input name="name" placeholder="e.g. Traditional Karahi" className="admin-input" required />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-cream/40 uppercase mb-1 tracking-widest">Emoji Icon</label>
          <input name="icon" placeholder="🍛" className="admin-input" />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-cream/40 uppercase mb-1 tracking-widest">Display Priority</label>
          <input name="display_order" type="number" placeholder="0" className="admin-input" />
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`btn-gold w-full py-3 mt-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Creating...' : 'Create Category'}
        </button>
      </form>
    </div>
  );
}
