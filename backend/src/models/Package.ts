import mongoose, { Schema, Document } from 'mongoose';

export interface IPackage extends Document {
  name: 'Standard' | 'Premium' | 'Elite';
  base_price_per_guest: number;
  max_main_course: number;
  max_starters: number;
  max_desserts: number;
  inclusions: string[];
  is_active: boolean;
}

const PackageSchema: Schema = new Schema({
  name: { type: String, enum: ['Standard', 'Premium', 'Elite'], required: true, unique: true },
  base_price_per_guest: { type: Number, required: true },
  max_main_course: { type: Number, required: true },
  max_starters: { type: Number, required: true },
  max_desserts: { type: Number, required: true },
  inclusions: [{ type: String }],
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IPackage>('Package', PackageSchema);
