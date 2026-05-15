'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateReviewStatus(id: string, status: 'approved' | 'rejected') {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('reviews')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/reviews');
  return { success: true };
}
