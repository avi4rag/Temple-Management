const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema(
  {
    date: {
      type: String, // Stored as ISO date string 'YYYY-MM-DD' for exact calendar matching
      required: [true, 'Slot date is required'],
      index: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    startTime: {
      type: String, // 'HH:mm' 24-hr format e.g. '06:00'
      required: [true, 'Slot start time is required'],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Start time must be in HH:mm format'],
    },
    endTime: {
      type: String, // 'HH:mm' 24-hr format e.g. '07:00'
      required: [true, 'Slot end time is required'],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'End time must be in HH:mm format'],
    },
    capacity: {
      type: Number,
      required: [true, 'Slot capacity is required'],
      min: [1, 'Capacity must be at least 1 devotee'],
      default: 500,
    },
    booked: {
      type: Number,
      default: 0,
      min: [0, 'Booked count cannot be negative'],
    },
    status: {
      type: String,
      enum: ['available', 'filling_fast', 'full', 'cancelled', 'completed'],
      default: 'available',
    },
    notes: {
      type: String,
      maxlength: 300,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound unique index ensuring only one slot can exist for a specific date and start time
timeSlotSchema.index({ date: 1, startTime: 1 }, { unique: true });

// Virtual for remaining spots
timeSlotSchema.virtual('availableSpots').get(function () {
  return Math.max(0, this.capacity - this.booked);
});

// Virtual for occupancy percentage
timeSlotSchema.virtual('occupancyPercentage').get(function () {
  if (this.capacity === 0) return 100;
  return Math.min(100, Math.round((this.booked / this.capacity) * 100));
});

// Middleware to dynamically update status based on occupancy
timeSlotSchema.pre('save', function (next) {
  if (this.status !== 'cancelled' && this.status !== 'completed') {
    if (this.booked >= this.capacity) {
      this.status = 'full';
    } else if (this.booked / this.capacity >= 0.8) {
      this.status = 'filling_fast';
    } else {
      this.status = 'available';
    }
  }
  next();
});

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = TimeSlot;
