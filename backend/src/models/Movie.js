import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true
    },
    overview: {
      type: String,
      required: [true, 'Movie overview is required']
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster URL is required']
    },
    backdropUrl: {
      type: String,
      default: ''
    },
    genres: {
      type: [String],
      required: [true, 'At least one genre is required'],
      index: true
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [1, 'Duration must be at least 1 minute']
    },
    rating: {
      type: Number,
      default: 8.0,
      min: 0,
      max: 10
    },
    releaseDate: {
      type: Date
    },
    language: {
      type: String,
      default: 'English'
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    director: {
      type: String,
      default: ''
    },
    cast: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Compound index for quick text search (with language_override: 'none' to avoid conflict with movie.language field)
movieSchema.index({ title: 'text', overview: 'text' }, { default_language: 'none', language_override: 'none' });

export const Movie = mongoose.model('Movie', movieSchema);
