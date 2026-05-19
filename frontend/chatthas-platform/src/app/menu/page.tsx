import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import MenuClient from './MenuClient';

export const metadata: Metadata = {
  title: "Menu | Chattha's Restaurant",
  description: "Explore Chattha's authentic Pakistani menu. From our famous Halwa Puri breakfast to Desi Ghee Karahi and Biryani.",
};

export default async function MenuPage() {

  const supabase = createClient();
  
  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .order('name');
    
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order');

  return <MenuClient items={items || []} categories={categories || []} />;
}
