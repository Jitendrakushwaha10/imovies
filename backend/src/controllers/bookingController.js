import { Booking } from '../models/Booking.js';
import { Show } from '../models/Show.js';

export const createBooking = async (req, res, next) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.user._id;

    if (!showId) {
      return res.status(400).json({
        success: false,
        message: 'Showtime ID is required.'
      });
    }

    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one seat to book.'
      });
    }

    // Clean and validate seat identifiers (e.g. 'A1', 'H10')
    const sanitizedSeats = seats.map((s) => String(s).trim().toUpperCase());
    const seatFormatRegex = /^[A-Z]\d{1,2}$/;
    for (const seat of sanitizedSeats) {
      if (!seatFormatRegex.test(seat)) {
        return res.status(400).json({
          success: false,
          message: `Invalid seat identifier: "${seat}".`
        });
      }
    }

    // Check for duplicate seats in the request itself
    const uniqueSeats = [...new Set(sanitizedSeats)];
    if (uniqueSeats.length !== sanitizedSeats.length) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate seats detected in selection.'
      });
    }

    const show = await Show.findById(showId)
      .populate('movie')
      .populate('theatre');

    if (!show || !show.active) {
      return res.status(404).json({
        success: false,
        message: 'The selected showtime is no longer active or available.'
      });
    }

    // ATOMIC RESERVATION TO PREVENT RACE CONDITIONS & DOUBLE BOOKING
    // findOneAndUpdate with $nin condition guarantees concurrency safety
    const updatedShow = await Show.findOneAndUpdate(
      {
        _id: showId,
        bookedSeats: { $nin: uniqueSeats }
      },
      {
        $push: { bookedSeats: { $each: uniqueSeats } }
      },
      { new: true }
    );

    if (!updatedShow) {
      return res.status(409).json({
        success: false,
        message:
          'Booking conflict: One or more selected seats have just been booked by another user. Please select other seats.'
      });
    }

    // Server-side calculation of price
    const seatCount = uniqueSeats.length;
    const ticketPricePerSeat = show.ticketPrice;
    const convenienceFee = 30; // standard per-booking fee
    const totalAmount = seatCount * ticketPricePerSeat + convenienceFee;

    // Unique human-readable reference code
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingReference = `IMV-${dateStr}-${randPart}`;

    const booking = await Booking.create({
      bookingReference,
      user: userId,
      show: show._id,
      movie: show.movie._id,
      theatre: show.theatre._id,
      seats: uniqueSeats,
      seatCount,
      ticketPricePerSeat,
      convenienceFee,
      totalAmount,
      status: 'CONFIRMED'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title posterUrl durationMinutes rating')
      .populate('theatre', 'name city address')
      .populate('show', 'showTime screenNumber');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title posterUrl durationMinutes rating genres')
      .populate('theatre', 'name city address')
      .populate('show', 'showTime screenNumber ticketPrice')
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

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie')
      .populate('theatre')
      .populate('show')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking reference not found.'
      });
    }

    // Check authorization: must be the booking owner or an admin
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this booking.'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    // Authorization check
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own bookings.'
      });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled.'
      });
    }

    // Atomically release the seats on the Show document
    await Show.findByIdAndUpdate(booking.show, {
      $pullAll: { bookedSeats: booking.seats }
    });

    booking.status = 'CANCELLED';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'User requested cancellation';
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title posterUrl durationMinutes')
      .populate('theatre', 'name city address')
      .populate('show', 'showTime screenNumber');

    res.status(200).json({
      success: true,
      message: 'Booking has been cancelled and seats released successfully.',
      booking: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};
