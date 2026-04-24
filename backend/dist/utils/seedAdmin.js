import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
dotenv.config();
const createAdmin = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined');
        }
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
        const adminEmail = 'admin@caterking.com';
        const adminPassword = 'AdminPassword1234!';
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }
        const admin = new User({
            mobile: '+971500000000',
            name: 'System Admin',
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });
        await admin.save();
        console.log('Admin user created successfully!');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);
        process.exit(0);
    }
    catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};
createAdmin();
//# sourceMappingURL=seedAdmin.js.map