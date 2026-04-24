import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  description?: string;
  base_price: number;
  weight_ratio_per_10_guests: number; // e.g., 1kg for 10 guests = 1
  dietary_tag: 'Veg' | 'Non-Veg' | 'Mixed';
  category: string;
  image?: string;
  packages: string[];
  occasions: string[];
  is_active: boolean;
}

const MenuItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  base_price: { type: Number, required: true },
  weight_ratio_per_10_guests: { type: Number, required: true },
  dietary_tag: { type: String, enum: ['Veg', 'Non-Veg', 'Mixed'], required: true },
  category: { type: String, required: true },
  image: { type: String },
  packages: [{ type: String }],
  occasions: [{ type: String }],
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
