import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import BranchFormPage from '../new/page';

export default async function EditBranchPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: branch } = await supabase
    .from('branches')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!branch) notFound();

  return <BranchFormPage branch={branch} />;
}
