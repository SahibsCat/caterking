import mongoose, { Document } from 'mongoose';
export interface ILead extends Document {
    name: string;
    mobile: string;
    email?: string;
    source: string;
    address?: {
        flatVilla: string;
        street: string;
        area: string;
        landmark?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ILead, {}, {}, {}, mongoose.Document<unknown, {}, ILead, {}, mongoose.DefaultSchemaOptions> & ILead & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ILead>;
export default _default;
//# sourceMappingURL=Lead.d.ts.map