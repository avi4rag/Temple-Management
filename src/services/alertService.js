import { apiClient } from './apiClient';
import { mockAlerts } from '@/data/mock/alerts';

let inMemoryAlerts = [...mockAlerts];

export const alertService = {
  getAlerts: async () => {
    try {
      const response = await apiClient.get('/alerts');
      if (response && response.data && response.data.alerts && response.data.alerts.length > 0) {
        return response.data.alerts.map((a) => ({
          id: a._id || a.id,
          type: a.type,
          severity: a.severity,
          title: a.title,
          description: a.description,
          location: a.location,
          status: a.status,
          time: new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          created_at: a.createdAt,
        }));
      }
      return [...inMemoryAlerts];
    } catch {
      return [...inMemoryAlerts];
    }
  },

  acknowledgeAlert: async (alertId, acknowledgedBy = 'admin-1') => {
    try {
      await apiClient.patch(`/alerts/${alertId}/acknowledge`, {});
      return { success: true, alertId };
    } catch {
      inMemoryAlerts = inMemoryAlerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'acknowledged',
              acknowledged_by: acknowledgedBy,
              acknowledged_at: new Date().toISOString(),
            }
          : alert
      );
      return { success: true, alertId };
    }
  },

  reportAlert: async (newAlert) => {
    try {
      const response = await apiClient.post('/alerts', newAlert);
      return response.data.alert;
    } catch {
      const created = {
        id: String(Date.now()),
        status: 'active',
        time: 'Just now',
        created_at: new Date().toISOString(),
        ...newAlert,
      };
      inMemoryAlerts = [created, ...inMemoryAlerts];
      return created;
    }
  },
};

export default alertService;
