import express from 'express';
import { z } from 'zod';
import * as bookingController from '../controllers/bookingController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const devoteeItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  age: z.number().int().min(1, 'Age must be at least 1').max(120),
  gender: z.enum(['male', 'female', 'other']).optional(),
  idType: z.enum(['aadhaar', 'pan', 'voter_id', 'passport']),
  idLast4: z
    .string()
    .length(4, 'ID must contain exactly the last 4 characters')
    .regex(/^[A-Za-z0-9]{4}$/, 'ID last 4 must be alphanumeric'),
});

const createBookingSchema = z.object({
  body: z.object({
    slotId: z.string().min(1, 'Time slot ID is required'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian phone number'),
    email: z.string().email().optional().or(z.literal('')),
    devotees: z
      .array(devoteeItemSchema)
      .min(1, 'At least 1 devotee is required')
      .max(6, 'Maximum 6 devotees per booking'),
    specialAssistance: z.boolean().optional(),
    prasadCount: z.number().int().min(0).optional(),
  }),
});

const checkInSchema = z.object({
  body: z.object({
    qrId: z.string().min(1, 'QR Ticket identifier is required'),
  }),
});

// Public endpoints
router.post('/', validate(createBookingSchema), bookingController.createBooking);
router.get('/search', bookingController.getBookingByReference);

// Staff / Gate Operator endpoints
router.post(
  '/checkin',
  authenticate,
  authorize('super_admin', 'admin', 'gate_staff', 'security'),
  validate(checkInSchema),
  bookingController.checkInDevotee
);

router.get(
  '/stats',
  authenticate,
  authorize('super_admin', 'admin', 'gate_staff', 'crowd_manager'),
  bookingController.getBookingStats
);

router.patch('/:id/cancel', authenticate, bookingController.cancelBooking);

export const bookingRouter = router;
export default router;
