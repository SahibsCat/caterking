import mongoose, { Schema, Document } from 'mongoose';
const ServiceConfigSchema = new Schema({
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String }
}, { timestamps: true });
export default mongoose.model('ServiceConfig', ServiceConfigSchema);
//# sourceMappingURL=ServiceConfig.js.map