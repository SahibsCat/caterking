import mongoose, { Document } from 'mongoose';
export interface IOrder extends Document {
    orderId: string;
    userId: mongoose.Types.ObjectId;
    eventDetails: {
        venue: 'Dubai' | 'Sharjah';
        date: Date;
        guestCount: number;
        occasion: string;
        foodPreference: 'Veg' | 'Non-Veg' | 'Mixed';
        serviceType: 'Delivery' | 'Delivery + Service' | 'Buffet';
    };
    packageId: mongoose.Types.ObjectId;
    selectedMenu: {
        itemId: mongoose.Types.ObjectId;
        name: string;
        category: string;
        calculatedWeight: number;
    }[];
    additionalChoices: {
        name: string;
        quantity: number;
        price: number;
    }[];
    customerDetails: {
        name: string;
        email: string;
        phone: string;
        deliveryAddress: {
            flatVilla: string;
            street: string;
            area: string;
            landmark?: string;
        };
    };
    pricing: {
        foodCost: number;
        serviceCost: number;
        transportCost: number;
        vat: number;
        total: number;
    };
    status: 'pending' | 'confirmed' | 'unfulfilled' | 'preparing delivery' | 'delivery' | 'fulfilled' | 'cancelled';
    paymentIntentId?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, mongoose.DefaultSchemaOptions> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IOrder>;
export default _default;
//# sourceMappingURL=Order.d.ts.map