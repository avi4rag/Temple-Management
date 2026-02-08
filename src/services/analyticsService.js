import { mockAnalyticsData } from "@/data/mock/analytics";

export const analyticsService = {
  getAnalytics: async () => {
    return Promise.resolve({ ...mockAnalyticsData });
  },
};
