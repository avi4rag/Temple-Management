import { apiClient } from './apiClient';

const STORAGE_KEY = 'divya_setu_feedback_v1';

export const feedbackService = {
  getFeedbacks: async () => {
    try {
      const res = await apiClient.get('/feedback');
      return res.data.feedbacks;
    } catch {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore parsing error
        }
      }
      return [
        {
          id: 'FB-101',
          rating: 5,
          name: 'Suresh Trivedi',
          category: 'Sanctum Darshan',
          comment: 'Divine Mangla aarti darshan. Sanctum lines moved smoothly without hassle.',
          aspects: { queue: 5, cleanliness: 5, prasad: 4, security: 5 },
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
        {
          id: 'FB-102',
          rating: 4,
          name: 'Ananya Sharma',
          category: 'Accessibility & Ramps',
          comment: 'Very good wheelchair ramp facility for my grandmother at Gate #1. Polite trust sevaks.',
          aspects: { queue: 4, cleanliness: 5, prasad: 5, security: 4 },
          createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        },
      ];
    }
  },

  submitFeedback: async (feedbackData) => {
    try {
      const res = await apiClient.post('/feedback', feedbackData);
      return res.data.feedback;
    } catch {
      const current = await feedbackService.getFeedbacks();
      const newFeedback = {
        id: `FB-${Math.floor(100 + Math.random() * 900)}`,
        ...feedbackData,
        createdAt: new Date().toISOString(),
      };
      const updated = [newFeedback, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return newFeedback;
    }
  },
};
