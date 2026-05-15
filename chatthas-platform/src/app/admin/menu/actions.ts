'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const menuItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  category_id: z.string().uuid('Select a valid category'),
  badge: z.enum(['bestseller', 'new', 'spicy', 'popular', '']).optional(),
  image_url: z.string().optional(),
  is_available: z.coerce.boolean().default(true),
  is_featured: z.coerce.boolean().default(false),
  sort_order: z.coerce.number().default(0),
  variants: z.any().optional(),
  addons: z.any().optional(),
  track_inventory: z.coerce.boolean().default(false),
  stock_quantity: z.coerce.number().default(0),
});


export async function createMenuItem(formData: FormData) {
  const supabase = createClient();

  const raw = {
    name: formData.get('name') as string,
    slug: (formData.get('name') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: formData.get('description') as string,
    price: formData.get('price'),
    category_id: formData.get('category_id') as string,
    badge: formData.get('badge') as string,
    image_url: formData.get('image_url') as string,
    is_available: formData.get('is_available') === 'on',
    is_featured: formData.get('is_featured') === 'on',
    sort_order: formData.get('sort_order') || 0,
    variants: formData.get('variants') ? JSON.parse(formData.get('variants') as string) : [],
    addons: formData.get('addons') ? JSON.parse(formData.get('addons') as string) : [],
    track_inventory: formData.get('track_inventory') === 'on',
    stock_quantity: formData.get('stock_quantity') || 0,
  };

  const parsed = menuItemSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const data = { ...parsed.data, badge: parsed.data.badge || null, image_url: parsed.data.image_url || null };

  const { error } = await supabase.from('menu_items').insert(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/menu');
  return { success: true };
}

export async function updateMenuItem(id: string, formData: FormData) {
  const supabase = createClient();

  const raw = {
    name: formData.get('name') as string,
    slug: (formData.get('name') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: formData.get('description') as string,
    price: formData.get('price'),
    category_id: formData.get('category_id') as string,
    badge: formData.get('badge') as string,
    image_url: formData.get('image_url') as string,
    is_available: formData.get('is_available') === 'on',
    is_featured: formData.get('is_featured') === 'on',
    sort_order: formData.get('sort_order') || 0,
    variants: formData.get('variants') ? JSON.parse(formData.get('variants') as string) : [],
    addons: formData.get('addons') ? JSON.parse(formData.get('addons') as string) : [],
    track_inventory: formData.get('track_inventory') === 'on',
    stock_quantity: formData.get('stock_quantity') || 0,
  };

  const parsed = menuItemSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const data = { ...parsed.data, badge: parsed.data.badge || null, image_url: parsed.data.image_url || null };

  const { error } = await supabase.from('menu_items').update(data).eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/menu');
  return { success: true };
}

export async function deleteMenuItem(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('menu_items').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/menu');
  return { success: true };
}

export async function toggleMenuItemAvailability(id: string, isAvailable: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from('menu_items')
    .update({ is_available: !isAvailable })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/menu');
  return { success: true };
}
