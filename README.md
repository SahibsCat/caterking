# Sahibs Catering - Premium Catering Platform

A high-end catering booking platform for the UAE market, featuring intelligent menu automation, real-time pricing, and a comprehensive administrative suite.

## ✨ Key Features
- **Intelligent Booking Flow**: Multi-step booking with automated menu recommendations based on event occasion.
- **Menu Customization**: "Smart Replace" system allowing users to swap dishes while maintaining package integrity.
- **Lead Capture System**: Automated tracking of potential customers even if they don't complete a booking.
- **Tiered Meal Boxes**: Specialized flow for Adult, Kids, and Snack boxes with Standard/Premium/Elite tiers.
- **Advanced Admin Panel**: Full control over menu items, available booking dates, occasion presets, and lead management.
- **Live Pricing Engine**: Real-time calculation of food, service, and transport costs with automated weight scaling.
- **Secure Payments**: Integrated with Stripe for seamless, secure transactions.

## 🛠 Tech Stack
- **Frontend**: React 18, Vite 6, Tailwind CSS 4, Framer Motion, Lucide React.
- **Backend**: Node.js 22 (ESM), Express, TypeScript (via `tsx`).
- **Database**: MongoDB with Mongoose ODM.
- **Payments**: Stripe API.

## 🚀 Quick Start
1. **Prerequisites**: [Node.js](https://nodejs.org/) (v22+) and [MongoDB](https://www.mongodb.com/).
2. **Environment**: Configure `.env` in both `backend/` and `frontend/` folders (see [Setup Guides](#-setup-guides)).
3. **Backend**:
   ```bash
   cd backend && npm install && npm run dev
   ```
4. **Frontend**:
   ```bash
   cd frontend && npm install && npm run dev
   ```

## 📖 Setup Guides
- **Database Schema**: [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)
- **MongoDB Setup**: [mongodb_setup.md](./docs/mongodb_setup.md)
- **Stripe Setup**: [stripe_setup.md](./docs/stripe_setup.md)
- **Admin Guide**: [ADMIN_GUIDE.md](./docs/ADMIN_GUIDE.md) (NEW)
- **Requirements**: [Functional & Technical Requirements.txt](./Functional%20&%20Technical%20Requirements.txt)

---
*Built with ❤️ for Sahibs Catering*
