'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePlatformSettings } from './actions';
import { FaSave, FaPercent, FaTruck, FaWhatsapp, FaChartLine, FaImage } from 'react-icons/fa';

interface PlatformSettings {
  id?: string;
  tax_rate_online: number;
  tax_rate_cod: number;
  global_delivery_fee: number;
  min_order_value: number;
  whatsapp_number: string | null;
  meta_pixel_id: string | null;
  ga4_measurement_id: string | null;
  posthog_api_key: string | null;
}

export default function PlatformConfig({ settings, bannerDuration }: { settings: PlatformSettings | null; bannerDuration?: number }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSaved(false);

    const fd = new FormData(e.currentTarget);
    const result = await updatePlatformSettings(fd);
    
    if (result?.error) {
      alert(result.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-display font-light italic gold-text">Platform Configuration</h2>
          <p className="text-base tracking-widest uppercase text-cream/40 mt-2">Tax rates, delivery fees, and analytics integrations</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm font-bold tracking-widest uppercase text-green-500 animate-pulse">✓ Saved</span>
          )}
          <button type="submit" disabled={isLoading} className="btn-gold">
            <FaSave size={14} /> {isLoading ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tax Configuration */}
        <div className="bg-charcoal rounded-sm border border-dark-border shadow-card p-8 card-lift">
          <h3 className="text-base font-bold tracking-widest uppercase text-cream/40 mb-6 pb-3 border-b border-dark-border flex items-center gap-2">
            <FaPercent className="text-gold-500" /> Tax Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Online Payment Tax Rate (%)</label>
              <input type="number" step="0.01" name="tax_rate_online"
                defaultValue={settings?.tax_rate_online || 5.00}
                className="admin-input bg-primary-black" />
              <p className="text-sm text-cream/30 mt-1">Applied when customer pays via card/bank</p>
            </div>
            <div>
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">COD Tax Rate (%)</label>
              <input type="number" step="0.01" name="tax_rate_cod"
                defaultValue={settings?.tax_rate_cod || 16.00}
                className="admin-input bg-primary-black" />
              <p className="text-sm text-cream/30 mt-1">Applied for Cash on Delivery orders</p>
            </div>
          </div>
        </div>

        {/* Delivery Configuration */}
        <div className="bg-charcoal rounded-sm border border-dark-border shadow-card p-8 card-lift">
          <h3 className="text-base font-bold tracking-widest uppercase text-cream/40 mb-6 pb-3 border-b border-dark-border flex items-center gap-2">
            <FaTruck className="text-gold-500" /> Delivery Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Global Delivery Fee (Rs.)</label>
              <input type="number" step="0.01" name="global_delivery_fee"
                defaultValue={settings?.global_delivery_fee || 150.00}
                className="admin-input bg-primary-black" />
              <p className="text-sm text-cream/30 mt-1">Default fee applied to all delivery orders</p>
            </div>
            <div>
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Minimum Order Value (Rs.)</label>
              <input type="number" step="0.01" name="min_order_value"
                defaultValue={settings?.min_order_value || 0}
                className="admin-input bg-primary-black" />
              <p className="text-sm text-cream/30 mt-1">Minimum subtotal required to place an order</p>
            </div>
          </div>
        </div>

        {/* Communication */}
        <div className="bg-charcoal rounded-sm border border-dark-border shadow-card p-8 card-lift">
          <h3 className="text-base font-bold tracking-widest uppercase text-cream/40 mb-6 pb-3 border-b border-dark-border flex items-center gap-2">
            <FaWhatsapp className="text-gold-500" /> Communication
          </h3>
          <div>
            <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">WhatsApp Business Number</label>
            <input type="text" name="whatsapp_number"
              defaultValue={settings?.whatsapp_number || ''}
              className="admin-input bg-primary-black"
              placeholder="+923001234567" />
            <p className="text-sm text-cream/30 mt-1">Used for order notifications and customer support widget</p>
          </div>
        </div>

        {/* Banner Experience */}
        <div className="bg-charcoal rounded-sm border border-dark-border shadow-card p-8 card-lift">
          <h3 className="text-base font-bold tracking-widest uppercase text-cream/40 mb-6 pb-3 border-b border-dark-border flex items-center gap-2">
            <FaImage className="text-gold-500" /> Banner Experience
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Slide Swap Duration (seconds)</label>
              <input type="number" step="0.5" min="2" max="30" name="banner_swap_duration"
                defaultValue={bannerDuration ? bannerDuration / 1000 : 7}
                className="admin-input bg-primary-black" />
              <p className="text-sm text-cream/30 mt-1">How long each homepage banner is visible before transitioning to the next. Default: 7 seconds.</p>
            </div>
          </div>
        </div>

        {/* Analytics & Tracking */}
        <div className="bg-charcoal rounded-sm border border-dark-border shadow-card p-8 card-lift">
          <h3 className="text-base font-bold tracking-widest uppercase text-cream/40 mb-6 pb-3 border-b border-dark-border flex items-center gap-2">
            <FaChartLine className="text-gold-500" /> Analytics & Tracking
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">Meta Pixel ID</label>
              <input type="text" name="meta_pixel_id"
                defaultValue={settings?.meta_pixel_id || ''}
                className="admin-input bg-primary-black"
                placeholder="123456789012345" />
            </div>
            <div>
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">GA4 Measurement ID</label>
              <input type="text" name="ga4_measurement_id"
                defaultValue={settings?.ga4_measurement_id || ''}
                className="admin-input bg-primary-black"
                placeholder="G-XXXXXXXXXX" />
            </div>
            <div>
              <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1">PostHog API Key</label>
              <input type="text" name="posthog_api_key"
                defaultValue={settings?.posthog_api_key || ''}
                className="admin-input bg-primary-black"
                placeholder="phc_..." />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
