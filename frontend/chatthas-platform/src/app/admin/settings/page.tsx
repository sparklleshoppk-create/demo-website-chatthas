import { createClient } from '@/utils/supabase/server';
import SettingsManager from './SettingsManager';
import PlatformConfig from './PlatformConfig';

export default async function SettingsPage() {
  const supabase = createClient();
  
  const { data: settings } = await supabase
    .from('website_settings')
    .select('*')
    .order('group', { ascending: true });

  const { data: platformSettings } = await supabase
    .from('platform_settings')
    .select('*')
    .limit(1)
    .single();

  // Fetch banner swap duration from website_settings key-value store
  const { data: bannerDurationSetting } = await supabase
    .from('website_settings')
    .select('value')
    .eq('key', 'banner_swap_duration_ms')
    .limit(1)
    .single();

  const bannerDuration = bannerDurationSetting ? parseInt(bannerDurationSetting.value) : 7000;

  const excludedKeys = [
    'tax_rate_digital',
    'tax_rate_cod',
    'flat_delivery_fee',
    'min_order_value',
    'whatsapp_number',
    'meta_pixel_id',
    'ga4_measurement_id',
    'posthog_api_key',
    'banner_swap_duration_ms'
  ];

  const filteredSettings = (settings || []).filter(
    (setting: any) => !excludedKeys.includes(setting.key)
  );

  return (
    <div className="space-y-10">
      {/* Platform Configuration */}
      <PlatformConfig settings={platformSettings} bannerDuration={bannerDuration} />

      {/* General Website Settings */}
      <SettingsManager settings={filteredSettings} />
    </div>
  );
}
