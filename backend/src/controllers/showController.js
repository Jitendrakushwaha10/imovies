import { Show } from '../models/Show.js';
import { Movie } from '../models/Movie.js';
import { Theatre } from '../models/Theatre.js';
import { Booking } from '../models/Booking.js';

export const getShows = async (req, res, next) => {
  try {
    const { movieId, theatreId, date } = req.query;
    const query = { active: true };

    if (movieId) query.movie = movieId;
    if (theatreId) query.theatre = theatreId;

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.showTime = { $gte: startOfDay, $lte: endOfDay };
    }

    const shows = await Show.find(query)
      .populate('movie', 'title posterUrl durationMinutes rating genres')
      .populate('theatre', 'name city address seatLayout')
      .sort({ showTime: 1 });

    res.status(200).json({
      success: true,
      count: shows.length,
      shows
    });
  } catch (error) {
    next(error);
  }
};

export const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theatre');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found.'
      });
    }

    res.status(200).json({
      success: true,
      show
    });
  } catch (error) {
    next(error);
  }
};

export const getShowSeats = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie', 'title posterUrl durationMinutes rating')
      .populate('theatre', 'name city address seatLayout');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found.'
      });
    }

    // Default 8 rows of 10 seats if not specified
    const rows = show.theatre?.seatLayout?.rows || 8;
    const cols = show.theatre?.seatLayout?.cols || 10;
    const rowLabels = show.theatre?.seatLayout?.rowLabels || [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'
    ];

    res.status(200).json({
      success: true,
      showId: show._id,
      movie: show.movie,
      theatre: show.theatre,
      showTime: show.showTime,
      ticketPrice: show.ticketPrice,
      seatTierPrices: show.seatTierPrices,
      bookedSeats: show.bookedSeats || [],
      totalSeats: show.totalSeats || rows * cols,
      layout: {
        rows,
        cols,
        rowLabels
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createShow = async (req, res, next) => {
  try {
    const {
      movieId,
      theatreId,
      screenNumber,
      showTime,
      ticketPrice,
      silverPrice,
      goldPrice,
      platinumPrice
    } = req.body;

    if (!movieId || !theatreId || !showTime || !ticketPrice) {
      return res.status(400).json({
        success: false,
        message: 'Movie, theatre, showtime, and ticket price are required.'
      });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(400).json({
        success: false,
        message: 'Referenced movie does not exist.'
      });
    }

    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(400).json({
        success: false,
        message: 'Referenced theatre does not exist.'
      });
    }

    const parsedTime = new Date(showTime);
    if (isNaN(parsedTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid showtime date format.'
      });
    }

    const price = Number(ticketPrice);
    const show = await Show.create({
      movie: movieId,
      theatre: theatreId,
      screenNumber: screenNumber || 1,
      showTime: parsedTime,
      ticketPrice: price,
      seatTierPrices: {
        silver: silverPrice ? Number(silverPrice) : Math.round(price * 0.8),
        gold: goldPrice ? Number(goldPrice) : price,
        platinum: platinumPrice ? Number(platinumPrice) : Math.round(price * 1.3)
      },
      bookedSeats: [],
      totalSeats:
        (theatre.seatLayout?.rows || 8) * (theatre.seatLayout?.cols || 10),
      active: true
    });

    const populated = await Show.findById(show._id)
      .populate('movie', 'title')
      .populate('theatre', 'name');

    res.status(201).json({
      success: true,
      message: 'Show created successfully.',
      show: populated
    });
  } catch (error) {
    next(error);
  }
};

export const updateShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Show updated successfully.',
      show
    });
  } catch (error) {
    next(error);
  }
};

export const deleteShow = async (req, res, next) => {
  try {
    const bookingsCount = await Booking.countDocuments({
      show: req.params.id,
      status: 'CONFIRMED'
    });

    if (bookingsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete show: There are ${bookingsCount} active booking(s) for this showtime.`
      });
    }

    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Show deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
