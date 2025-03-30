import { create } from "zustand";
import { persist } from "zustand/middleware";

interface state {
  token: string | null;
}

interface actions {
  setToken: (token: string | null) => void;
  resetToken: () => void;
}

export const useAuthStore = create<state & actions>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token: token }),
      resetToken: () => set({ token: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
