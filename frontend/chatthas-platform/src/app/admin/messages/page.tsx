import { createClient } from '@/utils/supabase/server';
import { FaEnvelope, FaClock, FaPhone } from 'react-icons/fa';
import { MessageActions } from './MessageActions';

export default async function MessagesPage() {
  const supabase = createClient();
  const { data: messages, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('MESSAGES FETCH ERROR:', error);
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-ember-500/10 border border-ember-500/30 p-4 rounded-sm text-ember-400 text-xs">
          <strong>Database Error:</strong> {error.message} ({error.code})
          <p className="mt-1 text-cream/40">This is usually caused by Supabase Row-Level Security (RLS) policies blocking read access.</p>
        </div>
      )}

      <div className="space-y-4">
        {(!messages || messages.length === 0) && (
          <div className="bg-charcoal border border-dark-border p-16 text-center rounded-sm">
            <p className="text-sm font-display font-light italic gold-text mb-1">No Messages Yet</p>
            <p className="text-sm tracking-widest uppercase text-cream/30">Customer messages will appear here</p>
          </div>
        )}


        {messages?.map(msg => (
          <div key={msg.id} className={`bg-charcoal border border-dark-border rounded-sm overflow-hidden card-lift ${msg.status === 'unread' ? 'border-l-4 border-l-gold-500' : ''}`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-sm bg-primary-black border border-dark-border flex items-center justify-center text-gold-500 text-sm font-bold font-display">
                    {msg.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-bold text-cream">{msg.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm font-bold tracking-widest uppercase text-cream/30">
                      <span className="flex items-center gap-1"><FaPhone size={14}/> {msg.phone}</span>
                      {msg.email && <span className="flex items-center gap-1"><FaEnvelope size={14}/> {msg.email}</span>}
                      <span className="flex items-center gap-1"><FaClock size={14}/> {new Date(msg.created_at).toLocaleString('en-US', { timeZone: 'Asia/Karachi', dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                  </div>
                </div>
                <MessageActions id={msg.id} status={msg.status} />
              </div>
              <p className="text-cream/70 font-body leading-relaxed bg-primary-black/50 p-4 rounded-sm border border-dark-border/50 text-sm">
                {msg.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
