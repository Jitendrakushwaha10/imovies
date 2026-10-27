import mongoose from 'mongoose';

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required']
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre reference is required']
    },
    screenNumber: {
      type: Number,
      default: 1
    },
    showTime: {
      type: Date,
      required: [true, 'Show start time is required']
    },
    ticketPrice: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: [10, 'Price must be at least ₹10']
    },
    seatTierPrices: {
      silver: { type: Number, default: 180 },
      gold: { type: Number, default: 240 },
      platinum: { type: Number, default: 320 }
    },
    bookedSeats: {
      type: [String],
      default: []
    },
    totalSeats: {
      type: Number,
      default: 80
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

showSchema.index({ movie: 1, showTime: 1 });
showSchema.index({ theatre: 1, showTime: 1 });

export const Show = mongoose.model('Show', showSchema);
