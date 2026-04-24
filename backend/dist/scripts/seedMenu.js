import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from '../models/MenuItem.js';
dotenv.config();
const items = [
    { name: 'Chicken Tikka', category: 'Starters', base_price: 35, weight_ratio_per_10_guests: 0.05, dietary_tag: 'Non-Veg', packages: ['Standard', 'Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Paneer Tikka', category: 'Starters', base_price: 30, weight_ratio_per_10_guests: 0.05, dietary_tag: 'Veg', packages: ['Standard', 'Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Mutton Seekh Kebab', category: 'Starters', base_price: 45, weight_ratio_per_10_guests: 0.05, dietary_tag: 'Non-Veg', packages: ['Premium', 'Elite'], occasions: ['Wedding Event', 'Corporate Event'], is_active: true },
    { name: 'Caesar Salad', category: 'Salads', base_price: 25, weight_ratio_per_10_guests: 0.1, dietary_tag: 'Veg', packages: ['Standard', 'Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Russian Salad', category: 'Salads', base_price: 28, weight_ratio_per_10_guests: 0.1, dietary_tag: 'Veg', packages: ['Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Butter Chicken', category: 'Curry & Masala', base_price: 45, weight_ratio_per_10_guests: 0.1, dietary_tag: 'Non-Veg', packages: ['Standard', 'Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Mutton Rogan Josh', category: 'Curry & Masala', base_price: 55, weight_ratio_per_10_guests: 0.1, dietary_tag: 'Non-Veg', packages: ['Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Paneer Butter Masala', category: 'Curry & Masala', base_price: 40, weight_ratio_per_10_guests: 0.1, dietary_tag: 'Veg', packages: ['Standard', 'Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Dal Makhani', category: 'Main Course', base_price: 30, weight_ratio_per_10_guests: 0.1, dietary_tag: 'Veg', packages: ['Standard', 'Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Jeera Rice', category: 'Rice', base_price: 20, weight_ratio_per_10_guests: 0.1, dietary_tag: 'Veg', packages: ['Standard', 'Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Chicken Biryani', category: 'Rice', base_price: 50, weight_ratio_per_10_guests: 0.1, dietary_tag: 'Non-Veg', packages: ['Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Mutton Biryani', category: 'Rice', base_price: 60, weight_ratio_per_10_guests: 0.1, dietary_tag: 'Non-Veg', packages: ['Elite'], occasions: ['Wedding Event'], is_active: true },
    { name: 'Assorted Naan', category: 'Breads', base_price: 15, weight_ratio_per_10_guests: 0.05, dietary_tag: 'Veg', packages: ['Standard', 'Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Tandoori Roti', category: 'Breads', base_price: 10, weight_ratio_per_10_guests: 0.05, dietary_tag: 'Veg', packages: ['Standard', 'Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Sweet Corn Soup', category: 'Soup', base_price: 20, weight_ratio_per_10_guests: 0.05, dietary_tag: 'Veg', packages: ['Standard', 'Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Hot & Sour Soup', category: 'Soup', base_price: 22, weight_ratio_per_10_guests: 0.05, dietary_tag: 'Veg', packages: ['Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Penne Alfredo', category: 'Pasta', base_price: 35, weight_ratio_per_10_guests: 0.1, dietary_tag: 'Veg', packages: ['Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Gulab Jamun', category: 'Desserts', base_price: 25, weight_ratio_per_10_guests: 0.03, dietary_tag: 'Veg', packages: ['Standard', 'Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Rasmalai', category: 'Desserts', base_price: 35, weight_ratio_per_10_guests: 0.05, dietary_tag: 'Veg', packages: ['Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Gajar Ka Halwa', category: 'Desserts', base_price: 30, weight_ratio_per_10_guests: 0.05, dietary_tag: 'Veg', packages: ['Elite'], occasions: ['Wedding Event'], is_active: true },
    { name: 'Samosa', category: 'Snacks', base_price: 15, weight_ratio_per_10_guests: 0.05, dietary_tag: 'Veg', packages: ['Standard', 'Premium', 'Elite'], occasions: ['House Party', 'Kitty Party'], is_active: true },
    { name: 'Mango Lassi', category: 'Beverages', base_price: 18, weight_ratio_per_10_guests: 0.05, dietary_tag: 'Veg', packages: ['Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Mint Lemonade', category: 'Beverages', base_price: 15, weight_ratio_per_10_guests: 0.05, dietary_tag: 'Veg', packages: ['Standard', 'Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Raita', category: 'Accompaniments', base_price: 10, weight_ratio_per_10_guests: 0.05, dietary_tag: 'Veg', packages: ['Standard', 'Premium', 'Elite'], occasions: ['All'], is_active: true },
    { name: 'Papad', category: 'Accompaniments', base_price: 5, weight_ratio_per_10_guests: 0.01, dietary_tag: 'Veg', packages: ['Standard', 'Premium', 'Elite'], occasions: ['All'], is_active: true }
];
const seedMenu = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri)
            throw new Error('MONGODB_URI is not defined');
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
        await MenuItem.deleteMany({});
        console.log('Cleared existing menu items.');
        await MenuItem.insertMany(items);
        console.log(`Successfully added ${items.length} diverse menu dishes!`);
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding menu:', error);
        process.exit(1);
    }
};
seedMenu();
//# sourceMappingURL=seedMenu.js.map