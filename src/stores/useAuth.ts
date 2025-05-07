import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  token: string | null;
  role: string | null;
}

interface Actions {
  setToken: (token: string, role: string) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<State & Actions>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      setToken: (token, role) => set({ token, role }),
      resetAuth: () => set({ token: null, role: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
