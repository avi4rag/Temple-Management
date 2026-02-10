import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'security', 'gate_staff', 'crowd_manager'],
      default: 'gate_staff',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    failedLogins: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual to check if account is currently locked out
staffSchema.virtual('isLocked').get(function () {
  return Boolean(this.lockedUntil && this.lockedUntil > Date.now());
});

// Compare plaintext password with stored hash
staffSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

// Handle consecutive failed login attempt with exponential or 15-min lockout after 5 fails
staffSchema.methods.handleFailedLogin = async function () {
  this.failedLogins += 1;
  if (this.failedLogins >= 5) {
    this.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes lockout
  }
  return this.save();
};

// Reset failed login counter upon successful authentication
staffSchema.methods.handleSuccessfulLogin = async function () {
  this.failedLogins = 0;
  this.lockedUntil = null;
  this.lastLogin = new Date();
  return this.save();
};

export const Staff = mongoose.model('Staff', staffSchema);
export default Staff;
