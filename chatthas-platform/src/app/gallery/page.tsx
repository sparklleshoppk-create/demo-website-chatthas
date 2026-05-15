import { createClient } from '@/utils/supabase/server';
import GalleryClient from './GalleryClient';

export default async function GalleryPage() {
  const supabase = createClient();
  const { data: items } = await supabase
    .from('gallery_items')
    .select('*')
    .order('display_order', { ascending: true });

  return <GalleryClient items={items || []} />;
}
