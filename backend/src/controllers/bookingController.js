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
    idLast4: String(d.idLast4).slice(-4),
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

/**
 * Staff / Gate Operator: Scan individual devotee QR code and verify entry
 */
export const checkInDevotee = asyncHandler(async (req, res) => {
  const { qrId } = req.body;

  if (!qrId) {
    throw new AppError('QR ID is required for gate check-in', 400, 'QR_ID_REQUIRED');
  }

  const booking = await Booking.findOne({ 'devotees.qrId': qrId }).populate('slot');
  if (!booking) {
    throw new AppError('Invalid QR ticket: Devotee pass not found', 404, 'TICKET_NOT_FOUND');
  }

  if (booking.status === 'cancelled') {
    throw new AppError('This booking has been cancelled and is no longer valid', 400, 'BOOKING_CANCELLED');
  }

  const devotee = booking.devotees.find((d) => d.qrId === qrId);
  if (!devotee) {
    throw new AppError('Devotee pass not found in booking record', 404, 'DEVOTEE_NOT_FOUND');
  }

  if (devotee.status === 'checked_in') {
    return res.status(200).json({
      success: true,
      message: 'Devotee already checked in earlier',
      data: {
        devotee,
        bookingReference: booking.reference,
        alreadyCheckedIn: true,
        checkedInAt: devotee.enteredAt,
      },
    });
  }

  devotee.status = 'checked_in';
  devotee.enteredAt = new Date();

  if (req.staff) {
    booking.checkInStaff = req.staff._id;
  }

  const allCheckedIn = booking.devotees.every((d) => d.status === 'checked_in');
  if (allCheckedIn) {
    booking.status = 'completed';
  }

  await booking.save();

  res.status(200).json({
    success: true,
    message: `Entry authorized for devotee: ${devotee.name}`,
    data: {
      devotee,
      bookingReference: booking.reference,
      slot: booking.slot,
      remainingInGroup: booking.devotees.filter((d) => d.status === 'pending').length,
    },
  });
});

/**
 * Cancel a booking and release time slot capacity atomically
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) {
    throw new AppError('Booking not found', 404, 'BOOKING_NOT_FOUND');
  }

  if (booking.status === 'cancelled') {
    throw new AppError('Booking is already cancelled', 400, 'ALREADY_CANCELLED');
  }

  if (booking.status === 'completed') {
    throw new AppError('Cannot cancel a completed booking with checked-in devotees', 400, 'CANNOT_CANCEL_COMPLETED');
  }

  booking.status = 'cancelled';
  await booking.save();

  // Atomically decrement booked count on TimeSlot
  await TimeSlot.findByIdAndUpdate(booking.slot, {
    $inc: { booked: -booking.devotees.length },
  });

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully and slot capacity restored',
  });
});

/**
 * Admin / Staff: Aggregate booking statistics
 */
export const getBookingStats = asyncHandler(async (req, res) => {
  const today = req.query.date || new Date().toISOString().slice(0, 10);

  const todaySlots = await TimeSlot.find({ date: today }).select('_id');
  const slotIds = todaySlots.map((s) => s._id);

  const totalBookings = await Booking.countDocuments({
    slot: { $in: slotIds },
    status: { $ne: 'cancelled' },
  });

  const allDevotees = await Booking.aggregate([
    { $match: { slot: { $in: slotIds }, status: { $ne: 'cancelled' } } },
    { $unwind: '$devotees' },
    {
      $group: {
        _id: '$devotees.status',
        count: { $sum: 1 },
      },
    },
  ]);

  const stats = {
    date: today,
    totalBookings,
    checkedInDevotees: allDevotees.find((d) => d._id === 'checked_in')?.count || 0,
    pendingDevotees: allDevotees.find((d) => d._id === 'pending')?.count || 0,
  };

  res.status(200).json({
    success: true,
    data: { stats },
  });
});

export default {
  createBooking,
  getBookingByReference,
  checkInDevotee,
  cancelBooking,
  getBookingStats,
};
