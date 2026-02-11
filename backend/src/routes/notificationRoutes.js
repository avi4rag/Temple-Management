import express from 'express';
import { z } from 'zod';
import * as notificationController from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const createNotificationSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(120),
    message: z.string().min(5).max(500),
    type: z.enum(['announcement', 'darshan_update', 'emergency_broadcast', 'queue_alert']).optional(),
    targetAudience: z.enum(['all', 'pilgrims', 'staff', 'security']).optional(),
  }),
});

// Public endpoint
router.get('/', notificationController.getActiveNotifications);

// Admin-only creation endpoint
router.post(
  '/',
  authenticate,
  authorize('super_admin', 'admin', 'crowd_manager'),
  validate(createNotificationSchema),
  notificationController.createNotification
);

export const notificationRouter = router;
export default router;
