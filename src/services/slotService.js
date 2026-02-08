import { mockTimeSlots } from "@/data/mock/slots";

export const slotService = {
  getSlots: async () => {
    return Promise.resolve([...mockTimeSlots]);
  },
  bookSlot: async (bookingData) => {
    return Promise.resolve({
      success: true,
      bookingReference: `SNT${Date.now()}`,
      ...bookingData,
    });
  },
};
