import mongoose, { Document } from 'mongoose';
export interface IServiceConfig extends Document {
    key: string;
    value: any;
    description?: string;
}
declare const _default: mongoose.Model<IServiceConfig, {}, {}, {}, mongoose.Document<unknown, {}, IServiceConfig, {}, mongoose.DefaultSchemaOptions> & IServiceConfig & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IServiceConfig>;
export default _default;
//# sourceMappingURL=ServiceConfig.d.ts.map