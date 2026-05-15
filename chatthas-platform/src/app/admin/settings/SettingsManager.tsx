'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSetting, updateSetting, deleteSetting } from './actions';
import { FaSave, FaTrash, FaPlus } from 'react-icons/fa';

interface Setting {
  id: string;
  key: string;
  value: string | null;
  group: string | null;
  description: string | null;
  is_secret: boolean;
}

export default function SettingsManager({ settings }: { settings: Setting[] }) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const groups = settings.reduce((acc, setting) => {
    const group = setting.group || 'general';
    if (!acc[group]) acc[group] = [];
    acc[group].push(setting);
    return acc;
  }, {} as Record<string, Setting[]>);

  const handleValueChange = (id: string, value: string) => {
    setEditingValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id: string) => {
    const value = editingValues[id];
    if (value === undefined) return;
    const result = await updateSetting(id, value);
    if (result?.error) alert(result.error);
    else {
      setEditingValues((prev) => { const n = { ...prev }; delete n[id]; return n; });
      router.refresh();
    }
  };

  const handleDelete = async (id: string, key: string) => {
    if (!confirm(`Delete setting "${key}"?`)) return;
    await deleteSetting(id);
    router.refresh();
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await createSetting(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setShowAddForm(false);
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Setting Button / Form */}
      {showAddForm ? (
        <div className="bg-dark-card rounded-sm border border-gold-500/20 shadow-card p-6">
          <h3 className="text-lg font-display font-bold text-cream mb-4">Add New Setting</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            {error && (
              <div className="bg-ember-500/10 border border-ember-500/20 text-ember-400 p-3 rounded-sm text-sm">{error}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-cream/60 mb-1">Key *</label>
                <input type="text" name="key" required placeholder="site_name"
                  className="w-full px-3 py-2 border border-dark-border bg-charcoal text-cream rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gold-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-cream/60 mb-1">Value</label>
                <input type="text" name="value" placeholder="Chattha's"
                  className="w-full px-3 py-2 border border-dark-border bg-charcoal text-cream rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gold-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-cream/60 mb-1">Group *</label>
                <select name="group" required
                  className="w-full px-3 py-2 border border-dark-border bg-charcoal text-cream rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gold-500">
                  <option value="brand">Brand</option>
                  <option value="contact">Contact</option>
                  <option value="seo">SEO</option>
                  <option value="tracking">Tracking</option>
                  <option value="payments">Payments</option>
                  <option value="features">Features</option>
                  <option value="operating">Operating</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-cream/60 mb-1">Description</label>
              <input type="text" name="description" placeholder="A brief description..."
                className="w-full px-3 py-2 border border-dark-border bg-charcoal text-cream rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gold-500" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_secret" className="w-4 h-4 rounded border-dark-border bg-charcoal text-gold-500" />
                <span className="text-sm text-cream/70">Secret (hide from public API)</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="px-4 py-2 text-sm font-bold bg-gold-500 text-charcoal rounded-sm hover:bg-gold-400 transition-colors">
                Save Setting
              </button>
              <button type="button" onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm text-cream/70 bg-dark-border rounded-sm hover:text-cream transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-gold-500 text-charcoal rounded-sm hover:bg-gold-400 transition-colors">
          <FaPlus className="h-3 w-3" /> Add Setting
        </button>
      )}

      {/* Settings Groups */}
      {Object.keys(groups).length === 0 && !showAddForm ? (
        <div className="bg-dark-card border border-dark-border p-12 text-center rounded-sm">
          <p className="text-cream/40 text-sm">No settings configured yet. Click "Add Setting" to create your first one.</p>
        </div>
      ) : (
        Object.entries(groups).map(([group, items]) => (
          <div key={group} className="bg-dark-card rounded-sm border border-dark-border shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-dark-border bg-charcoal">
              <h3 className="font-display font-bold text-cream capitalize">{group}</h3>
            </div>
            <div className="divide-y divide-dark-border">
              {items.map((setting) => (
                <div key={setting.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex-shrink-0 min-w-0">
                    <p className="text-sm font-medium text-cream font-mono">{setting.key}</p>
                    <p className="text-xs text-cream/40 mt-0.5">{setting.description || 'No description'}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <input
                      type="text"
                      defaultValue={setting.value || ''}
                      onChange={(e) => handleValueChange(setting.id, e.target.value)}
                      className="w-48 px-3 py-1.5 text-sm border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                    {editingValues[setting.id] !== undefined && (
                      <button onClick={() => handleSave(setting.id)}
                        className="p-1.5 text-green-400 hover:bg-green-500/10 rounded transition-colors" title="Save">
                        <FaSave className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(setting.id, setting.key)}
                      className="p-1.5 text-cream/30 hover:text-ember-400 hover:bg-ember-500/10 rounded transition-colors" title="Delete">
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
