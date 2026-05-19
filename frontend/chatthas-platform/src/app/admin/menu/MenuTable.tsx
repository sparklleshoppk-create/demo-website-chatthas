'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteMenuItem, toggleMenuItemAvailability } from './actions';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  badge: string | null;
  is_available: boolean;
  is_featured: boolean;
  categories: { name: string } | null;
}

export default function MenuTable({ menuItems }: { menuItems: MenuItem[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    const result = await deleteMenuItem(id);
    if (result?.error) {
      alert(result.error);
    }
    setDeletingId(null);
    router.refresh();
  };

  const handleToggle = async (id: string, isAvailable: boolean) => {
    await toggleMenuItemAvailability(id, isAvailable);
    router.refresh();
  };

  return (
    <div className="bg-charcoal rounded-sm border border-dark-border shadow-card overflow-hidden card-lift">
      <table className="min-w-full divide-y divide-dark-border">
        <thead className="bg-primary-black">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-bold text-cream/40 uppercase tracking-widest">Name</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-cream/40 uppercase tracking-widest">Category</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-cream/40 uppercase tracking-widest">Price</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-cream/40 uppercase tracking-widest">Badge</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-cream/40 uppercase tracking-widest">Status</th>
            <th className="px-6 py-4 text-right text-sm font-bold text-cream/40 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-border bg-charcoal">
          {menuItems.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-cream/40 text-sm">
                No menu items found. Click "+ Add Item" to create your first item.
              </td>
            </tr>
          ) : (
            menuItems.map((item) => (
              <tr key={item.id} className={`hover:bg-primary-black/30 transition-colors ${deletingId === item.id ? 'opacity-50' : ''}`}>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-display font-bold text-cream text-sm">{item.name}</p>
                    <p className="text-base font-body text-cream/40 mt-0.5 line-clamp-1">{item.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-base font-bold tracking-widest uppercase text-cream/70">{item.categories?.name || '—'}</td>
                <td className="px-6 py-4 text-sm font-bold text-gold-500 tracking-wider">Rs. {Number(item.price).toLocaleString()}</td>
                <td className="px-6 py-4">
                  {item.badge ? (
                    <span className="text-sm uppercase font-bold tracking-widest px-2 py-1 rounded-sm bg-gold-500/10 text-gold-500 border border-gold-500/20">{item.badge}</span>
                  ) : (
                    <span className="text-base text-cream/30">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggle(item.id, item.is_available)}
                    className="flex items-center gap-1.5"
                  >
                    {item.is_available ? (
                      <><FaToggleOn className="text-green-500 text-sm" /><span className="text-sm font-bold tracking-widest uppercase text-green-500">Available</span></>
                    ) : (
                      <><FaToggleOff className="text-ember-500 text-sm" /><span className="text-sm font-bold tracking-widest uppercase text-ember-500">Unavailable</span></>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => router.push(`/admin/menu/${item.id}`)}
                      className="p-2 text-cream/50 hover:text-gold-500 hover:bg-gold-500/10 rounded-sm transition-colors"
                      title="Edit"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      disabled={deletingId === item.id}
                      className="p-2 text-cream/50 hover:text-ember-500 hover:bg-ember-500/10 rounded-sm transition-colors"
                      title="Delete"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
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
