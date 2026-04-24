import mongoose, { Schema, Document } from 'mongoose';
const MealBoxMenuSchema = new Schema({
    boxType: { type: String, enum: ['Adult', 'Kids', 'Snack'], required: true },
    package: { type: String, enum: ['Standard', 'Premium', 'Elite'], required: true },
    items: [{
            itemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
            defaultQuantity: { type: Number, default: 1 }
        }],
    is_active: { type: Boolean, default: true }
}, { timestamps: true });
// Ensure unique combination of boxType and package
MealBoxMenuSchema.index({ boxType: 1, package: 1 }, { unique: true });
export default mongoose.model('MealBoxMenu', MealBoxMenuSchema);
//# sourceMappingURL=MealBoxMenu.js.map