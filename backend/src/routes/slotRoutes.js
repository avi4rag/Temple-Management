import express from 'express';
import { z } from 'zod';
import * as slotController from '../controllers/slotController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const querySchema = z.object({
  query: z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD')
      .optional(),
  }),
});

const createSlotSchema = z.object({
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Start time must be HH:mm'),
    endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'End time must be HH:mm'),
    capacity: z.number().int().min(1, 'Capacity must be at least 1').optional(),
    notes: z.string().max(300).optional(),
  }),
});

const updateSlotSchema = z.object({
  body: z.object({
    capacity: z.number().int().min(1).optional(),
    status: z.enum(['available', 'filling_fast', 'full', 'cancelled', 'completed']).optional(),
    notes: z.string().max(300).optional(),
  }),
});

// Public endpoints
router.get('/', validate(querySchema), slotController.getAvailableSlots);
router.get('/:id', slotController.getSlotById);

// Admin-only endpoints
router.post(
  '/',
  authenticate,
  authorize('super_admin', 'admin'),
  validate(createSlotSchema),
  slotController.createSlot
);

router.patch(
  '/:id',
  authenticate,
  authorize('super_admin', 'admin'),
  validate(updateSlotSchema),
  slotController.updateSlot
);

router.delete(
  '/:id',
  authenticate,
  authorize('super_admin'),
  slotController.deleteSlot
);

export const slotRouter = router;
export default router;
