import { User } from "@/types/User";
import { create } from "zustand";

type AuthStore = {
  user: User | null;
  loading: boolean;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;

  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  fetchUser: async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      console.log("Logged in user: ", data.user);

      set({
        user: data.user,
        loading: false,
      });
    } catch (err) {
      set({
        user: null,
        loading: false,
      });
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      set({
        user: null,
        loading: false,
      });
    }
  },
}));
