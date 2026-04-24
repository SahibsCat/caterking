import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceConfig extends Document {
  key: string; // e.g., 'staff_per_10_guests', 'transport_base_fee'
  value: any;
  description?: string;
}

const ServiceConfigSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model<IServiceConfig>('ServiceConfig', ServiceConfigSchema);
