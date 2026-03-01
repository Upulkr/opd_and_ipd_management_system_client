import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Interface representing the authentication state.
 * @property token - The JWT token for the authenticated user.
 * @property role - The role of the authenticated user (e.g., 'patient', 'doctor').
 */
interface State {
  token: string | null;
  role: string | null;
}

/**
 * Interface representing the actions available to modify the authentication state.
 * @property setToken - Function to set the authentication token and user role.
 * @property resetAuth - Function to clear the authentication state (logout).
 */
interface Actions {
  setToken: (token: string, role: string) => void;
  resetAuth: () => void;
}

/**
 * Zustand store for managing authentication state.
 * It uses the 'persist' middleware to save the state to localStorage, ensuring
 * that the user remains logged in even after refreshing the page.
 */
export const useAuthStore = create<State & Actions>()(
  persist(
    (set) => ({
      // Initial state
      token: null,
      role: null,

      /**
       * Updates the store with the new token and role upon successful login.
       * @param token - The JWT token received from the backend.
       * @param role - The user's role.
       */
      setToken: (token, role) => set({ token, role }),

      /**
       * Resets the authentication state to its initial values.
       * This is typically used during logout.
       */
      resetAuth: () => set({ token: null, role: null }),
    }),
    {
      name: "auth-storage", // content of the store will be stored in localStorage 
      // under this key
    }
  )
);
