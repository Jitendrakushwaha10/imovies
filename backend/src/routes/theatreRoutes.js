import express from 'express';
import {
  getTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre
} from '../controllers/theatreController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTheatres)
  .post(protect, adminOnly, createTheatre);

router.route('/:id')
  .get(getTheatreById)
  .patch(protect, adminOnly, updateTheatre)
  .delete(protect, adminOnly, deleteTheatre);

export default router;
