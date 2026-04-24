import mongoose, { Document } from 'mongoose';
export interface IAvailableDate extends Document {
    date: Date;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IAvailableDate, {}, {}, {}, mongoose.Document<unknown, {}, IAvailableDate, {}, mongoose.DefaultSchemaOptions> & IAvailableDate & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAvailableDate>;
export default _default;
//# sourceMappingURL=AvailableDate.d.ts.map