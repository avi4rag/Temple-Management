const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Camera name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Camera location/zone name is required'],
      trim: true,
      index: true,
    },
    zoneId: {
      type: String,
      required: [true, 'Zone identifier is required'],
      index: true,
      lowercase: true,
      trim: true,
    },
    streamUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'maintenance'],
      default: 'online',
      index: true,
    },
    fps: {
      type: Number,
      default: 30,
    },
    resolution: {
      type: String,
      default: '1080p',
    },
    lastPing: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Camera = mongoose.model('Camera', cameraSchema);

module.exports = Camera;
