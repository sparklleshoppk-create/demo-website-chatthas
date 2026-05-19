import { createClient } from '@/utils/supabase/server';
import CreateCategoryForm from './CreateCategoryForm';
import DeleteCategoryButton from './DeleteCategoryButton';

export default async function CategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('display_order');

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Category */}
        <div className="lg:col-span-1">
          <CreateCategoryForm />
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-charcoal border border-dark-border rounded-sm overflow-hidden shadow-card card-lift">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary-black text-sm font-bold text-cream/40 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Icon</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {categories?.map(cat => (
                  <tr key={cat.id} className="hover:bg-primary-black/30 transition-colors">
                    <td className="px-6 py-4 text-sm">{cat.image_url}</td>
                    <td className="px-6 py-4 font-display font-bold text-cream">{cat.name}</td>
                    <td className="px-6 py-4 text-sm font-bold tracking-widest uppercase text-cream/40">{cat.display_order}</td>
                    <td className="px-6 py-4 text-right">
                      <DeleteCategoryButton id={cat.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
