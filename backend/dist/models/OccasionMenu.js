import mongoose, { Schema, Document } from 'mongoose';
const OccasionMenuSchema = new Schema({
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
export default mongoose.model('OccasionMenu', OccasionMenuSchema);
//# sourceMappingURL=OccasionMenu.js.map