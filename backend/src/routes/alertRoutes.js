import express from 'express';
import { z } from 'zod';
import * as alertController from '../controllers/alertController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const createAlertSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(150),
    description: z.string().min(5).max(1000),
    type: z.enum([
      'stampede_risk',
      'medical_emergency',
      'lost_child',
      'vip_movement',
      'gate_congestion',
      'maintenance',
      'general',
    ]),
    severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    zoneId: z.string().min(1),
    location: z.string().min(1),
  }),
});

const resolveAlertSchema = z.object({
  body: z.object({
    resolutionNotes: z.string().max(500).optional(),
  }),
});

// All alert routes require authenticated staff
router.use(authenticate);

router.get('/', alertController.getAlerts);
router.get('/summary', alertController.getActiveSummary);

router.post(
  '/',
  authorize('super_admin', 'admin', 'security', 'crowd_manager', 'gate_staff'),
  validate(createAlertSchema),
  alertController.createAlert
);

router.patch(
  '/:id/acknowledge',
  authorize('super_admin', 'admin', 'security', 'crowd_manager'),
  alertController.acknowledgeAlert
);

router.patch(
  '/:id/resolve',
  authorize('super_admin', 'admin', 'security', 'crowd_manager'),
  validate(resolveAlertSchema),
  alertController.resolveAlert
);

export const alertRouter = router;
export default router;
