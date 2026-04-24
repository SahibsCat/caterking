# Configure Environment Secrets

This plan outlines the steps to properly configure the `JWT_SECRET` and `STRIPE_SECRET_KEY` in the backend `.env` file. These values are currently placeholders and must be updated for the application to function securely.

## User Review Required

> [!IMPORTANT]
> - **JWT_SECRET**: Use a long, random string. You can generate one using `openssl rand -base64 32`.
> - **STRIPE_SECRET_KEY**: This must be obtained from your [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys). For testing, use the secret key that starts with `sk_test_`.
- **Database**: Since you don't have MongoDB installed locally, we'll use **MongoDB Atlas** (Cloud).

## Proposed Changes

### Database Setup

#### [NEW] [seedData.ts](file:///home/vijay/projects/sahibscatering/backend/src/utils/seedData.ts)
- Create a script to populate the database with Sahibs Catering menu items and packages.

### Backend Configuration

#### [MODIFY] [index.ts](file:///home/vijay/projects/sahibscatering/backend/src/index.ts)
- Uncomment and finalize the MongoDB connection logic.

#### [MODIFY] [.env](file:///home/vijay/projects/sahibscatering/backend/.env)
- Add comments explaining each variable.
- Update `MONGODB_URI` placeholder for Atlas.
- Update placeholders to make it clear that user action is required.

## Verification Plan

### Automated Tests
- No automated tests are applicable for local secret configuration, but we can verify that the server starts and reads the variables (once implemented in the code).

### Manual Verification
- Verify that the `.env` file contains the updated comments and placeholders.
- The user should confirm they have their own keys ready.
