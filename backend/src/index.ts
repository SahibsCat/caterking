import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

import { 
  getMenuItems, 
  getAvailableDates, 
  getOccasionMenuByQuery, 
  getMealBoxMenuByQuery,
  createLead,
  getLeads
} from './controllers/adminController.js';

app.get('/api/menu', getMenuItems);
app.get('/api/available-dates', getAvailableDates);
app.get('/api/occasion-menu', getOccasionMenuByQuery);
app.get('/api/meal-box-menu', getMealBoxMenuByQuery);
app.post('/api/leads', createLead);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);



app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Cater King API is running' });
});

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

startServer();
