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
    <div className="bg-dark-card rounded-sm border border-dark-border shadow-card overflow-hidden">
      <table className="min-w-full divide-y divide-dark-border">
        <thead className="bg-charcoal">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-cream/50 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-cream/50 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-cream/50 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-cream/50 uppercase tracking-wider">Badge</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-cream/50 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-cream/50 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-border">
          {menuItems.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-cream/40 text-sm">
                No menu items found. Click "+ Add Item" to create your first item.
              </td>
            </tr>
          ) : (
            menuItems.map((item) => (
              <tr key={item.id} className={`hover:bg-dark-border/20 transition-colors ${deletingId === item.id ? 'opacity-50' : ''}`}>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-cream">{item.name}</p>
                    <p className="text-xs text-cream/40 mt-0.5 line-clamp-1">{item.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-cream/70">{item.categories?.name || '—'}</td>
                <td className="px-6 py-4 text-sm font-bold text-gold-400">Rs. {Number(item.price).toLocaleString()}</td>
                <td className="px-6 py-4">
                  {item.badge ? (
                    <span className="text-xs px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20 capitalize">{item.badge}</span>
                  ) : (
                    <span className="text-xs text-cream/30">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggle(item.id, item.is_available)}
                    className="flex items-center gap-1.5"
                  >
                    {item.is_available ? (
                      <><FaToggleOn className="text-green-400 text-lg" /><span className="text-xs text-green-400">Available</span></>
                    ) : (
                      <><FaToggleOff className="text-ember-400 text-lg" /><span className="text-xs text-ember-400">Unavailable</span></>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => router.push(`/admin/menu/${item.id}`)}
                      className="p-2 text-cream/50 hover:text-gold-400 hover:bg-gold-500/10 rounded transition-colors"
                      title="Edit"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      disabled={deletingId === item.id}
                      className="p-2 text-cream/50 hover:text-ember-400 hover:bg-ember-500/10 rounded transition-colors"
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
