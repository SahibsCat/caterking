import type { IMenuItem } from '../models/MenuItem.js';
import type { IPackage } from '../models/Package.js';

export const calculateFoodCost = (guestCount: number, packageBasePrice: number) => {
  return guestCount * packageBasePrice;
};

export const calculateItemWeight = (guestCount: number, weightRatio: number) => {
  // Logic: (GuestCount / 10) * weightRatio
  // Minimum weight for catering starts at 15 guests
  return (guestCount / 10) * weightRatio;
};

export const calculateStaffCount = (guestCount: number, packageTier: string) => {
  if (packageTier === 'Standard') {
    return Math.ceil(guestCount / 20); // 1 staff per 20 guests
  } else if (packageTier === 'Premium') {
    return Math.ceil(guestCount / 15); // 1 staff per 15 guests
  } else if (packageTier === 'Elite') {
    return Math.ceil(guestCount / 10); // 1 staff per 10 guests
  }
  return 1;
};

export const calculateServiceCost = (staffCount: number, hourlyRate: number, hours: number) => {
  return staffCount * hourlyRate * hours;
};

export const calculateTransportCost = (venue: string, baseFee: number) => {
  if (venue === 'Dubai') return baseFee;
  if (venue === 'Sharjah') return baseFee + 50; // Example extra fee for Sharjah
  return baseFee;
};

export const calculateVAT = (subtotal: number) => {
  return subtotal * 0.05; // 5% VAT in UAE
};
