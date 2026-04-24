import mongoose, { Document, Schema } from 'mongoose';

export interface IAvailableDate extends Document {
  date: Date;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AvailableDateSchema: Schema = new Schema({
  date: { type: Date, required: true, unique: true },
  is_active: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IAvailableDate>('AvailableDate', AvailableDateSchema);
