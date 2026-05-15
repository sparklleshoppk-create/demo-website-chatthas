'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createBanner(formData: FormData) {
  const supabase = createClient();
  const data = {
    image_url: formData.get('image_url') as string,
    title: formData.get('title') as string,
    subtitle: formData.get('subtitle') as string,
    button_text: formData.get('button_text') as string,
    button_link: formData.get('button_link') as string,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    is_active: formData.get('is_active') === 'on',
  };

  const { error } = await supabase.from('homepage_banners').insert(data);
  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
}

export async function updateBanner(id: string, data: any) {
  const supabase = createClient();
  const { error } = await supabase.from('homepage_banners').update(data).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
}

export async function deleteBanner(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('homepage_banners').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
}
