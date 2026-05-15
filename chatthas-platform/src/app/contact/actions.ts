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

  const { error } = await supabase.from('contact_messages').insert(data);
  if (error) return { error: error.message };
  
  revalidatePath('/admin/messages');
  return { success: true };
}

export async function updateMessageStatus(id: string, status: string) {
  const supabase = createClient();
  const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/messages');
}

export async function deleteMessage(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/messages');
}
