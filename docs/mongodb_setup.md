# MongoDB Atlas Setup Guide

Since this project does not use a local MongoDB instance, we use **MongoDB Atlas** for a free, cloud-hosted database.

## Step-by-Step Instructions

1.  **Sign Up**: Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2.  **Create a Project**: Give it a name like "Sahibs-Catering".
3.  **Build a Database**: Choose the **M0 Free** tier. Select a provider (e.g., AWS) and a region (e.g., Mumbai for India).
4.  **Security**:
    - **Database User**: Create a user with a username and a strong password. **Remember these!**
    - **IP Access List**: For development, you can add `0.0.0.0/0` (Allow access from anywhere), though for production, you should limit this to your server's IP.
5.  **Get Connection String**:
    - Click **Connect** on your cluster.
    - Choose **Drivers**.
    - Select **Node.js**.
    - Copy the connection string. It will look like this:
      `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
6.  **Configuration**:
    - Paste this URI into `backend/.env` under `MONGODB_URI`.
    - Replace `<password>` with your actual database user password.

## Seeding the Database

Once the URI is set, you can populate the database with Sahibs Catering menu items:

```bash
cd backend
npm run dev # Ensure dependencies are installed
# Then in another terminal or after stopping the server:
npx ts-node src/utils/seedData.ts
```
