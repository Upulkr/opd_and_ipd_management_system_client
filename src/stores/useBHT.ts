import { create } from "zustand";
import { persist } from "zustand/middleware";
interface state {
  bht: string;
}

interface Actions {
  setBht: (bht: string) => void;
}

export const useBhtStore = create<state & Actions>()(
  persist(
    (set) => ({
      bht: "",
      setBht: (bht: string) => set({ bht }),
    }),
    { name: "bht" }
  )
);
