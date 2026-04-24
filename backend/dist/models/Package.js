import mongoose, { Schema, Document } from 'mongoose';
const PackageSchema = new Schema({
    name: { type: String, enum: ['Standard', 'Premium', 'Elite'], required: true, unique: true },
    base_price_per_guest: { type: Number, required: true },
    max_main_course: { type: Number, required: true },
    max_starters: { type: Number, required: true },
    max_desserts: { type: Number, required: true },
    inclusions: [{ type: String }],
    is_active: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Package', PackageSchema);
//# sourceMappingURL=Package.js.map