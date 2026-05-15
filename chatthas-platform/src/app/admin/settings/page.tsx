import { createClient } from '@/utils/supabase/server';
import SettingsManager from './SettingsManager';

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: settings } = await supabase
    .from('website_settings')
    .select('*')
    .order('group', { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-cream">Settings</h2>
        <p className="text-sm text-cream/50 mt-1">Manage website and platform configuration — {settings?.length || 0} settings</p>
      </div>

      <SettingsManager settings={settings || []} />
    </div>
  );
}
