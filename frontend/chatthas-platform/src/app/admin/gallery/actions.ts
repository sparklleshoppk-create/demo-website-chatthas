'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addGalleryImage(formData: FormData) {
  const supabase = createClient();
  const imageUrl = formData.get('image_url') as string;
  const caption = formData.get('caption') as string;

  const { error } = await supabase.from('gallery').insert({ image_url: imageUrl, caption });
  if (error) return { error: error.message };

  revalidatePath('/gallery');
  revalidatePath('/admin/gallery');
  return { success: true };
}

export async function deleteGalleryImage(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/gallery');
  revalidatePath('/admin/gallery');
  return { success: true };
}
