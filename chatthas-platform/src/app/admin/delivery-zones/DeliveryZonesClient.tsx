'use client';

import React, { useState } from 'react';
import { createDeliveryZone, updateDeliveryZone, deleteDeliveryZone } from './actions';
import { useRouter } from 'next/navigation';
import { FaPlus, FaTrash, FaMapMarkerAlt, FaTruck, FaClock, FaToggleOn, FaToggleOff } from 'react-icons/fa';

interface Branch {
  id: string;
  name: string;
}

interface Zone {
  id: string;
  name: string;
  branch_id: string;
  min_distance_km: number;
  max_distance_km: number;
  delivery_fee: number;
  estimated_time_minutes: number;
  is_active: boolean;
  branches?: { name: string };
}

export default function DeliveryZonesClient({ initialZones, branches }: { initialZones: Zone[]; branches: Branch[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);

    const res = await createDeliveryZone({
      name: fd.get('name') as string,
      branch_id: fd.get('branch_id') as string,
      min_distance_km: Number(fd.get('min_distance_km')),
      max_distance_km: Number(fd.get('max_distance_km')),
      delivery_fee: Number(fd.get('delivery_fee')),
      estimated_time_minutes: Number(fd.get('estimated_time_minutes')),
    });

    if (res.error) {
      alert(res.error);
    } else {
      setShowForm(false);
      router.refresh();
    }
    setSaving(false);
  };

  const handleToggle = async (zone: Zone) => {
    await updateDeliveryZone(zone.id, { is_active: !zone.is_active });
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this delivery zone?')) return;
    await deleteDeliveryZone(id);
    router.refresh();
  };

  // Group zones by branch
  const grouped = initialZones.reduce((acc: Record<string, Zone[]>, zone) => {
    const branchName = zone.branches?.name || 'Unassigned';
    if (!acc[branchName]) acc[branchName] = [];
    acc[branchName].push(zone);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Add Zone Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-6 py-3 text-sm font-bold bg-gold-500 text-charcoal rounded-sm hover:bg-gold-400 transition-colors flex items-center gap-2"
      >
        <FaPlus size={12} /> Add Delivery Zone
      </button>

      {/* Add Zone Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-dark-card border border-dark-border p-8 rounded-sm space-y-6">
          <h3 className="text-lg font-display font-bold text-cream">New Delivery Zone</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-cream/40 uppercase tracking-widest">Zone Name</label>
              <input name="name" required placeholder="e.g. Near Zone" className="admin-input" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-cream/40 uppercase tracking-widest">Branch</label>
              <select name="branch_id" required className="admin-input">
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-cream/40 uppercase tracking-widest">Min Distance (km)</label>
              <input name="min_distance_km" type="number" step="0.1" defaultValue="0" required className="admin-input" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-cream/40 uppercase tracking-widest">Max Distance (km)</label>
              <input name="max_distance_km" type="number" step="0.1" required placeholder="e.g. 5" className="admin-input" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-cream/40 uppercase tracking-widest">Delivery Fee (Rs.)</label>
              <input name="delivery_fee" type="number" step="1" required placeholder="e.g. 150" className="admin-input" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-cream/40 uppercase tracking-widest">Est. Time (min)</label>
              <input name="estimated_time_minutes" type="number" defaultValue="30" required className="admin-input" />
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={saving} className="btn-gold px-8 py-3 text-sm">
              {saving ? 'Saving...' : 'Create Zone'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 text-sm border border-dark-border text-cream/60 hover:text-cream rounded-sm transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Zones Display */}
      {Object.keys(grouped).length === 0 ? (
        <div className="bg-dark-card border border-dashed border-dark-border p-16 text-center rounded-sm">
          <FaMapMarkerAlt className="mx-auto text-cream/10 mb-4" size={40} />
          <p className="text-cream/30 italic">No delivery zones configured yet.</p>
          <p className="text-cream/20 text-xs mt-1">Create zones to define distance-based delivery charges.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([branchName, zones]) => (
          <div key={branchName} className="space-y-4">
            <h3 className="text-sm font-black text-gold-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <FaMapMarkerAlt size={12} /> {branchName}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {zones.map(zone => (
                <div key={zone.id} className={`bg-dark-card border rounded-sm p-6 space-y-4 transition-all ${zone.is_active ? 'border-dark-border' : 'border-dark-border opacity-50'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-cream">{zone.name}</h4>
                      <p className="text-xs text-cream/40 mt-1">{zone.min_distance_km} — {zone.max_distance_km} km</p>
                    </div>
                    <button onClick={() => handleToggle(zone)} className="text-cream/40 hover:text-gold-500 transition-colors">
                      {zone.is_active ? <FaToggleOn size={20} className="text-gold-500" /> : <FaToggleOff size={20} />}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <FaTruck size={12} className="text-gold-500/60" />
                      <div>
                        <p className="text-[10px] text-cream/30 uppercase tracking-widest">Fee</p>
                        <p className="font-bold text-cream">Rs. {zone.delivery_fee}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock size={12} className="text-gold-500/60" />
                      <div>
                        <p className="text-[10px] text-cream/30 uppercase tracking-widest">Time</p>
                        <p className="font-bold text-cream">{zone.estimated_time_minutes} min</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(zone.id)}
                    className="text-[10px] text-ember-500/60 hover:text-ember-500 uppercase tracking-widest font-bold transition-colors"
                  >
                    <FaTrash size={10} className="inline mr-1" /> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
