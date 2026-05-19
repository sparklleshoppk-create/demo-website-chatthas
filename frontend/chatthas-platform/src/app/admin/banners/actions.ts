'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createBanner(formData: FormData) {
  const supabase = createClient();
  
  const mediaUrl = formData.get('media_url') as string;
  if (!mediaUrl) return { error: 'Desktop banner image is required.' };

  // Build data object, only including fields that have values
  const data: Record<string, any> = {
    section_type: 'banner',
    media_url: mediaUrl,
    title: (formData.get('title') as string) || null,
    subtitle: (formData.get('subtitle') as string) || null,
    cta_text: (formData.get('cta_text') as string) || null,
    cta_url: (formData.get('cta_url') as string) || null,
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
    is_active: true,
  };

  // Optional extended fields — only add if provided (may not exist in older schemas)
  const mobileUrl = formData.get('media_url_mobile') as string;
  if (mobileUrl) data.media_url_mobile = mobileUrl;
  
  const target = formData.get('target') as string;
  if (target) data.target = target;

  const animationType = formData.get('animation_type') as string;
  if (animationType) data.animation_type = animationType;

  const ctaStyle = formData.get('cta_style') as string;
  if (ctaStyle) data.cta_style = ctaStyle;

  const startDate = formData.get('start_date') as string;
  if (startDate) data.start_date = new Date(startDate).toISOString();

  const endDate = formData.get('end_date') as string;
  if (endDate) data.end_date = new Date(endDate).toISOString();

  const { error } = await supabase.from('homepage_sections').insert(data);
  
  if (error) {
    console.error('Banner insert error:', error);
    // If columns don't exist, retry with minimal fields
    if (error.message.includes('column') || error.code === '42703') {
      const minimalData = {
        section_type: 'banner',
        media_url: mediaUrl,
        title: data.title,
        subtitle: data.subtitle,
        cta_text: data.cta_text,
        cta_url: data.cta_url,
        sort_order: data.sort_order,
        is_active: true,
      };
      const { error: retryError } = await supabase.from('homepage_sections').insert(minimalData);
      if (retryError) return { error: retryError.message };
    } else {
      return { error: error.message };
    }
  }

  revalidatePath('/', 'layout');
  revalidatePath('/admin/banners');
  return { success: true };
}

export async function updateBanner(id: string, data: any) {
  const supabase = createClient();
  const { error } = await supabase.from('homepage_sections').update(data).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
  revalidatePath('/admin/banners');
  return { success: true };
}

export async function deleteBanner(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('homepage_sections').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
  revalidatePath('/admin/banners');
  return { success: true };
}
