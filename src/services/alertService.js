import { mockAlerts } from "@/data/mock/alerts";

let inMemoryAlerts = [...mockAlerts];

export const alertService = {
  getAlerts: async () => {
    return Promise.resolve([...inMemoryAlerts]);
  },
  acknowledgeAlert: async (alertId, acknowledgedBy = "admin-1") => {
    inMemoryAlerts = inMemoryAlerts.map((alert) =>
      alert.id === alertId
        ? {
            ...alert,
            status: "acknowledged",
            acknowledged_by: acknowledgedBy,
            acknowledged_at: new Date().toISOString(),
          }
        : alert,
    );
    return Promise.resolve({ success: true, alertId });
  },
  reportAlert: async (newAlert) => {
    const created = {
      id: String(Date.now()),
      status: "active",
      time: "Just now",
      created_at: new Date().toISOString(),
      ...newAlert,
    };
    inMemoryAlerts = [created, ...inMemoryAlerts];
    return Promise.resolve(created);
  },
};
