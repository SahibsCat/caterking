import Stripe from 'stripe';
export declare const createPaymentIntent: (amount: number, currency?: string, metadata?: any) => Promise<Stripe.Response<Stripe.PaymentIntent>>;
export declare const verifyWebhook: (payload: any, signature: string, secret: string) => Stripe.Event;
//# sourceMappingURL=payment.d.ts.map