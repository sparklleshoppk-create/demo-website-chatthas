'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const settingSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().optional(),
  group: z.enum(['brand', 'contact', 'seo', 'tracking', 'payments', 'features', 'operating']),
  description: z.string().optional(),
  is_secret: z.coerce.boolean().default(false),
});

export async function createSetting(formData: FormData) {
  const supabase = createClient();

  const raw = {
    key: formData.get('key') as string,
    value: formData.get('value') as string,
    group: formData.get('group') as string,
    description: formData.get('description') as string,
    is_secret: formData.get('is_secret') === 'on',
  };

  const parsed = settingSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from('website_settings').insert(parsed.data);
  if (error) return { error: error.message };

  revalidatePath('/admin/settings');
  return { success: true };
}

export async function updateSetting(id: string, value: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('website_settings')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/settings');
  return { success: true };
}

export async function deleteSetting(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('website_settings').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/settings');
  return { success: true };
}

// Phase 8: Platform Settings (Tax, Delivery, Analytics)
export async function updatePlatformSettings(formData: FormData) {
  const supabase = createClient();

  const data = {
    tax_rate_online: Number(formData.get('tax_rate_online')) || 5.00,
    tax_rate_cod: Number(formData.get('tax_rate_cod')) || 16.00,
    global_delivery_fee: Number(formData.get('global_delivery_fee')) || 150.00,
    min_order_value: Number(formData.get('min_order_value')) || 0,
    whatsapp_number: formData.get('whatsapp_number') as string || null,
    meta_pixel_id: formData.get('meta_pixel_id') as string || null,
    ga4_measurement_id: formData.get('ga4_measurement_id') as string || null,
    posthog_api_key: formData.get('posthog_api_key') as string || null,
  };

  // Upsert: Update the single row (or first row)
  const { data: existing } = await supabase.from('platform_settings').select('id').limit(1).single();

  if (existing) {
    const { error } = await supabase.from('platform_settings').update(data).eq('id', existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from('platform_settings').insert(data);
    if (error) return { error: error.message };
  }

  // Save banner swap duration to website_settings key-value store
  const bannerSwapSeconds = Number(formData.get('banner_swap_duration')) || 7;
  const bannerSwapMs = Math.round(bannerSwapSeconds * 1000).toString();

  const { data: existingDuration } = await supabase
    .from('website_settings')
    .select('id')
    .eq('key', 'banner_swap_duration_ms')
    .limit(1)
    .single();

  if (existingDuration) {
    await supabase
      .from('website_settings')
      .update({ value: bannerSwapMs, updated_at: new Date().toISOString() })
      .eq('id', existingDuration.id);
  } else {
    await supabase
      .from('website_settings')
      .insert({ key: 'banner_swap_duration_ms', value: bannerSwapMs, group: 'features', description: 'Homepage banner slide swap interval in milliseconds' });
  }

  revalidatePath('/admin/settings');
  return { success: true };
}
