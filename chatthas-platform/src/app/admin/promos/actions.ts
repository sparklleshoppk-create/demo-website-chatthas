'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createPromo(formData: FormData) {
  const supabase = createClient();
  const data = {
    code: (formData.get('code') as string).toUpperCase(),
    discount_type: formData.get('discount_type') as string,
    discount_value: parseFloat(formData.get('discount_value') as string),
    min_order_amount: parseFloat(formData.get('min_order_amount') as string) || 0,
    expires_at: formData.get('expires_at') ? new Date(formData.get('expires_at') as string).toISOString() : null,
    is_active: true,
  };

  const { error } = await supabase.from('promo_codes').insert(data);
  if (error) return { error: error.message };
  revalidatePath('/admin/promos');
}

export async function deletePromo(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('promo_codes').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/promos');
}
