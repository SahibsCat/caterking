import mongoose, { Schema, Document } from 'mongoose';

export interface IOccasionMenu extends Document {
  occasion: string;
  package: 'Standard' | 'Premium' | 'Elite';
  items: {
    itemId: mongoose.Types.ObjectId;
    defaultQuantity: number;
  }[];
  basePrice?: number; // Optional override for the entire package price
  is_active: boolean;
}

const OccasionMenuSchema: Schema = new Schema({
  occasion: { type: String, required: true },
  package: { type: String, enum: ['Standard', 'Premium', 'Elite'], required: true },
  items: [{
    itemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    defaultQuantity: { type: Number, default: 1 }
  }],
  basePrice: { type: Number },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

// Ensure unique combination of occasion and package
OccasionMenuSchema.index({ occasion: 1, package: 1 }, { unique: true });

export default mongoose.model<IOccasionMenu>('OccasionMenu', OccasionMenuSchema);
