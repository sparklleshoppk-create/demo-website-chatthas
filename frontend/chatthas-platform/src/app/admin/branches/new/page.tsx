'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBranch, updateBranch } from '../actions';
import { FaMapMarkerAlt, FaClock, FaTruck } from 'react-icons/fa';

interface Branch {
  id?: string;
  name: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  is_accepting_orders: boolean;
  display_order: number;
  lat?: number | null;
  lng?: number | null;
  google_maps_url?: string | null;
  operating_hours?: any;
  delivery_radius_km?: number | null;
  min_delivery_order?: number | null;
}

const DEFAULT_HOURS = {
  monday: { open: '11:00', close: '23:00', is_open: true },
  tuesday: { open: '11:00', close: '23:00', is_open: true },
  wednesday: { open: '11:00', close: '23:00', is_open: true },
  thursday: { open: '11:00', close: '23:00', is_open: true },
  friday: { open: '11:00', close: '23:30', is_open: true },
  saturday: { open: '11:00', close: '23:30', is_open: true },
  sunday: { open: '11:00', close: '23:00', is_open: true },
};

export default function BranchFormPage({ branch }: { branch?: Branch }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!branch?.id;

  const [operatingHours, setOperatingHours] = useState<any>(
    branch?.operating_hours || DEFAULT_HOURS
  );

  const updateDay = (day: string, field: string, value: any) => {
    setOperatingHours((prev: any) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set('operating_hours', JSON.stringify(operatingHours));

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

  const mapsEmbedUrl = branch?.lat && branch?.lng
    ? `https://maps.google.com/maps?q=${branch.lat},${branch.lng}&z=15&output=embed`
    : branch?.google_maps_url
    ? branch.google_maps_url
    : null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-sm font-display font-light italic gold-text">
          {isEditing ? 'Edit Branch' : 'Add New Branch'}
        </h2>
        <p className="text-base tracking-widest uppercase text-cream/40 mt-2">
          {isEditing ? `Editing ${branch?.name}` : 'Create a new restaurant location'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-ember-500/10 border border-ember-500/20 text-ember-500 p-4 rounded-sm text-sm">
            {error}
          </div>
        )}

        {/* Section 1: Basic Info */}
        <div className="bg-charcoal rounded-sm border border-dark-border shadow-card p-8">
          <h3 className="text-base font-bold tracking-widest uppercase text-cream/40 mb-6 pb-3 border-b border-dark-border flex items-center gap-2">
            <FaMapMarkerAlt className="text-gold-500" /> Branch Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Branch Name *</label>
              <input type="text" name="name" defaultValue={branch?.name || ''} required
                className="admin-input bg-primary-black"
                placeholder="e.g. Bahria Town Phase 8" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Address</label>
              <input type="text" name="address" defaultValue={branch?.address || ''}
                className="admin-input bg-primary-black"
                placeholder="Full street address" />
            </div>
            <div>
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">City</label>
              <input type="text" name="city" defaultValue={branch?.city || ''}
                className="admin-input bg-primary-black" placeholder="Rawalpindi" />
            </div>
            <div>
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Phone</label>
              <input type="text" name="phone" defaultValue={branch?.phone || ''}
                className="admin-input bg-primary-black" placeholder="+92 51 844 4636" />
            </div>
            <div>
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Display Order</label>
              <input type="number" name="display_order" defaultValue={branch?.display_order || 0}
                className="admin-input bg-primary-black" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                <input type="checkbox" name="is_accepting_orders" defaultChecked={branch?.is_accepting_orders ?? true}
                  className="w-4 h-4 rounded border-dark-border bg-charcoal text-gold-500 focus:ring-gold-500" />
                <span className="text-base font-bold uppercase tracking-widest text-cream/80">Accepting Orders</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Location Intelligence */}
        <div className="bg-charcoal rounded-sm border border-dark-border shadow-card p-8">
          <h3 className="text-base font-bold tracking-widest uppercase text-cream/40 mb-6 pb-3 border-b border-dark-border flex items-center gap-2">
            <FaMapMarkerAlt className="text-gold-500" /> Location Intelligence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Latitude</label>
              <input type="number" step="any" name="lat" defaultValue={branch?.lat || ''}
                className="admin-input bg-primary-black" placeholder="33.6844" />
            </div>
            <div>
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Longitude</label>
              <input type="number" step="any" name="lng" defaultValue={branch?.lng || ''}
                className="admin-input bg-primary-black" placeholder="73.0479" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Google Maps Embed URL</label>
              <input type="text" name="google_maps_url" defaultValue={branch?.google_maps_url || ''}
                className="admin-input bg-primary-black"
                placeholder="https://maps.google.com/maps?q=..." />
            </div>
          </div>

          {/* Map Preview */}
          {mapsEmbedUrl && (
            <div className="mt-6 rounded-sm overflow-hidden border border-dark-border">
              <iframe
                src={mapsEmbedUrl}
                width="100%" height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>

        {/* Section 3: Delivery Configuration */}
        <div className="bg-charcoal rounded-sm border border-dark-border shadow-card p-8">
          <h3 className="text-base font-bold tracking-widest uppercase text-cream/40 mb-6 pb-3 border-b border-dark-border flex items-center gap-2">
            <FaTruck className="text-gold-500" /> Delivery Zone Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Delivery Radius (KM)</label>
              <input type="number" step="0.1" name="delivery_radius_km" defaultValue={branch?.delivery_radius_km || 10}
                className="admin-input bg-primary-black" placeholder="10" />
            </div>
            <div>
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Min Order for Delivery (Rs.)</label>
              <input type="number" name="min_delivery_order" defaultValue={branch?.min_delivery_order || 500}
                className="admin-input bg-primary-black" placeholder="500" />
            </div>
          </div>
        </div>

        {/* Section 4: Operating Hours */}
        <div className="bg-charcoal rounded-sm border border-dark-border shadow-card p-8">
          <h3 className="text-base font-bold tracking-widest uppercase text-cream/40 mb-6 pb-3 border-b border-dark-border flex items-center gap-2">
            <FaClock className="text-gold-500" /> Operating Hours
          </h3>
          <div className="space-y-3">
            {Object.entries(operatingHours).map(([day, hours]: [string, any]) => (
              <div key={day} className="flex items-center gap-4 bg-primary-black border border-dark-border rounded-sm p-3">
                <label className="flex items-center gap-2 w-32 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hours.is_open}
                    onChange={(e) => updateDay(day, 'is_open', e.target.checked)}
                    className="w-4 h-4 rounded border-dark-border bg-charcoal text-gold-500 focus:ring-gold-500"
                  />
                  <span className="text-base font-bold uppercase tracking-widest text-cream/80 capitalize">{day}</span>
                </label>
                <input
                  type="time"
                  value={hours.open}
                  onChange={(e) => updateDay(day, 'open', e.target.value)}
                  disabled={!hours.is_open}
                  className="admin-input bg-charcoal text-base w-28 disabled:opacity-30"
                />
                <span className="text-cream/30 text-base">to</span>
                <input
                  type="time"
                  value={hours.close}
                  onChange={(e) => updateDay(day, 'close', e.target.value)}
                  disabled={!hours.is_open}
                  className="admin-input bg-charcoal text-base w-28 disabled:opacity-30"
                />
                {!hours.is_open && (
                  <span className="text-sm font-bold tracking-widest uppercase text-ember-500">Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <button type="submit" disabled={isLoading} className="btn-gold">
            {isLoading ? 'Saving...' : isEditing ? 'Update Branch' : 'Create Branch'}
          </button>
          <button type="button" onClick={() => router.push('/admin/branches')} className="btn-outline-gold">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
