import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI is missing');

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const email = 'digitalmarketing@arzfoodventures.com';
    const password = 'AdminPassword123!';

    const existing = await User.findOne({ email });
    if (existing) {
      existing.role = 'admin';
      existing.password = password; // Pre-save hook will hash it
      await existing.save();
      console.log('User updated to admin:', email);
    } else {
      const admin = new User({
        mobile: '+971000000000',
        name: 'Digital Marketing',
        email,
        password,
        role: 'admin'
      });
      await admin.save();
      console.log('New admin user created:', email);
    }

    console.log('Password set to:', password);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seed();
