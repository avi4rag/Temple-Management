import { Booking } from '../models/Booking.js';
import { TimeSlot } from '../models/TimeSlot.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Public: Create a new Darshan booking with atomic capacity reservation
 * CRITICAL PRIVACY: Only last 4 digits of ID numbers are accepted and stored.
 */
export const createBooking = asyncHandler(async (req, res) => {
  const { slotId, phone, email, devotees, specialAssistance, prasadCount } = req.body;

  if (!devotees || !Array.isArray(devotees) || devotees.length === 0) {
    throw new AppError('At least one devotee is required for booking', 400, 'NO_DEVOTEES');
  }

  if (devotees.length > 6) {
    throw new AppError('A maximum of 6 devotees can be booked at once', 400, 'MAX_DEVOTEES_EXCEEDED');
  }

  const devoteeCount = devotees.length;

  // 1. Atomically verify and increment capacity on the TimeSlot to prevent race conditions
  const slot = await TimeSlot.findOneAndUpdate(
    {
      _id: slotId,
      status: { $in: ['available', 'filling_fast'] },
      $expr: { $lte: [{ $add: ['$booked', devoteeCount] }, '$capacity'] },
    },
    {
      $inc: { booked: devoteeCount },
    },
    { new: true }
  );

  if (!slot) {
    throw new AppError(
      'Selected time slot does not have sufficient capacity remaining',
      409,
      'CAPACITY_EXCEEDED'
    );
  }

  // 2. Format sanitized devotee documents (ensuring strict idLast4 compliance)
  const sanitizedDevotees = devotees.map((d) => ({
    name: d.name.trim(),
    age: Number(d.age),
    gender: d.gender || 'male',
    idType: d.idType,
    idLast4: String(d.idLast4).slice(-4), // Guarantee only last 4 chars
    status: 'pending',
  }));

  // 3. Generate unique booking reference and create booking document
  const reference = Booking.generateReference();

  const booking = await Booking.create({
    reference,
    phone: phone.trim(),
    email: email ? email.trim().toLowerCase() : '',
    slot: slot._id,
    devotees: sanitizedDevotees,
    status: 'confirmed',
    specialAssistance: Boolean(specialAssistance),
    prasadCount: prasadCount ? Number(prasadCount) : 0,
  });

  const populatedBooking = await Booking.findById(booking._id).populate('slot');

  res.status(201).json({
    success: true,
    message: 'Darshan booking confirmed successfully',
    data: {
      booking: populatedBooking,
    },
  });
});

/**
 * Public: Search booking by reference code & phone
 */
export const getBookingByReference = asyncHandler(async (req, res) => {
  const { reference, phone } = req.query;

  if (!reference) {
    throw new AppError('Booking reference code is required', 400, 'REFERENCE_REQUIRED');
  }

  const query = { reference: reference.toUpperCase().trim() };
  if (phone) {
    query.phone = phone.trim();
  }

  const booking = await Booking.findOne(query).populate('slot');
  if (!booking) {
    throw new AppError('No booking found with the provided details', 404, 'BOOKING_NOT_FOUND');
  }

  res.status(200).json({
    success: true,
    data: { booking },
  });
});

export default {
  createBooking,
  getBookingByReference,
};
