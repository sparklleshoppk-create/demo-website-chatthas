'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createDeliveryZone(data: {
  name: string;
  branch_id: string;
  min_distance_km: number;
  max_distance_km: number;
  delivery_fee: number;
  estimated_time_minutes: number;
}) {
  const supabase = createClient();

  const { error } = await supabase.from('delivery_zones').insert(data);

  if (error) return { error: error.message };

  revalidatePath('/admin/delivery-zones');
  return { success: true };
}

export async function updateDeliveryZone(id: string, data: {
  name?: string;
  delivery_fee?: number;
  estimated_time_minutes?: number;
  is_active?: boolean;
}) {
  const supabase = createClient();

  const { error } = await supabase
    .from('delivery_zones')
    .update(data)
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/delivery-zones');
  return { success: true };
}

export async function deleteDeliveryZone(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('delivery_zones')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/delivery-zones');
  return { success: true };
}
