import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import Package from '../models/Package.js';
import MealPack from '../models/MealPack.js';
import AvailableDate from '../models/AvailableDate.js';
import OccasionMenu from '../models/OccasionMenu.js';
import MealBoxMenu from '../models/MealBoxMenu.js';
import Lead from '../models/Lead.js';
// Admin Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Dashboard Stats
export const getStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const revenueResult = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$pricing.total' } } }
        ]);
        const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
        res.json({
            totalOrders,
            pendingOrders,
            revenue
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Menu Management
export const getMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.find().sort({ category: 1, name: 1 });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const createMenuItem = async (req, res) => {
    try {
        const item = new MenuItem(req.body);
        await item.save();
        res.status(201).json(item);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const createBulkMenuItems = async (req, res) => {
    try {
        const items = req.body;
        if (!Array.isArray(items)) {
            return res.status(400).json({ message: 'Expected an array of items' });
        }
        const inserted = await MenuItem.insertMany(items);
        res.status(201).json(inserted);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const updateMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item)
            return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const deleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndDelete(req.params.id);
        if (!item)
            return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Order Management
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email mobile')
            .populate('packageId', 'name')
            .sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order)
            return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Meal Pack / Package Management
export const getMealPacks = async (req, res) => {
    try {
        const packs = await MealPack.find().sort({ type: 1, name: 1 });
        res.json(packs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const createMealPack = async (req, res) => {
    try {
        const pack = new MealPack(req.body);
        await pack.save();
        res.status(201).json(pack);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const updateMealPack = async (req, res) => {
    try {
        const pack = await MealPack.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pack)
            return res.status(404).json({ message: 'Pack not found' });
        res.json(pack);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const deleteMealPack = async (req, res) => {
    try {
        const pack = await MealPack.findByIdAndDelete(req.params.id);
        if (!pack)
            return res.status(404).json({ message: 'Pack not found' });
        res.json({ message: 'Pack deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Bulk Menu Actions
export const bulkToggleMenuItems = async (req, res) => {
    try {
        const { ids, is_active } = req.body;
        await MenuItem.updateMany({ _id: { $in: ids } }, { is_active });
        res.json({ message: 'Status updated for selected items' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const bulkDeleteMenuItems = async (req, res) => {
    try {
        const { ids } = req.body;
        await MenuItem.deleteMany({ _id: { $in: ids } });
        res.json({ message: 'Selected items deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Bulk Package Actions
export const bulkToggleMealPacks = async (req, res) => {
    try {
        const { ids, is_active } = req.body;
        await MealPack.updateMany({ _id: { $in: ids } }, { is_active });
        res.json({ message: 'Status updated for selected packages' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const bulkDeleteMealPacks = async (req, res) => {
    try {
        const { ids } = req.body;
        await MealPack.deleteMany({ _id: { $in: ids } });
        res.json({ message: 'Selected packages deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Available Date Management
export const getAvailableDates = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Automatically delete expired dates
        await AvailableDate.deleteMany({ date: { $lt: today } });
        const dates = await AvailableDate.find({ date: { $gte: today } }).sort({ date: 1 });
        res.json(dates);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const createAvailableDate = async (req, res) => {
    try {
        const { date } = req.body;
        const exists = await AvailableDate.findOne({ date: new Date(date) });
        if (exists)
            return res.status(400).json({ message: 'Date already exists' });
        const newDate = new AvailableDate({ date });
        await newDate.save();
        res.status(201).json(newDate);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const deleteAvailableDate = async (req, res) => {
    try {
        await AvailableDate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Date deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const bulkCreateAvailableDates = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start and end dates are required' });
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start > end) {
            return res.status(400).json({ message: 'Start date must be before end date' });
        }
        const datesToInsert = [];
        let current = new Date(start);
        while (current <= end) {
            datesToInsert.push({ date: new Date(current) });
            current.setDate(current.getDate() + 1);
        }
        // Insert dates, ignore duplicates if they exist (though we could check)
        // For simplicity, we just use insertMany with ordered: false to skip duplicates if index is unique
        // Our model currently doesn't have a unique index on date field, but we should probably add it or check here.
        const existingDates = await AvailableDate.find({
            date: { $gte: start, $lte: end }
        });
        const existingDateStrings = new Set(existingDates.map(d => d.date.toISOString().split('T')[0]));
        const uniqueDatesToInsert = datesToInsert.filter(d => !existingDateStrings.has(d.date.toISOString().split('T')[0]));
        if (uniqueDatesToInsert.length > 0) {
            await AvailableDate.insertMany(uniqueDatesToInsert);
        }
        res.status(201).json({ message: `Successfully added ${uniqueDatesToInsert.length} dates` });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Occasion Menu Management
export const getOccasionMenus = async (req, res) => {
    try {
        const menus = await OccasionMenu.find()
            .populate('items.itemId')
            .sort({ occasion: 1, package: 1 });
        res.json(menus);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getOccasionMenuByQuery = async (req, res) => {
    try {
        const occasion = req.query.occasion;
        const pkg = req.query.package;
        const menu = await OccasionMenu.findOne({ occasion, package: pkg })
            .populate('items.itemId');
        if (!menu)
            return res.status(404).json({ message: 'No default menu found for this combination' });
        res.json(menu);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const createOccasionMenu = async (req, res) => {
    try {
        const menu = new OccasionMenu(req.body);
        await menu.save();
        res.status(201).json(menu);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const updateOccasionMenu = async (req, res) => {
    try {
        const menu = await OccasionMenu.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!menu)
            return res.status(404).json({ message: 'Menu not found' });
        res.json(menu);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const deleteOccasionMenu = async (req, res) => {
    try {
        const menu = await OccasionMenu.findByIdAndDelete(req.params.id);
        if (!menu)
            return res.status(404).json({ message: 'Menu not found' });
        res.json({ message: 'Menu group deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const bulkCreateOccasionMenus = async (req, res) => {
    try {
        const groups = req.body; // Expecting array of { occasion, package, dishes: [name|id], basePrice }
        const processedGroups = [];
        for (const group of groups) {
            const itemObjects = [];
            for (const dish of group.dishes) {
                let menuItem;
                if (mongoose.Types.ObjectId.isValid(dish)) {
                    menuItem = await MenuItem.findById(dish);
                }
                else {
                    menuItem = await MenuItem.findOne({ name: dish });
                }
                if (menuItem) {
                    itemObjects.push({ itemId: menuItem._id, defaultQuantity: 1 });
                }
            }
            processedGroups.push({
                occasion: group.occasion,
                package: group.package,
                items: itemObjects,
                basePrice: group.basePrice,
                is_active: true
            });
        }
        // Use upsert logic or clear and insert? Clearing might be safer for "syncing"
        // For now, let's just insert many and handle duplicates if any
        const inserted = await OccasionMenu.insertMany(processedGroups, { ordered: false });
        res.status(201).json(inserted);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Meal Box Menu Management
export const getMealBoxMenus = async (req, res) => {
    try {
        const menus = await MealBoxMenu.find()
            .populate('items.itemId')
            .sort({ boxType: 1, package: 1 });
        res.json(menus);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getMealBoxMenuByQuery = async (req, res) => {
    try {
        const boxType = req.query.type; // 'Adult', 'Kids', 'Snack'
        const pkg = req.query.package; // 'Standard', 'Premium', 'Elite'
        const menu = await MealBoxMenu.findOne({ boxType, package: pkg })
            .populate('items.itemId');
        if (!menu)
            return res.status(404).json({ message: 'No configuration found for this meal box' });
        res.json(menu);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const createMealBoxMenu = async (req, res) => {
    try {
        const menu = new MealBoxMenu(req.body);
        await menu.save();
        res.status(201).json(menu);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const updateMealBoxMenu = async (req, res) => {
    try {
        const menu = await MealBoxMenu.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!menu)
            return res.status(404).json({ message: 'Configuration not found' });
        res.json(menu);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const deleteMealBoxMenu = async (req, res) => {
    try {
        const menu = await MealBoxMenu.findByIdAndDelete(req.params.id);
        if (!menu)
            return res.status(404).json({ message: 'Configuration not found' });
        res.json({ message: 'Meal box group deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const bulkCreateMealBoxMenus = async (req, res) => {
    try {
        const groups = req.body; // Array of { boxType, package, dishes: [name|id] }
        const processedGroups = [];
        for (const group of groups) {
            const itemObjects = [];
            for (const dish of group.dishes) {
                let menuItem;
                if (mongoose.Types.ObjectId.isValid(dish)) {
                    menuItem = await MenuItem.findById(dish);
                }
                else {
                    menuItem = await MenuItem.findOne({ name: dish });
                }
                if (menuItem) {
                    itemObjects.push({ itemId: menuItem._id, defaultQuantity: 1 });
                }
            }
            processedGroups.push({
                boxType: group.boxType,
                package: group.package,
                items: itemObjects,
                is_active: true
            });
        }
        const inserted = await MealBoxMenu.insertMany(processedGroups, { ordered: false });
        res.status(201).json(inserted);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Lead/Customer Management
export const createLead = async (req, res) => {
    try {
        const lead = new Lead(req.body);
        await lead.save();
        res.status(201).json(lead);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const getLeads = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};
        if (startDate && endDate) {
            query = {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }
        const leads = await Lead.find(query).sort({ createdAt: -1 });
        res.json(leads);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=adminController.js.map