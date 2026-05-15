import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import BranchCards from './BranchCards';

export default async function BranchesPage() {
  const supabase = createClient();
  const { data: branches } = await supabase
    .from('branches')
    .select('*')
    .order('display_order', { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-cream">Branches</h2>
          <p className="text-sm text-cream/50 mt-1">Manage your restaurant locations — {branches?.length || 0} branches</p>
        </div>
        <Link
          href="/admin/branches/new"
          target="_self"
          className="px-4 py-2 text-sm font-bold bg-gold-500 text-charcoal rounded-sm hover:bg-gold-400 transition-colors"
        >
          + Add Branch
        </Link>
      </div>

      <BranchCards branches={branches || []} />
    </div>
  );
}
