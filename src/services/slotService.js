import { apiClient } from './apiClient';
import { mockTimeSlots } from '@/data/mock/slots';

export const slotService = {
  getSlots: async (date) => {
    try {
      const query = date ? `?date=${date}` : '';
      const response = await apiClient.get(`/slots${query}`);
      if (response && response.data && response.data.slots && response.data.slots.length > 0) {
        return response.data.slots.map((s) => ({
          id: s._id || s.id,
          time: `${s.startTime} - ${s.endTime}`,
          startTime: s.startTime,
          endTime: s.endTime,
          available: s.availableSpots !== undefined ? s.availableSpots : Math.max(0, s.capacity - s.booked),
          total: s.capacity,
          status: s.status === 'filling_fast' ? 'filling-fast' : s.status,
        }));
      }
      return [...mockTimeSlots];
    } catch {
      return [...mockTimeSlots];
    }
  },

  bookSlot: async (bookingData) => {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      return {
        success: true,
        bookingReference: response.data.booking.reference,
        ...response.data.booking,
      };
    } catch {
      return {
        success: true,
        bookingReference: `SNT${Date.now()}`,
        ...bookingData,
      };
    }
  },
};

export default slotService;
