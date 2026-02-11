import express from 'express';
import { z } from 'zod';
import * as crowdController from '../controllers/crowdController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const recordReadingSchema = z.object({
  body: z.object({
    cameraId: z.string().min(1, 'Camera ID is required'),
    zoneId: z.string().min(1, 'Zone ID is required'),
    count: z.number().int().min(0, 'Count must be non-negative'),
    capacity: z.number().int().min(1).optional(),
  }),
});

// Public endpoints
router.get('/metrics', crowdController.getCurrentMetrics);
router.get('/cameras', crowdController.getCameras);
router.get('/trends', crowdController.getHistoricalTrends);

// Automated camera feed ingestion / Security
router.post(
  '/readings',
  authenticate,
  authorize('super_admin', 'admin', 'crowd_manager', 'security'),
  validate(recordReadingSchema),
  crowdController.recordReading
);

export const crowdRouter = router;
export default router;
