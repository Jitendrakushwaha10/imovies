import express from 'express';
import {
  getShows,
  getShowById,
  getShowSeats,
  createShow,
  updateShow,
  deleteShow
} from '../controllers/showController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getShows)
  .post(protect, adminOnly, createShow);

router.get('/:id/seats', getShowSeats);

router.route('/:id')
  .get(getShowById)
  .patch(protect, adminOnly, updateShow)
  .delete(protect, adminOnly, deleteShow);

export default router;
