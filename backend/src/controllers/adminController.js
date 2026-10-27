import { Movie } from '../models/Movie.js';
import { Theatre } from '../models/Theatre.js';
import { Show } from '../models/Show.js';
import { Booking } from '../models/Booking.js';
import { User } from '../models/User.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalMovies,
      totalTheatres,
      totalShows,
      totalBookings,
      totalUsers,
      revenueResult,
      recentBookings
    ] = await Promise.all([
      Movie.countDocuments(),
      Theatre.countDocuments(),
      Show.countDocuments(),
      Booking.countDocuments(),
      User.countDocuments(),
      Booking.aggregate([
        { $match: { status: 'CONFIRMED' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Booking.find()
        .populate('movie', 'title')
        .populate('theatre', 'name')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(6)
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalMovies,
        totalTheatres,
        totalShows,
        totalBookings,
        totalUsers,
        totalRevenue,
        recentBookings
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      query.bookingReference = new RegExp(search.trim(), 'i');
    }

    const bookings = await Booking.find(query)
      .populate('movie', 'title posterUrl durationMinutes')
      .populate('theatre', 'name city')
      .populate('show', 'showTime')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};
