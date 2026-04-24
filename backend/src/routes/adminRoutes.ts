import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public admin routes
router.post('/login', adminController.login);

// Protected admin routes
router.use(authenticate, isAdmin);
router.get('/stats', adminController.getStats);

// Menu management
router.get('/menu', adminController.getMenuItems);
router.post('/menu/bulk', adminController.createBulkMenuItems);
router.post('/menu/bulk-toggle', adminController.bulkToggleMenuItems);
router.post('/menu/bulk-delete', adminController.bulkDeleteMenuItems);
router.post('/menu', adminController.createMenuItem);
router.put('/menu/:id', adminController.updateMenuItem);
router.delete('/menu/:id', adminController.deleteMenuItem);

// Package / Meal Pack management
router.get('/packages', adminController.getMealPacks);
router.post('/packages/bulk-toggle', adminController.bulkToggleMealPacks);
router.post('/packages/bulk-delete', adminController.bulkDeleteMealPacks);
router.post('/packages', adminController.createMealPack);
router.put('/packages/:id', adminController.updateMealPack);
router.delete('/packages/:id', adminController.deleteMealPack);

// Order management
router.get('/orders', adminController.getOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

// Available Dates
router.get('/available-dates', adminController.getAvailableDates);
router.post('/available-dates', adminController.createAvailableDate);
router.post('/available-dates/bulk', adminController.bulkCreateAvailableDates);
router.delete('/available-dates/:id', adminController.deleteAvailableDate);
router.post('/available-dates/bulk-delete', adminController.bulkDeleteAvailableDates);

// Occasion Menus
router.get('/occasion-menus', adminController.getOccasionMenus);
router.post('/occasion-menus', adminController.createOccasionMenu);
router.put('/occasion-menus/:id', adminController.updateOccasionMenu);
router.delete('/occasion-menus/:id', adminController.deleteOccasionMenu);
router.post('/occasion-menus/bulk', adminController.bulkCreateOccasionMenus);

// Meal Box Menus
router.get('/meal-box-menus', adminController.getMealBoxMenus);
router.post('/meal-box-menus', adminController.createMealBoxMenu);
router.put('/meal-box-menus/:id', adminController.updateMealBoxMenu);
router.delete('/meal-box-menus/:id', adminController.deleteMealBoxMenu);
router.post('/meal-box-menus/bulk', adminController.bulkCreateMealBoxMenus);
router.get('/leads', adminController.getLeads);

export default router;
