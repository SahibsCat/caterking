import mongoose, { Schema, Document } from 'mongoose';
const LeadSchema = new Schema({
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
export default mongoose.model('Lead', LeadSchema);
//# sourceMappingURL=Lead.js.map