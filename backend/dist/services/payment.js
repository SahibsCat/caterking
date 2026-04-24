import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-01-27.acacia', // Example latest version
});
export const createPaymentIntent = async (amount, currency = 'aed', metadata = {}) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in subunits (fils for AED)
            currency,
            metadata,
        });
        return paymentIntent;
    }
    catch (error) {
        console.error('Stripe Payment Intent Error:', error);
        throw error;
    }
};
export const verifyWebhook = (payload, signature, secret) => {
    return stripe.webhooks.constructEvent(payload, signature, secret);
};
//# sourceMappingURL=payment.js.map