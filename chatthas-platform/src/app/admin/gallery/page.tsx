import { createClient } from '@/utils/supabase/server';
import GalleryManager from './GalleryManager';

export default async function AdminGalleryPage() {
  const supabase = createClient();
  
  const { data: images } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <GalleryManager initialImages={images || []} />
    </div>
  );
}
