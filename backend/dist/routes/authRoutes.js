import express from 'express';
import { loginWithMobile, verifyOtp, createGuestSession } from '../controllers/authController.js';
const router = express.Router();
router.post('/login', loginWithMobile);
router.post('/verify', verifyOtp);
router.post('/guest', createGuestSession);
export default router;
//# sourceMappingURL=authRoutes.js.map