import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  onSuccess: () => void;
  amount: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/book/success`,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'An unexpected error occurred.');
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-xl font-bold mb-4 text-tan">Payment Details</div>
      <PaymentElement />
      
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm">
          {error}
        </div>
      )}

      <button
        disabled={processing || !stripe || !elements}
        className="w-full bg-tan text-richBlack py-4 rounded-full font-bold hover:scale-105 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : `Pay AED ${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
