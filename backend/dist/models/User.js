import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
const UserSchema = new Schema({
    mobile: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String, enum: ['guest', 'user', 'admin'], default: 'guest' },
    otp: { type: String },
    otpExpires: { type: Date },
    socialProvider: {
        name: { type: String },
        id: { type: String }
    }
}, { timestamps: true });
// Pre-save hook to hash password
UserSchema.pre('save', async function () {
    if (!this.isModified('password'))
        return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    catch (err) {
        throw err;
    }
});
// Method to compare password
UserSchema.methods.comparePassword = async function (password) {
    if (!this.password)
        return false;
    return bcrypt.compare(password, this.password);
};
export default mongoose.model('User', UserSchema);
//# sourceMappingURL=User.js.map