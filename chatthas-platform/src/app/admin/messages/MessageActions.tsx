'use client';

import { updateMessageStatus, deleteMessage } from '@/app/contact/actions';
import { FaTrash } from 'react-icons/fa';

export function MessageActions({ id, status }: { id: string, status: string }) {
  return (
    <div className="flex gap-2">
      {status === 'unread' && (
        <button 
          onClick={() => updateMessageStatus(id, 'read')}
          className="px-3 py-1 bg-gold-500/10 text-gold-500 text-[10px] font-bold uppercase tracking-widest border border-gold-500/20 rounded-sm hover:bg-gold-500 hover:text-charcoal transition-all"
        >
          Mark as Read
        </button>
      )}
      <button 
        onClick={async () => {
          if (confirm('Delete this message?')) {
            await deleteMessage(id);
          }
        }}
        className="p-2 text-cream/20 hover:text-ember-500 transition-colors"
      >
        <FaTrash size={14}/>
      </button>
    </div>
  );
}
