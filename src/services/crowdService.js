import { apiClient } from './apiClient';
import { mockCrowdData } from '@/data/mock/crowd';

export const crowdService = {
  getCrowdStatus: async () => {
    try {
      const response = await apiClient.get('/crowd/metrics');
      if (response && response.data && response.data.metrics) {
        const m = response.data.metrics;
        return {
          currentCount: m.totalCrowd,
          totalCrowd: m.totalCrowd,
          capacity: m.maxCapacity,
          maxCapacity: m.maxCapacity,
          crowdDensity: m.overallDensity,
          waitTime: `${m.estimatedWaitMinutes} mins`,
          zones: m.zones.map((z) => ({
            id: z.zoneId,
            name: z.name,
            count: z.count,
            capacity: z.capacity,
            status:
              z.density === 'critical'
                ? 'critical'
                : z.density === 'high'
                ? 'heavy'
                : z.density === 'moderate'
                ? 'moderate'
                : 'normal',
            trend: 'stable',
          })),
        };
      }
      return {
        ...mockCrowdData,
        totalCrowd: mockCrowdData.currentCount,
        maxCapacity: mockCrowdData.capacity,
      };
    } catch {
      return {
        ...mockCrowdData,
        totalCrowd: mockCrowdData.currentCount,
        maxCapacity: mockCrowdData.capacity,
      };
    }
  },

  getCrowdZones: async () => {
    try {
      const status = await crowdService.getCrowdStatus();
      return status.zones || [...mockCrowdData.zones];
    } catch {
      return [...mockCrowdData.zones];
    }
  },
};

export default crowdService;
