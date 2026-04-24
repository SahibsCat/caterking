import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  mobile: string;
  name?: string;
  email?: string;
  password?: string;
  role: 'guest' | 'user' | 'admin';
  otp?: string;
  otpExpires?: Date;
  socialProvider?: {
    name: string;
    id: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
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
UserSchema.pre('save', async function(this: any) {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
  } catch (err: any) {
    throw err;
  }
});



// Method to compare password
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);

