# Sahibs Catering - Team Setup & Replication Guide

This guide provides step-by-step instructions for team members to set up the development environment and replicate the Sahibs Catering application.

## 1. Prerequisites

### Node.js (Version 22+)
The project requires Node.js 22. If you are on an older version, follow these steps:
```bash
# Add NodeSource repository for Node 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
# Install Node.js
sudo apt-get install -y nodejs
```

### MongoDB (Version 7.0+)
You can use either a local MongoDB instance or MongoDB Atlas (Cloud).

#### Option A: Local Installation (Ubuntu/Debian)
```bash
# Add MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install, start and enable
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Create a project and an **M0 Free** cluster.
3. Add an IP access rule (e.g., `0.0.0.0/0` for dev).
4. Create a database user and copy the connection string.

---

## 2. Project Setup

### Clone and Install Dependencies
```bash
git clone <repository-url>
cd sahibscatering

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sahibscatering # Or your Atlas URI
JWT_SECRET=your_random_secret_here
STRIPE_SECRET_KEY=your_stripe_test_key_here
```

---

## 3. Database Initialization (Seeding)

You must seed the database with initial menu data and an admin account.

```bash
cd backend
# Seed Menu Items & Packages
npx ts-node src/utils/seedData.ts

# Seed Admin Account (admin@sahibscatering.com / admin123)
npx ts-node src/utils/seedAdmin.ts
```

---

## 4. Running the Application

### Start Backend
```bash
cd backend
npm run dev
```
The server will run on `http://localhost:5000`.

### Start Frontend
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 5. Verification & Testing

### Admin Login
1. Navigate to `http://localhost:5173/admin/login`.
2. Login with:
   - **Email**: `admin@sahibscatering.com`
   - **Password**: `admin123`
3. Verify you can see the Dashboard and manage orders/menu.

### API Testing
You can use the provided test script to verify backend functionality:
```bash
cd backend
npx ts-node src/scripts/test_admin_api.ts
```
