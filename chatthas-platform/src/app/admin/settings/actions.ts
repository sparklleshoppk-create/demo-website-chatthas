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
  if (!parsed.success) return { error: parsed.error.errors[0].message };

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
