import mongoose, { Schema, Document } from 'mongoose';
const MealPackSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Adult', 'Snack', 'Kids'], required: true },
    description: { type: String },
    price: { type: Number, required: true },
    items: [{ type: String }],
    image: { type: String },
    is_active: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('MealPack', MealPackSchema);
//# sourceMappingURL=MealPack.js.map