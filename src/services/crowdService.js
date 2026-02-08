import { mockCrowdData } from "@/data/mock/crowd";

export const crowdService = {
  getCrowdStatus: async () => {
    return Promise.resolve({ ...mockCrowdData });
  },
  getCrowdZones: async () => {
    return Promise.resolve([...mockCrowdData.zones]);
  },
};
