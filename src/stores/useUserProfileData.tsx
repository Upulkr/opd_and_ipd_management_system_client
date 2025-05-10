import { create } from "zustand";
import { persist } from "zustand/middleware";
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface State {
  user: User | null;
}

interface Actions {
  setUserProfileData: (user: User) => void;
}

export const useUserProfileData = create<State & Actions>()(
  persist(
    (set) => ({
      user: null,
      setUserProfileData: (user: User) => set({ user }),
    }),
    {
      name: "userProfileData",
    }
  )
);
