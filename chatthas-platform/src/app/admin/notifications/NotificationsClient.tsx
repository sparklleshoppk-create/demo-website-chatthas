'use client';

import React, { useState } from 'react';
import { updateNotificationTemplate } from './actions';
import { useRouter } from 'next/navigation';
import { FaSms, FaWhatsapp, FaEnvelope, FaCheck, FaTimes, FaHistory } from 'react-icons/fa';

const EVENT_LABELS: Record<string, string> = {
  order_confirmed: '✅ Order Confirmed',
  order_preparing: '🍳 Order Preparing',
  order_ready: '🏍️ Order Ready',
  order_delivered: '🎉 Order Delivered',
  order_cancelled: '❌ Order Cancelled',
};

export default function NotificationsClient({ initialTemplates, recentLogs }: { initialTemplates: any[]; recentLogs: any[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleToggle = async (template: any, channel: 'is_sms_enabled' | 'is_whatsapp_enabled' | 'is_email_enabled') => {
    await updateNotificationTemplate(template.id, { [channel]: !template[channel] });
    router.refresh();
  };

  const handleSaveTemplate = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);

    await updateNotificationTemplate(id, {
      sms_template: fd.get('sms_template') as string,
      whatsapp_template: fd.get('whatsapp_template') as string,
      email_template: fd.get('email_template') as string,
    });

    setEditingId(null);
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* Templates */}
      <div className="space-y-4">
        {initialTemplates.map(template => (
          <div key={template.id} className="bg-dark-card border border-dark-border rounded-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="font-display font-bold text-cream text-lg">
                  {EVENT_LABELS[template.event_type] || template.event_type}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                {/* Channel Toggles */}
                <button
                  onClick={() => handleToggle(template, 'is_sms_enabled')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                    template.is_sms_enabled
                      ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                      : 'border-dark-border text-cream/20'
                  }`}
                >
                  <FaSms size={12} /> SMS
                </button>
                <button
                  onClick={() => handleToggle(template, 'is_whatsapp_enabled')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                    template.is_whatsapp_enabled
                      ? 'border-green-500/30 bg-green-500/10 text-green-400'
                      : 'border-dark-border text-cream/20'
                  }`}
                >
                  <FaWhatsapp size={12} /> WhatsApp
                </button>
                <button
                  onClick={() => handleToggle(template, 'is_email_enabled')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                    template.is_email_enabled
                      ? 'border-gold-500/30 bg-gold-500/10 text-gold-400'
                      : 'border-dark-border text-cream/20'
                  }`}
                >
                  <FaEnvelope size={12} /> Email
                </button>

                <button
                  onClick={() => setEditingId(editingId === template.id ? null : template.id)}
                  className="text-xs text-cream/40 hover:text-gold-500 transition-colors uppercase font-bold tracking-widest"
                >
                  {editingId === template.id ? 'Close' : 'Edit'}
                </button>
              </div>
            </div>

            {/* Edit Form */}
            {editingId === template.id && (
              <form onSubmit={(e) => handleSaveTemplate(e, template.id)} className="border-t border-dark-border p-6 space-y-6 bg-charcoal/50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1"><FaSms size={10} /> SMS Template</label>
                    <textarea
                      name="sms_template"
                      defaultValue={template.sms_template || ''}
                      rows={4}
                      className="admin-input text-sm"
                      placeholder="Max 160 chars. Use {{order_number}}, {{customer_name}}, {{estimated_time}}"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-green-400 uppercase tracking-widest flex items-center gap-1"><FaWhatsapp size={10} /> WhatsApp Template</label>
                    <textarea
                      name="whatsapp_template"
                      defaultValue={template.whatsapp_template || ''}
                      rows={4}
                      className="admin-input text-sm"
                      placeholder="Rich text with emojis. Use {{order_number}}, {{customer_name}}, {{estimated_time}}"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gold-400 uppercase tracking-widest flex items-center gap-1"><FaEnvelope size={10} /> Email Subject</label>
                    <textarea
                      name="email_template"
                      defaultValue={template.email_template || ''}
                      rows={4}
                      className="admin-input text-sm"
                      placeholder="Email content. Use {{order_number}}, {{customer_name}}"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-cream/30">
                  <span className="px-2 py-0.5 bg-dark-card border border-dark-border rounded text-cream/50">{'{{order_number}}'}</span>
                  <span className="px-2 py-0.5 bg-dark-card border border-dark-border rounded text-cream/50">{'{{customer_name}}'}</span>
                  <span className="px-2 py-0.5 bg-dark-card border border-dark-border rounded text-cream/50">{'{{estimated_time}}'}</span>
                  <span className="px-2 py-0.5 bg-dark-card border border-dark-border rounded text-cream/50">{'{{total}}'}</span>
                </div>

                <button type="submit" disabled={saving} className="btn-gold px-6 py-2 text-sm">
                  {saving ? 'Saving...' : 'Save Templates'}
                </button>
              </form>
            )}
          </div>
        ))}
      </div>

      {/* Recent Notification Logs */}
      <div className="space-y-4">
        <h3 className="text-lg font-display font-bold text-cream flex items-center gap-2">
          <FaHistory className="text-gold-500/60" /> Recent Notifications
        </h3>

        {recentLogs.length === 0 ? (
          <div className="bg-dark-card border border-dashed border-dark-border p-12 text-center rounded-sm">
            <p className="text-cream/30 italic">No notifications sent yet.</p>
          </div>
        ) : (
          <div className="bg-dark-card border border-dark-border rounded-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-dark-border bg-charcoal">
                  <th className="px-6 py-3 text-[10px] font-bold text-cream/40 uppercase tracking-widest">Channel</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-cream/40 uppercase tracking-widest">Event</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-cream/40 uppercase tracking-widest">Recipient</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-cream/40 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-cream/40 uppercase tracking-widest">Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {recentLogs.map(log => (
                  <tr key={log.id} className="hover:bg-charcoal/50">
                    <td className="px-6 py-3">
                      <span className={`text-xs font-bold uppercase ${
                        log.channel === 'sms' ? 'text-blue-400' :
                        log.channel === 'whatsapp' ? 'text-green-400' :
                        'text-gold-400'
                      }`}>
                        {log.channel}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-cream/70">{log.event_type}</td>
                    <td className="px-6 py-3 text-sm text-cream/50">{log.recipient}</td>
                    <td className="px-6 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${
                        log.status === 'sent' ? 'border-green-500/30 text-green-400' : 'border-ember-500/30 text-ember-400'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-cream/40">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
