import { create } from "zustand";

interface User {
  id: string;
  fullName: string;
  email: string;
  location?: string;
  cropTypes?: string[];
  avatarUrl?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fw_token", token);
      localStorage.setItem("fw_user", JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("fw_token");
      localStorage.removeItem("fw_user");
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
  updateUser: (user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fw_user", JSON.stringify(user));
    }
    set({ user });
  },
  hydrate: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("fw_token");
      const userStr = localStorage.getItem("fw_user");
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isAuthenticated: true });
        } catch {
          set({ user: null, token: null, isAuthenticated: false });
        }
      }
    }
  },
}));
