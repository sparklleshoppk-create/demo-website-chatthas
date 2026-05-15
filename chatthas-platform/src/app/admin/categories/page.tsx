import { createClient } from '@/utils/supabase/server';
import { FaEdit, FaTrash, FaPlus, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import CreateCategoryForm from './CreateCategoryForm';
import DeleteCategoryButton from './DeleteCategoryButton';

export default async function CategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('display_order');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-gold-500">Menu Categories</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Category */}
        <div className="lg:col-span-1">
          <CreateCategoryForm />
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-dark-card border border-dark-border rounded-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-charcoal text-xs font-bold text-cream/40 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Icon</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {categories?.map(cat => (
                  <tr key={cat.id} className="hover:bg-charcoal/50 transition-colors">
                    <td className="px-6 py-4 text-2xl">{cat.image_url}</td>
                    <td className="px-6 py-4 font-bold text-cream">{cat.name}</td>
                    <td className="px-6 py-4 text-cream/40">{cat.display_order}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-4 justify-end">
                        <DeleteCategoryButton id={cat.id} />
                      </div>
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
