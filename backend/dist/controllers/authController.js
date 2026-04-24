import {} from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};
export const loginWithMobile = async (req, res) => {
    try {
        const { mobile } = req.body;
        let user = await User.findOne({ mobile });
        // Mock OTP sending
        const otp = '123456'; // Fixed for testing
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        if (user) {
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        }
        else {
            user = await User.create({
                mobile,
                otp,
                otpExpires,
                role: 'user'
            });
        }
        res.json({ message: 'OTP sent successfully (Mock: 123456)', mobile });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const verifyOtp = async (req, res) => {
    try {
        const { mobile, otp } = req.body;
        const user = await User.findOne({
            mobile,
            otp,
            otpExpires: { $gt: new Date() }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        // Clear OTP after verification
        user.otp = '';
        await user.save();
        res.json({
            _id: user._id,
            mobile: user.mobile,
            role: user.role,
            token: generateToken(user._id.toString()),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const createGuestSession = async (req, res) => {
    try {
        // Create a unique mobile for guest to avoid unique index conflict
        const guestMobile = `guest_${Date.now()}`;
        const user = await User.create({
            mobile: guestMobile,
            role: 'guest'
        });
        res.status(201).json({
            _id: user._id,
            role: user.role,
            token: generateToken(user._id.toString()),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=authController.js.map