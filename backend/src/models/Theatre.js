import mongoose from 'mongoose';

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      default: 'Indore',
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    screens: {
      type: Number,
      default: 4
    },
    seatLayout: {
      rows: { type: Number, default: 8 },
      cols: { type: Number, default: 10 },
      rowLabels: {
        type: [String],
        default: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }
    }
  },
  {
    timestamps: true
  }
);

export const Theatre = mongoose.model('Theatre', theatreSchema);
