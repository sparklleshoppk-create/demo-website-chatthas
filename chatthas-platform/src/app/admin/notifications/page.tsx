import { createClient } from '@/utils/supabase/server';
import NotificationsClient from './NotificationsClient';

export default async function NotificationsPage() {
  const supabase = createClient();

  const { data: templates } = await supabase
    .from('notification_templates')
    .select('*')
    .order('event_type');

  const { data: recentLogs } = await supabase
    .from('notification_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-cream tracking-tight">Notifications <span className="gold-text italic">Engine</span></h2>
        <p className="text-sm text-cream/50 mt-1">Configure SMS, WhatsApp, and email templates for order events.</p>
      </div>

      <NotificationsClient initialTemplates={templates || []} recentLogs={recentLogs || []} />
    </div>
  );
}
