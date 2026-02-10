import mongoose from 'mongoose';
import crypto from 'crypto';

// Embedded devotee sub-schema
// CRITICAL PRIVACY RULE: Store ONLY the last 4 digits of ID numbers (idLast4). Never store full Aadhaar numbers.
const devoteeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Devotee name is required'],
      trim: true,
      maxlength: 100,
    },
    age: {
      type: Number,
      required: [true, 'Devotee age is required'],
      min: [1, 'Age must be at least 1'],
      max: [120, 'Age must be valid'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male',
    },
    idType: {
      type: String,
      enum: ['aadhaar', 'pan', 'voter_id', 'passport'],
      required: [true, 'ID type is required'],
    },
    idLast4: {
      type: String,
      required: [true, 'Last 4 digits of ID are required'],
      match: [/^[A-Za-z0-9]{4}$/, 'ID must contain exactly 4 alphanumeric characters'],
    },
    qrId: {
      type: String,
      default: () => crypto.randomUUID(),
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'checked_in', 'cancelled'],
      default: 'pending',
    },
    enteredAt: {
      type: Date,
      default: null,
    },
  },
  { _id: true }
);

const bookingSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: [true, 'Booking reference is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Primary contact phone number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeSlot',
      required: [true, 'Associated time slot is required'],
      index: true,
    },
    devotees: {
      type: [devoteeSchema],
      validate: [
        {
          validator: (arr) => arr.length >= 1 && arr.length <= 6,
          message: 'Booking must include between 1 and 6 devotees',
        },
      ],
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed', 'no_show'],
      default: 'confirmed',
      index: true,
    },
    specialAssistance: {
      type: Boolean,
      default: false,
    },
    prasadCount: {
      type: Number,
      default: 0,
      min: [0, 'Prasad count cannot be negative'],
    },
    checkInStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookingSchema.index({ phone: 1, createdAt: -1 });
bookingSchema.index({ slot: 1, status: 1 });
bookingSchema.index({ 'devotees.qrId': 1 });

bookingSchema.virtual('devoteeCount').get(function () {
  return this.devotees ? this.devotees.length : 0;
});

bookingSchema.virtual('checkedInCount').get(function () {
  if (!this.devotees) return 0;
  return this.devotees.filter((d) => d.status === 'checked_in').length;
});

bookingSchema.statics.generateReference = function () {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomChars = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `DS-${dateStr}-${randomChars}`;
};

export const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
