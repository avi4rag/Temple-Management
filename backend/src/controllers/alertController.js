import { Alert } from '../models/Alert.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Get temple alerts with optional status and severity filters
 */
export const getAlerts = asyncHandler(async (req, res) => {
  const { status, severity, zoneId } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (severity) filter.severity = severity;
  if (zoneId) filter.zoneId = zoneId;

  const alerts = await Alert.find(filter)
    .populate('reportedBy', 'name role email')
    .populate('resolvedBy', 'name role email')
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({
    success: true,
    data: {
      count: alerts.length,
      alerts,
    },
  });
});

/**
 * Create a new emergency or operational alert
 */
export const createAlert = asyncHandler(async (req, res) => {
  const { title, description, type, severity, zoneId, location } = req.body;

  const alert = await Alert.create({
    title,
    description,
    type,
    severity: severity || 'medium',
    zoneId,
    location,
    triggeredBy: 'manual',
    reportedBy: req.staff ? req.staff._id : null,
    status: 'active',
  });

  res.status(201).json({
    success: true,
    message: 'Alert triggered successfully',
    data: { alert },
  });
});

/**
 * Acknowledge an active alert
 */
export const acknowledgeAlert = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const alert = await Alert.findById(id);
  if (!alert) {
    throw new AppError('Alert not found', 404, 'ALERT_NOT_FOUND');
  }

  alert.status = 'acknowledged';
  await alert.save();

  res.status(200).json({
    success: true,
    message: 'Alert acknowledged',
    data: { alert },
  });
});

/**
 * Resolve an active or acknowledged alert
 */
export const resolveAlert = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { resolutionNotes } = req.body;

  const alert = await Alert.findById(id);
  if (!alert) {
    throw new AppError('Alert not found', 404, 'ALERT_NOT_FOUND');
  }

  alert.status = 'resolved';
  alert.resolvedBy = req.staff ? req.staff._id : null;
  alert.resolvedAt = new Date();
  alert.resolutionNotes = resolutionNotes || 'Resolved by temple staff';

  await alert.save();

  res.status(200).json({
    success: true,
    message: 'Alert resolved successfully',
    data: { alert },
  });
});

/**
 * Get active alerts count summary for dashboard banner
 */
export const getActiveSummary = asyncHandler(async (req, res) => {
  const activeAlerts = await Alert.find({ status: 'active' });

  const summary = {
    total: activeAlerts.length,
    critical: activeAlerts.filter((a) => a.severity === 'critical').length,
    high: activeAlerts.filter((a) => a.severity === 'high').length,
    medium: activeAlerts.filter((a) => a.severity === 'medium').length,
    low: activeAlerts.filter((a) => a.severity === 'low').length,
  };

  res.status(200).json({
    success: true,
    data: { summary },
  });
});

export default {
  getAlerts,
  createAlert,
  acknowledgeAlert,
  resolveAlert,
  getActiveSummary,
};
