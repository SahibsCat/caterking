import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  name: string;
  mobile: string;
  email?: string;
  source: string; // e.g., 'initial_popup', 'booking_flow'
  address?: {
    flatVilla: string;
    street: string;
    area: string;
    landmark?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String },
  source: { type: String, default: 'initial_popup' },
  address: {
    flatVilla: { type: String },
    street: { type: String },
    area: { type: String },
    landmark: { type: String }
  }
}, { timestamps: true });

export default mongoose.model<ILead>('Lead', LeadSchema);
