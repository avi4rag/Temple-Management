const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Alert title is required'],
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: [true, 'Alert description is required'],
      trim: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: [
        'stampede_risk',
        'medical_emergency',
        'lost_child',
        'vip_movement',
        'gate_congestion',
        'maintenance',
        'general',
      ],
      required: [true, 'Alert type is required'],
      index: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    zoneId: {
      type: String,
      required: [true, 'Zone identifier is required'],
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Location description is required'],
    },
    status: {
      type: String,
      enum: ['active', 'acknowledged', 'resolved', 'dismissed'],
      default: 'active',
      index: true,
    },
    triggeredBy: {
      type: String,
      enum: ['system', 'manual'],
      default: 'manual',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      default: null,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

alertSchema.index({ status: 1, severity: 1, createdAt: -1 });

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
