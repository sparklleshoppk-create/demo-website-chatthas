'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { createClient } from '@/utils/supabase/client';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('Verifying your payment...');
  
  const orderId = searchParams.get('orderId');
  const pfResponseCode = searchParams.get('err_code'); // PayFast error code (00 = success)
  const pfResponseMessage = searchParams.get('err_msg');

  useEffect(() => {
    async function verifyPayment() {
      if (!orderId) {
        setStatus('failed');
        setMessage('Order information is missing.');
        return;
      }

      // In a real scenario, we should call a server action to verify with PayFast API
      // For now, we check the response code from the redirect URL
      if (pfResponseCode === '00' || pfResponseCode === '0') {
        const supabase = createClient();
        
        // Update order status in database
        const { error } = await supabase
          .from('orders')
          .update({ 
            payment_status: 'paid',
            status: 'confirmed'
          })
          .eq('id', orderId);

        if (error) {
          console.error('Error updating order:', error);
          setStatus('failed');
          setMessage('Payment was successful but we couldn\'t update your order. Please contact support.');
        } else {
          setStatus('success');
          setMessage('Your payment has been successfully processed.');
        }
      } else {
        setStatus('failed');
        setMessage(pfResponseMessage || 'Payment was unsuccessful. Please try again.');
      }
    }

    verifyPayment();
  }, [orderId, pfResponseCode, pfResponseMessage]);

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-dark-card border border-dark-border p-12 text-center rounded-sm">
        {status === 'verifying' && (
          <>
            <FaSpinner className="text-gold-500 mx-auto mb-6 animate-spin" size={64} />
            <h2 className="text-2xl font-display font-bold text-cream mb-4 tracking-tight">Verifying <span className="gold-text italic">Payment</span></h2>
            <p className="text-cream/50">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <FaCheckCircle className="text-gold-500 mx-auto mb-6" size={64} />
            <h2 className="text-2xl font-display font-bold text-cream mb-4 tracking-tight">Order <span className="gold-text italic">Confirmed</span></h2>
            <p className="text-cream/50 mb-8">{message}</p>
            <button 
              onClick={() => router.push(`/order/track/${orderId}`)} 
              className="btn-gold w-full py-4 uppercase tracking-[0.2em] font-black"
            >
              Track My Order
            </button>

          </>
        )}

        {status === 'failed' && (
          <>
            <FaTimesCircle className="text-ember-500 mx-auto mb-6" size={64} />
            <h2 className="text-2xl font-display font-bold text-cream mb-4 tracking-tight">Payment <span className="text-ember-500 italic">Failed</span></h2>
            <p className="text-cream/50 mb-8">{message}</p>
            <button 
              onClick={() => router.push('/order')} 
              className="btn-gold w-full py-4 uppercase tracking-[0.2em] font-black"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
