import { TimeSlot } from '../models/TimeSlot.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Get available time slots for a specific date
 * Query param: ?date=YYYY-MM-DD (defaults to today)
 */
export const getAvailableSlots = asyncHandler(async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);

  const slots = await TimeSlot.find({ date, status: { $ne: 'cancelled' } }).sort({
    startTime: 1,
  });

  res.status(200).json({
    success: true,
    data: {
      date,
      count: slots.length,
      slots,
    },
  });
});

/**
 * Get single slot by ID with details
 */
export const getSlotById = asyncHandler(async (req, res) => {
  const slot = await TimeSlot.findById(req.params.id);
  if (!slot) {
    throw new AppError('Time slot not found', 404, 'SLOT_NOT_FOUND');
  }

  res.status(200).json({
    success: true,
    data: { slot },
  });
});

/**
 * Admin: Create a new time slot
 */
export const createSlot = asyncHandler(async (req, res) => {
  const { date, startTime, endTime, capacity, notes } = req.body;

  const existing = await TimeSlot.findOne({ date, startTime });
  if (existing) {
    throw new AppError(
      `A slot on ${date} starting at ${startTime} already exists`,
      409,
      'SLOT_ALREADY_EXISTS'
    );
  }

  const slot = await TimeSlot.create({
    date,
    startTime,
    endTime,
    capacity: capacity || 500,
    notes: notes || '',
  });

  res.status(201).json({
    success: true,
    message: 'Time slot created successfully',
    data: { slot },
  });
});

/**
 * Admin: Update slot capacity, status or notes
 */
export const updateSlot = asyncHandler(async (req, res) => {
  const { capacity, status, notes } = req.body;

  const slot = await TimeSlot.findById(req.params.id);
  if (!slot) {
    throw new AppError('Time slot not found', 404, 'SLOT_NOT_FOUND');
  }

  if (capacity !== undefined) {
    if (capacity < slot.booked) {
      throw new AppError(
        `Cannot reduce capacity to ${capacity}. Already booked: ${slot.booked}`,
        400,
        'CAPACITY_BELOW_BOOKED'
      );
    }
    slot.capacity = capacity;
  }

  if (status !== undefined) slot.status = status;
  if (notes !== undefined) slot.notes = notes;

  await slot.save();

  res.status(200).json({
    success: true,
    message: 'Time slot updated successfully',
    data: { slot },
  });
});

/**
 * Admin: Delete a time slot (only if zero bookings)
 */
export const deleteSlot = asyncHandler(async (req, res) => {
  const slot = await TimeSlot.findById(req.params.id);
  if (!slot) {
    throw new AppError('Time slot not found', 404, 'SLOT_NOT_FOUND');
  }

  if (slot.booked > 0) {
    throw new AppError(
      `Cannot delete slot with ${slot.booked} active bookings. Mark as cancelled instead.`,
      400,
      'SLOT_HAS_BOOKINGS'
    );
  }

  await slot.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Time slot deleted successfully',
  });
});

export default {
  getAvailableSlots,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot,
};
