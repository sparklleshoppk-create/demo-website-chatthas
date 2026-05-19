'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSetting, updateSetting, deleteSetting } from './actions';
import { FaSave, FaTrash, FaPlus, FaCog } from 'react-icons/fa';

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
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-display font-light italic gold-text">Website Settings</h2>
          <p className="text-base tracking-widest uppercase text-cream/40 mt-2">Key-value configuration store — {settings.length} entries</p>
        </div>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="btn-gold flex items-center gap-2">
            <FaPlus size={12} /> Add Setting
          </button>
        )}
      </div>

      {/* Add Setting Form */}
      {showAddForm && (
        <div className="bg-charcoal rounded-sm border border-gold-500/20 shadow-card p-8">
          <h3 className="text-sm font-display font-light italic gold-text mb-6">Add New Setting</h3>
          <form onSubmit={handleCreate} className="space-y-5">
            {error && (
              <div className="bg-ember-500/10 border border-ember-500/20 text-ember-500 p-3 rounded-sm text-sm">{error}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Key *</label>
                <input type="text" name="key" required placeholder="site_name" className="admin-input bg-primary-black" />
              </div>
              <div>
                <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Value</label>
                <input type="text" name="value" placeholder="Chattha's" className="admin-input bg-primary-black" />
              </div>
              <div>
                <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Group *</label>
                <select name="group" required className="admin-input bg-primary-black text-base uppercase">
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
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Description</label>
              <input type="text" name="description" placeholder="A brief description..." className="admin-input bg-primary-black" />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_secret" className="w-4 h-4 rounded border-dark-border bg-charcoal text-gold-500" />
                <span className="text-base font-bold uppercase tracking-widest text-cream/70">Secret (hide from public API)</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-gold"><FaSave size={14} /> Save</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-outline-gold">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Settings Groups */}
      {Object.keys(groups).length === 0 && !showAddForm ? (
        <div className="bg-charcoal border border-dark-border p-16 text-center rounded-sm">
          <p className="text-sm font-display font-light italic gold-text mb-2">No Settings Yet</p>
          <p className="text-base tracking-widest uppercase text-cream/40">Click "Add Setting" to configure your platform.</p>
        </div>
      ) : (
        Object.entries(groups).map(([group, items]) => (
          <div key={group} className="bg-charcoal rounded-sm border border-dark-border shadow-card overflow-hidden card-lift">
            <div className="px-6 py-4 border-b border-dark-border bg-primary-black flex items-center gap-2">
              <FaCog className="text-gold-500" size={14} />
              <h3 className="text-base font-bold tracking-widest uppercase text-cream/60 capitalize">{group}</h3>
            </div>
            <div className="divide-y divide-dark-border">
              {items.map((setting) => (
                <div key={setting.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-primary-black/20 transition-colors">
                  <div className="flex-shrink-0 min-w-0">
                    <p className="text-sm font-display font-bold text-cream">{setting.key}</p>
                    <p className="text-sm tracking-widest uppercase text-cream/30 mt-0.5">{setting.description || 'No description'}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <input
                      type={setting.is_secret ? 'password' : 'text'}
                      defaultValue={setting.value || ''}
                      onChange={(e) => handleValueChange(setting.id, e.target.value)}
                      className="admin-input bg-primary-black w-52 text-base"
                    />
                    {editingValues[setting.id] !== undefined && (
                      <button onClick={() => handleSave(setting.id)}
                        className="p-2 text-green-500 hover:bg-green-500/10 rounded-sm transition-colors" title="Save">
                        <FaSave className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(setting.id, setting.key)}
                      className="p-2 text-cream/20 hover:text-ember-500 hover:bg-ember-500/10 rounded-sm transition-colors" title="Delete">
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
