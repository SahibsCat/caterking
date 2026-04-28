# Sahibs Catering - Go-Live Deployment Guide

---

## 🚀 NEW: Unified Deployment (Fixes Admin Panel Issues)
**Follow these steps to host your entire application (Frontend + Backend) on a single Render URL.** This resolves "Cannot GET /admin" issues and simplifies management.

### 1. Update Render Web Service Settings
1. Log in to [Render.com](https://render.com) and click on your **Backend** (Web Service).
2. Go to the **Settings** tab:
   - **Root Directory**: Delete `backend` and leave it **BLANK**.
   - **Build Command**: 
     ```bash
     cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build
     ```
   - **Start Command**: 
     ```bash
     node backend/dist/index.js
     ```
3. Go to the **Environment** tab:
   - Add/Update `NODE_ENV`: `production`
   - **Delete** `VITE_API_URL` if it exists (the app will now use relative paths).
4. Click **Manual Deploy** > **Clear Build Cache & Deploy**.

### 2. Deactivate the Old Frontend Service
Since the Backend now serves the Frontend, you can delete or suspend the separate "Static Site" service to save resources and avoid confusion.

### 3. Verify Admin Access
Once live, your site and admin panel will both be at the SAME URL:
- **Website**: `https://caterking.onrender.com/`
- **Admin**: `https://caterking.onrender.com/admin/login`

---

## 📅 UPDATE: April 26, 2026 - Critical Fixes & Admin Setup
**Follow these steps if you have already attempted deployment yesterday and need to apply the latest fixes.**

### 1. Update your Codebase
The new zip file contains critical fixes for the "Empty Dropdowns" and "Admin Login" issues.
1. **Replace Files**: Delete your old `frontend` and `backend` folders and replace them with the ones from the new zip file.
2. **Commit & Push to GitHub**:
   Open your terminal in the main project folder and run these three commands:
   ```bash
   git add .
   git commit -m "Apply production fixes and admin setup"
   git push
   ```

### 2. Trigger a New Deployment
Once the new code is on GitHub, Render needs to rebuild the site.
1. Log in to [Render.com](https://render.com).
2. For **BOTH** the Backend (Web Service) and Frontend (Static Site):
   - Click on the service.
   - Click the **"Deploy"** button (top right).
   - Select **"Clear Build Cache & Deploy"**.
3. Wait for both to show a green **"Live"** status.

### 3. Create the Admin Account (Seeding to Atlas)
To ensure the admin is created in your **Live Database (Atlas)** and not just locally:
1. **Update .env**: Open the `backend/.env` file.
2. **Set Atlas URI**: Ensure `MONGODB_URI` is set to your MongoDB Atlas connection string (the one starting with `mongodb+srv://`).
3. **Run Seed Command**: In your terminal, navigate to the `backend` folder and run:
   ```bash
   npm run seed:admin
   ```
   *This will now create the admin user directly in your cloud database.*


### 4. Fix the "Empty Dates" Dropdown
The booking page will show an empty dropdown until you "Activate" some dates in the Admin panel.
1. Open your website and go to `/admin/login` (e.g., `https://your-site.onrender.com/admin/login`).
2. **Log in** with:
   - **Email**: `admin@caterking.com`
   - **Password**: `AdminPassword1234!`
3. Go to the **"Delivery Dates"** tab.
4. Add at least 5-10 upcoming dates (e.g., tomorrow and the next few days).
5. Refresh your booking page—the dates will now appear!

---

# Original Deployment Instructions (Reference)

This guide provides step-by-step instructions for deploying the Sahibs Catering platform to production using **Render.com** (Frontend/Backend) and **MongoDB Atlas** (Database).

## 0. Code Preparation (CRITICAL)

Before deploying, you must ensure the frontend can talk to the production API.

1. **Verify Config**: Ensure `frontend/src/config.ts` exists:
   ```typescript
   export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   ```
2. **Commit Fixes**: Ensure all hardcoded `http://localhost:5000` instances have been replaced with `${API_BASE_URL}`. (The AI assistant has already performed this replacement in the latest code).

---

## 1. Database Setup (MongoDB Atlas)

### A. Create Cluster
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new project (e.g., `SahibsCatering`).
3. Deploy a **FREE Tier (M0)** cluster.
4. Go to **Network Access** and add `0.0.0.0/0` (Allow access from anywhere - Render requires this).
5. Go to **Database Access** and create a user (e.g., `dbAdmin`) with a secure password.

### B. Migrate Local Data to Atlas
To move your local menu items, packages, and settings to the cloud:
1. **Dump Local DB**:
   ```bash
   mongodump --db sahibscatering --out ./db_backup
   ```
2. **Restore to Atlas**:
   Get your connection string from the Atlas dashboard (`mongodb+srv://...`).
   ```bash
   mongorestore --uri="mongodb+srv://dbAdmin:PASSWORD@cluster.mongodb.net/sahibscatering" ./db_backup/sahibscatering
   ```

---

## 2. Seed Admin & Initial Data (⚠️ NEW STEP)

If you are starting with a fresh database or need to reset the admin user:

1. **Configure Environment**: Update your `backend/.env` with your **Atlas Connection String**.
2. **Create Admin User**:
   Run this command from the `backend` folder:
   ```bash
   npm run seed:admin
   ```
   **Default Credentials:**
   - **Email:** `admin@caterking.com`
   - **Password:** `AdminPassword1234!`
3. **Seed Default Menu (Optional)**:
   If your menu is empty, run:
   ```bash
   npm run seed:menu
   ```

---

## 3. Backend Deployment (Render.com)

### A. Create Web Service
1. Sign in to [Render](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Select the `backend` folder (if using a monorepo, set **Root Directory** to `backend`).

### B. Configure Service
- **Root Directory**: `backend` (⚠️ CRITICAL)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`

### C. Environment Variables
Add these in the **Environment** tab:
1. **MONGODB_URI**: (Your Atlas Connection String)
2. **STRIPE_SECRET_KEY**: (Your Stripe Secret Key)
3. **JWT_SECRET**: (Any long random string)
4. **NODE_ENV**: `production`

---

## 4. Frontend Deployment (Render.com)

### A. Create Static Site
1. Click **New +** > **Static Site**.
2. Connect the same GitHub repository.
3. Set **Root Directory** to `frontend`.

### B. Configure Build
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### C. Environment Variables (⚠️ CRITICAL)
Add the following in the **Environment** tab:
- `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key.
- `VITE_API_URL`: Your Render Backend URL (e.g., `https://sahibs-backend.onrender.com`).
  *Note: Do not include a trailing slash.*

---

## 5. Launching the Admin Module

1. **URL**: Go to `https://your-frontend-url.onrender.com/admin/login`.
2. **Login**: Use the seeded credentials (`admin@caterking.com` / `AdminPassword1234!`).
3. **Configure Dates**: Go to **Delivery Dates** and add available dates for your service. **Without this, the booking dropdown will be empty.**
4. **Manage Menu**: Use the **Menu Management** tab to activate/deactivate dishes.

---

## 6. Final Checklist & Troubleshooting

### ❌ Error: "Menus are not showing up" or "Empty Dropdowns"
**Fix**: 
1. Ensure `VITE_API_URL` is set correctly in the Render Frontend settings.
2. Check if you have added available dates in the Admin Module (**Step 5.3**).
3. Ensure the seeder scripts were run against the production database (**Step 2**).

### ❌ Error: "Cannot login to Admin"
**Fix**: 
1. Ensure you ran `npm run seed:admin` pointing to your Atlas database.
2. Check `JWT_SECRET` is set in the Backend environment variables.

### ❌ Error: "CORS issues"
**Fix**: The backend allows all origins by default, but ensure `VITE_API_URL` in the frontend does **not** have a trailing slash, as it might cause malformed URLs.
