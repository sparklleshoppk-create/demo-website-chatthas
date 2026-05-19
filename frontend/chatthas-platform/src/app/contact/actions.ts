'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitContact(formData: FormData) {
  const supabase = createClient();
  const data = {
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string || null,
    message: formData.get('message') as string,
  };

  console.log('CONTACT FORM: Attempting insert with data:', data);

  const { data: result, error } = await supabase.from('contact_messages').insert(data).select();
  
  if (error) {
    console.error('CONTACT FORM ERROR:', error);
    return { error: error.message };
  }
  
  console.log('CONTACT FORM: Insert result:', result);
  revalidatePath('/admin/messages');
  return { success: true };
}


export async function updateMessageStatus(id: string, status: string) {
  const supabase = createClient();
  const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/messages');
  return { success: true };
}

export async function deleteMessage(id: string) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  console.log('DELETE ATTEMPT - Auth user:', user?.id || 'NO USER');

  const { data, error, count } = await supabase
    .from('contact_messages')
    .delete({ count: 'exact' })
    .eq('id', id)
    .select();

  console.log('DELETE RESULT:', { data, error, count });

  if (error) return { error: error.message };
  if (count === 0) return { error: "Message not found or you don't have permission to delete it (RLS block)." };

  revalidatePath('/admin/messages');
  return { success: true };
}
