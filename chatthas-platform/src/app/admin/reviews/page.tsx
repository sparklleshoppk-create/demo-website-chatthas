import { createClient } from '@/utils/supabase/server';
import ReviewsModerationTable from './ReviewsModerationTable';

export default async function ReviewsModerationPage() {
  const supabase = createClient();
  
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, users(full_name), menu_items(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-cream tracking-tight">Reviews <span className="gold-text italic">Moderation</span></h2>
        <p className="text-sm text-cream/50 mt-1">Approve or reject customer feedback.</p>
      </div>

      <ReviewsModerationTable initialReviews={reviews || []} />
    </div>
  );
}
