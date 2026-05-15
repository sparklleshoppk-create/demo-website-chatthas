import { createClient } from '@/utils/supabase/server';
import MenuItemForm from '../MenuItemForm';

export default async function NewMenuItemPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-cream">Add New Menu Item</h2>
        <p className="text-sm text-cream/50 mt-1">Create a new dish for your restaurant menu</p>
      </div>

      <div className="bg-dark-card rounded-sm border border-dark-border shadow-card p-6 md:p-8">
        <MenuItemForm categories={categories || []} />
      </div>
    </div>
  );
}
