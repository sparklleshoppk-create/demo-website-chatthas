import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: "Gallery | Chattha's Restaurant",
  description: "Explore the visual world of Chattha's — our food, our ambiance, our kitchen, and the people who make it all happen. A cinematic look into Islamabad's finest desi restaurant.",
};

export default async function GalleryPage() {
  const supabase = createClient();
  const { data: items } = await supabase
    .from('gallery_items')
    .select('*')
    .order('display_order', { ascending: true });

  return <GalleryClient items={items || []} />;
}
