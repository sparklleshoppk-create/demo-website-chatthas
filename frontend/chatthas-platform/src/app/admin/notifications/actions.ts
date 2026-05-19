'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateNotificationTemplate(id: string, data: {
  sms_template?: string;
  whatsapp_template?: string;
  email_template?: string;
  is_sms_enabled?: boolean;
  is_whatsapp_enabled?: boolean;
  is_email_enabled?: boolean;
}) {
  const supabase = createClient();

  const { error } = await supabase
    .from('notification_templates')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/notifications');
  return { success: true };
}
