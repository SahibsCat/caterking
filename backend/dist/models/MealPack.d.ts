import mongoose, { Document } from 'mongoose';
export interface IMealPack extends Document {
    name: string;
    type: 'Adult' | 'Snack' | 'Kids';
    description?: string;
    price: number;
    items: string[];
    image?: string;
    is_active: boolean;
}
declare const _default: mongoose.Model<IMealPack, {}, {}, {}, mongoose.Document<unknown, {}, IMealPack, {}, mongoose.DefaultSchemaOptions> & IMealPack & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMealPack>;
export default _default;
//# sourceMappingURL=MealPack.d.ts.map