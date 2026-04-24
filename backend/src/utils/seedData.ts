import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from '../models/MenuItem.js';
import Package from '../models/Package.js';

dotenv.config();

const menuItems = [
  {
    name: 'Chicken Tikka',
    description: 'Succulent pieces of chicken marinated in yogurt and spices, grilled to perfection.',
    base_price: 450,
    weight_ratio_per_10_guests: 1.5,
    dietary_tag: 'Non-Veg',
    category: 'Starters',
  },
  {
    name: 'Paneer Tikka',
    description: 'Fresh cottage cheese cubes marinated in tandoori spices and grilled.',
    base_price: 350,
    weight_ratio_per_10_guests: 1.5,
    dietary_tag: 'Veg',
    category: 'Starters',
  },
  {
    name: 'Mutton Biryani',
    description: 'Traditional slow-cooked basmati rice with tender mutton and aromatic spices.',
    base_price: 850,
    weight_ratio_per_10_guests: 2.5,
    dietary_tag: 'Non-Veg',
    category: 'Main Course',
  },
  {
    name: 'Dal Makhani',
    description: 'Classic black lentils slow-cooked overnight with creamy butter and spices.',
    base_price: 300,
    weight_ratio_per_10_guests: 2.0,
    dietary_tag: 'Veg',
    category: 'Main Course',
  },
  {
    name: 'Gulab Jamun',
    description: 'Soft, melt-in-your-mouth milk dumplings soaked in rose-scented syrup.',
    base_price: 200,
    weight_ratio_per_10_guests: 1.0,
    dietary_tag: 'Veg',
    category: 'Desserts',
  }
];

const packages = [
  {
    name: 'Standard',
    base_price_per_guest: 800,
    max_main_course: 2,
    max_starters: 2,
    max_desserts: 1,
    inclusions: ['Basic Crockery', 'Service Staff'],
  },
  {
    name: 'Premium',
    base_price_per_guest: 1200,
    max_main_course: 4,
    max_starters: 4,
    max_desserts: 2,
    inclusions: ['Premium Crockery', 'Service Staff', 'Uniformed Servers', 'Water Bottles'],
  },
  {
    name: 'Elite',
    base_price_per_guest: 1800,
    max_main_course: 6,
    max_starters: 6,
    max_desserts: 3,
    inclusions: ['Luxury Crockery', 'Gourmet Service Staff', 'Welcome Drinks', 'Live Station'],
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await MenuItem.deleteMany({});
    await Package.deleteMany({});
    console.log('Cleared existing data');

    // Insert new data
    await MenuItem.insertMany(menuItems);
    await Package.insertMany(packages);
    console.log('Database seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
