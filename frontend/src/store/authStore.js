import { create } from "zustand";
import { authApi } from "../api/services";

const savedUser = localStorage.getItem("viralboost_user");
const normalizeUser = (user) => (user ? { ...user, role: user.role || "creator" } : null);

export const useAuthStore = create((set) => ({
  user: savedUser ? normalizeUser(JSON.parse(savedUser)) : null,
  loading: false,
  setUser: (user, token) => {
    const normalizedUser = normalizeUser(user);
    if (token) {
      localStorage.setItem("viralboost_token", token);
    }
    localStorage.setItem("viralboost_user", JSON.stringify(normalizedUser));
    set({ user: normalizedUser });
  },
  logout: () => {
    localStorage.removeItem("viralboost_token");
    localStorage.removeItem("viralboost_user");
    set({ user: null });
  },
  fetchMe: async () => {
    set({ loading: true });
    try {
      const { data } = await authApi.me();
      const normalizedUser = normalizeUser(data.user);
      localStorage.setItem("viralboost_user", JSON.stringify(normalizedUser));
      set({ user: normalizedUser, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));
