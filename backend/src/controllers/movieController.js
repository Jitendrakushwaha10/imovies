import { Movie } from '../models/Movie.js';
import { Show } from '../models/Show.js';

export const getMovies = async (req, res, next) => {
  try {
    const { search, genre, sort, featured } = req.query;
    const query = {};

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { genres: searchRegex },
        { overview: searchRegex }
      ];
    }

    if (genre && genre !== 'All') {
      query.genres = { $in: [new RegExp(`^${genre}$`, 'i')] };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'top-rated') {
      sortOption = { rating: -1 };
    } else if (sort === 'newest') {
      sortOption = { releaseDate: -1, createdAt: -1 };
    } else if (sort === 'alphabetical') {
      sortOption = { title: 1 };
    }

    const movies = await Movie.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: movies.length,
      movies
    });
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found with the requested ID.'
      });
    }

    // Fetch upcoming shows for this movie with theatre information
    const shows = await Show.find({
      movie: movie._id,
      active: true,
      showTime: { $gte: new Date(Date.now() - 3 * 60 * 60 * 1000) } // allow recent shows
    })
      .populate('theatre', 'name city address seatLayout')
      .sort({ showTime: 1 });

    res.status(200).json({
      success: true,
      movie,
      shows
    });
  } catch (error) {
    next(error);
  }
};

export const createMovie = async (req, res, next) => {
  try {
    const {
      title,
      overview,
      posterUrl,
      backdropUrl,
      genres,
      durationMinutes,
      rating,
      releaseDate,
      language,
      featured,
      director,
      cast
    } = req.body;

    if (!title || !overview || !posterUrl || !durationMinutes) {
      return res.status(400).json({
        success: false,
        message: 'Title, overview, poster URL, and duration are required.'
      });
    }

    const parsedGenres = Array.isArray(genres)
      ? genres
      : typeof genres === 'string'
      ? genres.split(',').map((g) => g.trim())
      : ['Action'];

    const movie = await Movie.create({
      title: title.trim(),
      overview: overview.trim(),
      posterUrl: posterUrl.trim(),
      backdropUrl: backdropUrl ? backdropUrl.trim() : '',
      genres: parsedGenres,
      durationMinutes: Number(durationMinutes),
      rating: rating ? Number(rating) : 8.0,
      releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
      language: language || 'English',
      featured: Boolean(featured),
      director: director || '',
      cast: Array.isArray(cast) ? cast : []
    });

    res.status(201).json({
      success: true,
      message: 'Movie added successfully.',
      movie
    });
  } catch (error) {
    next(error);
  }
};

export const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully.',
      movie
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found.'
      });
    }

    // Check if there are active shows or bookings
    const showsCount = await Show.countDocuments({ movie: movie._id });
    if (showsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete movie: It has ${showsCount} associated showtime(s). Please remove or reassign the shows first.`
      });
    }

    await Movie.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
