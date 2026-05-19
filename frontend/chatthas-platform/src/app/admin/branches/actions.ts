'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const branchSchema = z.object({
  name: z.string().min(2, 'Branch name is required'),
  slug: z.string().min(2, 'Slug is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  is_accepting_orders: z.coerce.boolean().default(true),
  display_order: z.coerce.number().default(0),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  map_embed_url: z.string().optional().nullable(),
  operating_hours: z.any().optional(),
});

export async function createBranch(formData: FormData) {
  const supabase = createClient();
  const name = formData.get('name') as string || '';

  const raw = {
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    phone: formData.get('phone') as string,
    is_accepting_orders: formData.get('is_accepting_orders') === 'on',
    display_order: formData.get('display_order') ? Number(formData.get('display_order')) : 0,
    latitude: formData.get('lat') ? Number(formData.get('lat')) : null,
    longitude: formData.get('lng') ? Number(formData.get('lng')) : null,
    map_embed_url: formData.get('google_maps_url') as string || null,
    operating_hours: formData.get('operating_hours') ? JSON.parse(formData.get('operating_hours') as string) : null,
  };

  const parsed = branchSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: `Validation Error: ${parsed.error.errors[0].message}` };
  }

  const { error } = await supabase.from('branches').insert(parsed.data);
  if (error) {
    console.error('Supabase Error:', error);
    return { error: `Database Error: ${error.message}` };
  }

  revalidatePath('/admin/branches');
  return { success: true };
}

export async function updateBranch(id: string, formData: FormData) {
  const supabase = createClient();
  const name = formData.get('name') as string || '';

  const raw = {
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    phone: formData.get('phone') as string,
    is_accepting_orders: formData.get('is_accepting_orders') === 'on',
    display_order: formData.get('display_order') ? Number(formData.get('display_order')) : 0,
    latitude: formData.get('lat') ? Number(formData.get('lat')) : null,
    longitude: formData.get('lng') ? Number(formData.get('lng')) : null,
    map_embed_url: formData.get('google_maps_url') as string || null,
    operating_hours: formData.get('operating_hours') ? JSON.parse(formData.get('operating_hours') as string) : null,
  };

  const parsed = branchSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: `Validation Error: ${parsed.error.errors[0].message}` };
  }

  const { error } = await supabase.from('branches').update(parsed.data).eq('id', id);
  if (error) {
    console.error('Supabase Error:', error);
    return { error: `Database Error: ${error.message}` };
  }

  revalidatePath('/admin/branches');
  return { success: true };
}

export async function deleteBranch(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('branches').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/branches');
  return { success: true };
}

export async function toggleBranchOrders(id: string, currentStatus: boolean) {
  const supabase = createClient();
  const { error } = await supabase.from('branches').update({ is_accepting_orders: !currentStatus }).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/branches');
  return { success: true };
}
