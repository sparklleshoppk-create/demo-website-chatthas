import { createClient } from '@/utils/supabase/server';
import BannerManager from './BannerManager';

export default async function BannersPage() {
  const supabase = createClient();
  const { data: banners } = await supabase
    .from('homepage_sections')
    .select('*')
    .eq('section_type', 'banner');

  const sortedBanners = (banners || []).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <div className="space-y-6">
      <BannerManager banners={sortedBanners} />
    </div>
  );
}
