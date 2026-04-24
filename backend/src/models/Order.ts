import mongoose, { Schema, Document } from 'mongoose';

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

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  eventDetails: {
    venue: { type: String, enum: ['Dubai', 'Sharjah'], required: true },
    date: { type: Date, required: true },
    guestCount: { type: Number, required: true },
    occasion: { type: String, required: true },
    foodPreference: { type: String, enum: ['Veg', 'Non-Veg', 'Mixed'], required: true },
    serviceType: { type: String, enum: ['Delivery', 'Delivery + Service', 'Buffet'], required: true }
  },
  packageId: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
  selectedMenu: [{
    itemId: { type: Schema.Types.ObjectId, ref: 'MenuItem' },
    name: { type: String },
    category: { type: String },
    calculatedWeight: { type: Number }
  }],
  additionalChoices: [{
    name: { type: String },
    quantity: { type: Number },
    price: { type: Number }
  }],
  customerDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    deliveryAddress: {
      flatVilla: { type: String, required: true },
      street: { type: String, required: true },
      area: { type: String, required: true },
      landmark: { type: String }
    }
  },
  pricing: {
    foodCost: { type: Number },
    serviceCost: { type: Number },
    transportCost: { type: Number },
    vat: { type: Number },
    total: { type: Number }
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'unfulfilled', 'preparing delivery', 'delivery', 'fulfilled', 'cancelled'], 
    default: 'pending' 
  },
  paymentIntentId: { type: String }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
