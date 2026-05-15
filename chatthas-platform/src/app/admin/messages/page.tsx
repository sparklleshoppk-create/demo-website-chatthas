import { createClient } from '@/utils/supabase/server';
import { FaEnvelope, FaClock, FaCheck, FaTrash, FaPhone } from 'react-icons/fa';
import { MessageActions } from './MessageActions';

export default async function MessagesPage() {
  const supabase = createClient();
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-display font-bold text-gold-500 mb-8">Customer Messages</h1>

      <div className="space-y-6">
        {messages?.length === 0 && (
          <div className="bg-dark-card border border-dark-border p-12 text-center rounded-sm">
            <p className="text-cream/30">No messages received yet.</p>
          </div>
        )}

        {messages?.map(msg => (
          <div key={msg.id} className={`bg-dark-card border border-dark-border rounded-sm overflow-hidden ${msg.status === 'unread' ? 'border-l-4 border-l-gold-500' : ''}`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-charcoal border border-dark-border flex items-center justify-center text-gold-500 text-xl font-bold font-display">
                    {msg.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-cream">{msg.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-cream/40">
                      <span className="flex items-center gap-1"><FaPhone size={10}/> {msg.phone}</span>
                      {msg.email && <span className="flex items-center gap-1"><FaEnvelope size={10}/> {msg.email}</span>}
                      <span className="flex items-center gap-1"><FaClock size={10}/> {new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <MessageActions id={msg.id} status={msg.status} />
              </div>
              <p className="text-cream/70 font-body leading-relaxed bg-charcoal/50 p-4 rounded-sm border border-dark-border/50">
                {msg.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
