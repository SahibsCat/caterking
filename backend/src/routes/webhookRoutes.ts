import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!sig || !webhookSecret) {
      throw new Error('Missing stripe signature or webhook secret');
    }
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    // Update order status in DB
    try {
      const order = await Order.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { status: 'paid' },
        { new: true }
      );
      console.log(`Order ${order?.orderId} marked as paid.`);
    } catch (dbError) {
      console.error('Error updating order status on webhook:', dbError);
    }
  }

  res.json({ received: true });
});

export default router;
