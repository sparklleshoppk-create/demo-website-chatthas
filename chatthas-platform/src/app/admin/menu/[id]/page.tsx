import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import MenuItemForm from '../MenuItemForm';

export default async function EditMenuItemPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: item } = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!item) notFound();

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-cream">Edit Menu Item</h2>
        <p className="text-sm text-cream/50 mt-1">Update details for <span className="text-gold-400">{item.name}</span></p>
      </div>

      <div className="bg-dark-card rounded-sm border border-dark-border shadow-card p-6 md:p-8">
        <MenuItemForm categories={categories || []} item={item} />
      </div>
    </div>
  );
}
