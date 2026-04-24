# Stripe Setup Guide

Stripe is used to handle all payments for Sahibs Catering bookings.

## Step-by-Step Instructions

1.  **Sign Up**: Create a free account at [Stripe.com](https://stripe.com).
2.  **Access Dashboard**: Once logged in, go to the [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys).
3.  **Enable Test Mode**: Ensure "Test Mode" is toggled ON (usually in the top right corner).
4.  **Get API Keys**:
    - **Publishable Key**: Starts with `pk_test_`. This will be used in the frontend `.env`.
    - **Secret Key**: Starts with `sk_test_`. This must be saved in the backend `.env` under `STRIPE_SECRET_KEY`.
5.  **India Specifics**: For usage in India, Stripe may require you to provide a PAN/GSTIN during sign-up to enable real payments, but Test Mode works immediately without these.

## Why Stripe?
- **PCI Compliance**: We never store sensitive card data on our servers.
- **UPI Support**: Essential for the Indian market.
- **Reliability**: Industry-standard reliability for premium services.
