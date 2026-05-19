'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteBranch, toggleBranchOrders } from './actions';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';

interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  is_accepting_orders: boolean;
}

export default function BranchCards({ branches }: { branches: Branch[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete branch "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    const result = await deleteBranch(id);
    if (result?.error) alert(result.error);
    setDeletingId(null);
    router.refresh();
  };

  const handleToggle = async (id: string, status: boolean) => {
    await toggleBranchOrders(id, status);
    router.refresh();
  };

  if (branches.length === 0) {
    return (
      <div className="bg-dark-card border border-dark-border p-12 text-center text-cream/40 text-sm rounded-sm">
        No branches found. Click "+ Add Branch" to create one.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {branches.map((branch) => (
        <div key={branch.id} className={`bg-charcoal border border-dark-border p-8 rounded-sm shadow-card card-lift ${deletingId === branch.id ? 'opacity-50' : ''}`}>
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-display font-light italic gold-text">{branch.name}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push(`/admin/branches/${branch.id}`)}
                className="p-2 text-cream/50 hover:text-gold-500 hover:bg-gold-500/10 rounded-full transition-colors"
                title="Edit"
              >
                <FaEdit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(branch.id, branch.name)}
                className="p-2 text-cream/50 hover:text-ember-500 hover:bg-ember-500/10 rounded-full transition-colors"
                title="Delete"
              >
                <FaTrash className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="text-sm font-body text-cream/70 mb-2 leading-relaxed">{branch.address || 'No address set'}</p>
          <p className="text-base font-body font-bold tracking-widest uppercase text-cream/40 mb-6">City: {branch.city || '—'} <span className="mx-2 text-gold-500">•</span> Phone: {branch.phone || '—'}</p>
          
          <button
            onClick={() => handleToggle(branch.id, branch.is_accepting_orders)}
            className={`w-full justify-center flex items-center gap-2 text-base font-bold tracking-widest uppercase px-4 py-3 rounded-sm border transition-colors ${
              branch.is_accepting_orders
                ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20'
                : 'bg-ember-500/10 text-ember-500 border-ember-500/20 hover:bg-ember-500/20'
            }`}
          >
            {branch.is_accepting_orders ? <FaToggleOn size={12} /> : <FaToggleOff size={12} />}
            {branch.is_accepting_orders ? 'Accepting Orders' : 'Closed'}
          </button>
        </div>
      ))}
    </div>
  );
}
