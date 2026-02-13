import { apiClient } from './apiClient';
import { mockAdminUsers } from '@/data/mock/admin';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      if (response && response.data && response.data.accessToken) {
        apiClient.setToken(response.data.accessToken);

        const backendUser = response.data.user;
        const normalizedUser = {
          id: backendUser._id || backendUser.id,
          full_name: backendUser.name,
          email: backendUser.email,
          role: backendUser.role,
          is_active: backendUser.isActive,
        };

        localStorage.setItem('admin_user', JSON.stringify(normalizedUser));
        return normalizedUser;
      }
    } catch (err) {
      // If server explicitly returned an error (e.g. 401 or 423 lockout), bubble it up
      if (err.status === 401 || err.status === 423 || (err.data && err.data.error)) {
        throw err;
      }
      // Otherwise fallback to mock users for static Netlify environment
    }

    // Static fallback for offline demo
    const user = mockAdminUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.is_active
    );

    if (!user) {
      throw new Error('Invalid credentials or account not found');
    }

    localStorage.setItem('admin_user', JSON.stringify(user));
    return user;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout', {});
    } catch {
      // Non-blocking logout cleanup
    } finally {
      apiClient.setToken(null);
      localStorage.removeItem('admin_user');
    }
  },

  getCurrentUser: () => {
    const stored = localStorage.getItem('admin_user');
    return stored ? JSON.parse(stored) : null;
  },
};

export default authService;
