import mongoose, { Document } from 'mongoose';
export interface IOccasionMenu extends Document {
    occasion: string;
    package: 'Standard' | 'Premium' | 'Elite';
    items: {
        itemId: mongoose.Types.ObjectId;
        defaultQuantity: number;
    }[];
    basePrice?: number;
    is_active: boolean;
}
declare const _default: mongoose.Model<IOccasionMenu, {}, {}, {}, mongoose.Document<unknown, {}, IOccasionMenu, {}, mongoose.DefaultSchemaOptions> & IOccasionMenu & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IOccasionMenu>;
export default _default;
//# sourceMappingURL=OccasionMenu.d.ts.map