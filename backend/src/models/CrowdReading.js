import mongoose from 'mongoose';

const crowdReadingSchema = new mongoose.Schema(
  {
    camera: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Camera',
      required: [true, 'Associated camera is required'],
      index: true,
    },
    zoneId: {
      type: String,
      required: [true, 'Zone identifier is required'],
      index: true,
    },
    count: {
      type: Number,
      required: [true, 'Detected headcount is required'],
      min: [0, 'Headcount cannot be negative'],
    },
    capacity: {
      type: Number,
      required: [true, 'Zone maximum capacity is required'],
      min: [1, 'Capacity must be positive'],
    },
    density: {
      type: String,
      enum: ['low', 'moderate', 'high', 'critical'],
      default: 'low',
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

crowdReadingSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });
crowdReadingSchema.index({ zoneId: 1, timestamp: -1 });

crowdReadingSchema.pre('save', function (next) {
  if (this.capacity > 0) {
    const ratio = this.count / this.capacity;
    if (ratio >= 0.9) {
      this.density = 'critical';
    } else if (ratio >= 0.7) {
      this.density = 'high';
    } else if (ratio >= 0.4) {
      this.density = 'moderate';
    } else {
      this.density = 'low';
    }
  }
  next();
});

export const CrowdReading = mongoose.model('CrowdReading', crowdReadingSchema);
export default CrowdReading;
