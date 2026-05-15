'use client';

import { useEffect, useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaCheckCircle, FaLock } from 'react-icons/fa';

export default function StripePaymentForm({ orderId, amount, onSuccess }: { orderId: string, amount: number, onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/success?orderId=${orderId}`,
      },
      redirect: 'if_required'
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An error occurred.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else {
      // Payment succeeded without redirect
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-gold-500 mb-4 bg-gold-500/10 p-3 border border-gold-500/20 rounded-sm">
        <FaLock size={12} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Secure Payment Processing</span>
      </div>

      <PaymentElement options={{ layout: 'tabs' }} className="stripe-element-container" />

      {message && (
        <div className="text-ember-500 text-xs font-bold bg-ember-500/10 p-3 border border-ember-500/20 rounded-sm">
          {message}
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        className="btn-gold w-full py-4 flex items-center justify-center gap-3 font-black tracking-widest"
      >
        {isLoading ? "Processing..." : `Pay Rs. ${amount}`}
      </button>

      <p className="text-[10px] text-cream/30 text-center italic">
        Powered by Stripe. Your payment data is encrypted and secure.
      </p>
    </form>
  );
}
