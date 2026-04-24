import mongoose, { Document } from 'mongoose';
export interface IPackage extends Document {
    name: 'Standard' | 'Premium' | 'Elite';
    base_price_per_guest: number;
    max_main_course: number;
    max_starters: number;
    max_desserts: number;
    inclusions: string[];
    is_active: boolean;
}
declare const _default: mongoose.Model<IPackage, {}, {}, {}, mongoose.Document<unknown, {}, IPackage, {}, mongoose.DefaultSchemaOptions> & IPackage & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPackage>;
export default _default;
//# sourceMappingURL=Package.d.ts.map