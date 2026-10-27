import express from 'express';
import {
  getDashboardStats,
  getAllBookings
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/bookings', getAllBookings);

export default router;
