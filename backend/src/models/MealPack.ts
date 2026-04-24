import mongoose, { Schema, Document } from 'mongoose';

export interface IMealPack extends Document {
  name: string;
  type: 'Adult' | 'Snack' | 'Kids';
  description?: string;
  price: number;
  items: string[];
  image?: string;
  is_active: boolean;
}

const MealPackSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Adult', 'Snack', 'Kids'], required: true },
  description: { type: String },
  price: { type: Number, required: true },
  items: [{ type: String }],
  image: { type: String },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IMealPack>('MealPack', MealPackSchema);
