import mongoose, { Schema, Document } from 'mongoose';
const MenuItemSchema = new Schema({
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
export default mongoose.model('MenuItem', MenuItemSchema);
//# sourceMappingURL=MenuItem.js.map