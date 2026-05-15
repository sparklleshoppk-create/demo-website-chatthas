'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBranch, updateBranch } from '../actions';

interface Branch {
  id?: string;
  name: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  is_accepting_orders: boolean;
  display_order: number;
}

export default function BranchFormPage({ branch }: { branch?: Branch }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!branch?.id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    let result;
    if (isEditing && branch?.id) {
      result = await updateBranch(branch.id, formData);
    } else {
      result = await createBranch(formData);
    }

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push('/admin/branches');
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-cream">
          {isEditing ? 'Edit Branch' : 'Add New Branch'}
        </h2>
        <p className="text-sm text-cream/50 mt-1">
          {isEditing ? `Editing ${branch?.name}` : 'Create a new restaurant location'}
        </p>
      </div>

      <div className="bg-dark-card rounded-sm border border-dark-border shadow-card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-ember-500/10 border border-ember-500/20 text-ember-400 p-4 rounded-sm text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-cream/80 mb-1">Branch Name *</label>
              <input type="text" name="name" defaultValue={branch?.name || ''} required
                className="w-full px-3 py-2.5 border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
                placeholder="e.g. Bahria Town Phase 8" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-cream/80 mb-1">Address</label>
              <input type="text" name="address" defaultValue={branch?.address || ''}
                className="w-full px-3 py-2.5 border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
                placeholder="Full street address" />
            </div>

            <div>
              <label className="block text-sm font-medium text-cream/80 mb-1">City</label>
              <input type="text" name="city" defaultValue={branch?.city || ''}
                className="w-full px-3 py-2.5 border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
                placeholder="Islamabad" />
            </div>

            <div>
              <label className="block text-sm font-medium text-cream/80 mb-1">Phone</label>
              <input type="text" name="phone" defaultValue={branch?.phone || ''}
                className="w-full px-3 py-2.5 border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
                placeholder="+92 51 844 4636" />
            </div>

            <div>
              <label className="block text-sm font-medium text-cream/80 mb-1">Display Order</label>
              <input type="number" name="display_order" defaultValue={branch?.display_order || 0}
                className="w-full px-3 py-2.5 border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 sm:text-sm" />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                <input type="checkbox" name="is_accepting_orders" defaultChecked={branch?.is_accepting_orders ?? true}
                  className="w-4 h-4 rounded border-dark-border bg-charcoal text-gold-500 focus:ring-gold-500" />
                <span className="text-sm text-cream/80">Accepting Orders</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-dark-border">
            <button type="submit" disabled={isLoading}
              className="px-6 py-2.5 text-sm font-bold bg-gold-500 text-charcoal rounded-sm hover:bg-gold-400 disabled:opacity-50 transition-colors">
              {isLoading ? 'Saving...' : isEditing ? 'Update Branch' : 'Create Branch'}
            </button>
            <button type="button" onClick={() => router.push('/admin/branches')}
              className="px-6 py-2.5 text-sm font-medium text-cream/70 bg-dark-border rounded-sm hover:text-cream transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
