'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitReview(rating: number, comment: string) {
  const supabase = createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: 'You must be logged in to submit a review.' };
  }

  // Basic validation
  if (rating < 1 || rating > 5) {
    return { error: 'Invalid rating.' };
  }
  
  if (!comment || comment.trim().length < 5) {
    return { error: 'Comment must be at least 5 characters long.' };
  }

  const { error } = await supabase
    .from('reviews')
    .insert({
      user_id: user.id,
      rating,
      comment: comment.trim(),
      status: 'pending' // Admin approval required
    });

  if (error) {
    console.error('Error submitting review:', error);
    return { error: 'Failed to submit review. Please try again.' };
  }

  return { success: true };
}
