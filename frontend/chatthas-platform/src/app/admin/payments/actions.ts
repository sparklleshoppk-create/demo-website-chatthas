'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function saveGatewayConfig(settings: { key: string; value: string; is_secret: boolean }[]) {
  const supabase = createClient();

  try {
    for (const setting of settings) {
      // Check if setting already exists
      const { data: existing } = await supabase
        .from('website_settings')
        .select('id')
        .eq('key', setting.key)
        .eq('group', 'payments')
        .single();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('website_settings')
          .update({ 
            value: setting.value, 
            is_secret: setting.is_secret,
            updated_at: new Date().toISOString() 
          })
          .eq('id', existing.id);

        if (error) {
          console.error('Update setting error:', error);
          return { error: `Failed to update ${setting.key}: ${error.message}` };
        }
      } else {
        // Insert new
        const { error } = await supabase
          .from('website_settings')
          .insert({
            key: setting.key,
            value: setting.value,
            group: 'payments',
            description: `Payment gateway credential: ${setting.key}`,
            is_secret: setting.is_secret,
          });

        if (error) {
          console.error('Insert setting error:', error);
          return { error: `Failed to save ${setting.key}: ${error.message}` };
        }
      }
    }

    revalidatePath('/admin/payments');
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (err: any) {
    console.error('Save gateway config error:', err);
    return { error: err.message };
  }
}
