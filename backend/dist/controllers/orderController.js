import {} from 'express';
import Order from '../models/Order.js';
import * as pricingEngine from '../services/pricing.js';
export const createOrder = async (req, res) => {
    try {
        const { userId, eventDetails, packageId, selectedMenu, additionalChoices, customerDetails } = req.body;
        // TODO: Fetch package and menu items from DB to get base prices and weights
        // For now, assume prices are passed or simplified
        // In a real scenario, we would calculate pricing here
        const foodCost = pricingEngine.calculateFoodCost(eventDetails.guestCount, 100); // Placeholder base price
        const subtotal = foodCost; // + other costs
        const vat = pricingEngine.calculateVAT(subtotal);
        const total = subtotal + vat;
        const order = new Order({
            orderId: `ORD-${Date.now()}`,
            userId,
            eventDetails,
            packageId,
            selectedMenu,
            additionalChoices,
            customerDetails,
            pricing: {
                foodCost,
                serviceCost: 0,
                transportCost: 0,
                vat,
                total
            },
            status: 'pending'
        });
        await order.save();
        res.status(201).json(order);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId packageId selectedMenu.itemId');
        if (!order)
            return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=orderController.js.map