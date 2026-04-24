import mongoose, { Document } from 'mongoose';
export interface IMealBoxMenu extends Document {
    boxType: 'Adult' | 'Kids' | 'Snack';
    package: 'Standard' | 'Premium' | 'Elite';
    items: {
        itemId: mongoose.Types.ObjectId;
        defaultQuantity: number;
    }[];
    is_active: boolean;
}
declare const _default: mongoose.Model<IMealBoxMenu, {}, {}, {}, mongoose.Document<unknown, {}, IMealBoxMenu, {}, mongoose.DefaultSchemaOptions> & IMealBoxMenu & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMealBoxMenu>;
export default _default;
//# sourceMappingURL=MealBoxMenu.d.ts.map