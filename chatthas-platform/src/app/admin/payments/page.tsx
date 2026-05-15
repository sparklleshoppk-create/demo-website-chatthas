import { createClient } from '@/utils/supabase/server';
import SettingsManager from '../settings/SettingsManager';

export default async function PaymentsPage() {
  const supabase = createClient();
  
  const { data: settings } = await supabase
    .from('website_settings')
    .select('*')
    .eq('group', 'payments')
    .order('key');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-cream tracking-tight">Payment <span className="gold-text italic">Gateways</span></h2>
          <p className="text-cream/50 text-sm mt-1">Configure Stripe and PayFast credentials for local and international payments.</p>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-sm">
        <p className="text-xs text-amber-400 leading-relaxed">
          <strong>Security Note:</strong> Keys marked as "Secret" are encrypted at rest and never exposed to the public API. Ensure you use the correct environment (sandbox vs live) for testing.
        </p>
      </div>

      <SettingsManager settings={settings || []} />
    </div>
  );
}
