import mongoose, { Document, Schema } from 'mongoose';
const AvailableDateSchema = new Schema({
    date: { type: Date, required: true, unique: true },
    is_active: { type: Boolean, default: true }
}, {
    timestamps: true
});
export default mongoose.model('AvailableDate', AvailableDateSchema);
//# sourceMappingURL=AvailableDate.js.map