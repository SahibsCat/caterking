import mongoose, { Document } from 'mongoose';
export interface IMenuItem extends Document {
    name: string;
    description?: string;
    base_price: number;
    weight_ratio_per_10_guests: number;
    dietary_tag: 'Veg' | 'Non-Veg' | 'Mixed';
    category: string;
    image?: string;
    packages: string[];
    occasions: string[];
    is_active: boolean;
}
declare const _default: mongoose.Model<IMenuItem, {}, {}, {}, mongoose.Document<unknown, {}, IMenuItem, {}, mongoose.DefaultSchemaOptions> & IMenuItem & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMenuItem>;
export default _default;
//# sourceMappingURL=MenuItem.d.ts.map