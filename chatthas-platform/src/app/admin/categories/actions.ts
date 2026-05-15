'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createCategory(formData: FormData) {
  const supabase = createClient();
  const name = formData.get('name') as string;
  const data = {
    name: name,
    slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
    image_url: formData.get('icon') as string || '🍽️',
    display_order: parseInt(formData.get('display_order') as string) || 0,
    is_active: true,
  };

  const { error } = await supabase.from('categories').insert(data);
  if (error) return { error: error.message };
  revalidatePath('/admin/menu');
  revalidatePath('/menu');
}

export async function updateCategory(id: string, data: any) {
  const supabase = createClient();
  const { error } = await supabase.from('categories').update(data).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/menu');
  revalidatePath('/menu');
}

export async function deleteCategory(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/menu');
  revalidatePath('/menu');
}
