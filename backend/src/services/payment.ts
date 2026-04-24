import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia' as any, // Example latest version
});

export const createPaymentIntent = async (amount: number, currency: string = 'aed', metadata: any = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in subunits (fils for AED)
      currency,
      metadata,
    });
    return paymentIntent;
  } catch (error: any) {
    console.error('Stripe Payment Intent Error:', error);
    throw error;
  }
};

export const verifyWebhook = (payload: any, signature: string, secret: string) => {
  return stripe.webhooks.constructEvent(payload, signature, secret);
};
