import { createClient } from '@/utils/supabase/server';
import BannerManager from './BannerManager';

export default async function BannersPage() {
  const supabase = createClient();
  const { data: banners } = await supabase.from('homepage_banners').select('*').order('display_order', { ascending: true });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-display font-bold text-gold-500 mb-8">Homepage Banners</h1>
      <BannerManager banners={banners || []} />
    </div>
  );
}
