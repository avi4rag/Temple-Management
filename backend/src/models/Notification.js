const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: 120,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: ['announcement', 'darshan_update', 'emergency_broadcast', 'queue_alert'],
      default: 'announcement',
      index: true,
    },
    targetAudience: {
      type: String,
      enum: ['all', 'pilgrims', 'staff', 'security'],
      default: 'all',
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ active: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
