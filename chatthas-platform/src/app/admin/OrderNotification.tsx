'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function OrderNotification() {
  const supabase = createClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 1. Setup the notification sound
    // Using a clear, premium 'bell' or 'ping' sound URL
    const soundUrl = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'; 
    audioRef.current = new Audio(soundUrl);

    // 2. Subscribe to new orders
    const channel = supabase
      .channel('admin_orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('New order received!', payload);
          
          // Play the sound
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.error('Audio play failed:', e));
          }

          // Show browser notification if permitted
          if (Notification.permission === 'granted') {
            new Notification('🛎️ New Order Received!', {
              body: `Order ${payload.new.order_number} has been placed.`,
              icon: '/favicon.ico'
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return null; // This is a logic-only component
}
