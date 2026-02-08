import { mockAdminUsers } from "@/data/mock/admin";

export const authService = {
  login: async (email, password) => {
    const user = mockAdminUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.is_active,
    );
    if (!user) {
      throw new Error("Invalid credentials or account not found");
    }
    return Promise.resolve(user);
  },
  logout: async () => {
    localStorage.removeItem("admin_user");
    return Promise.resolve();
  },
  getCurrentUser: () => {
    const stored = localStorage.getItem("admin_user");
    return stored ? JSON.parse(stored) : null;
  },
};
