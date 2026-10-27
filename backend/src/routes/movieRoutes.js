import express from 'express';
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} from '../controllers/movieController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getMovies)
  .post(protect, adminOnly, createMovie);

router.route('/:id')
  .get(getMovieById)
  .patch(protect, adminOnly, updateMovie)
  .delete(protect, adminOnly, deleteMovie);

export default router;
