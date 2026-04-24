export const calculateFoodCost = (guestCount, packageBasePrice) => {
    return guestCount * packageBasePrice;
};
export const calculateItemWeight = (guestCount, weightRatio) => {
    // Logic: (GuestCount / 10) * weightRatio
    // Minimum weight for catering starts at 15 guests
    return (guestCount / 10) * weightRatio;
};
export const calculateStaffCount = (guestCount, packageTier) => {
    if (packageTier === 'Standard') {
        return Math.ceil(guestCount / 20); // 1 staff per 20 guests
    }
    else if (packageTier === 'Premium') {
        return Math.ceil(guestCount / 15); // 1 staff per 15 guests
    }
    else if (packageTier === 'Elite') {
        return Math.ceil(guestCount / 10); // 1 staff per 10 guests
    }
    return 1;
};
export const calculateServiceCost = (staffCount, hourlyRate, hours) => {
    return staffCount * hourlyRate * hours;
};
export const calculateTransportCost = (venue, baseFee) => {
    if (venue === 'Dubai')
        return baseFee;
    if (venue === 'Sharjah')
        return baseFee + 50; // Example extra fee for Sharjah
    return baseFee;
};
export const calculateVAT = (subtotal) => {
    return subtotal * 0.05; // 5% VAT in UAE
};
//# sourceMappingURL=pricing.js.map