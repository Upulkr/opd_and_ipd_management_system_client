import { create } from "zustand";
import { persist } from "zustand/middleware";
interface Drug {
  drugId: number;
  drugName: string;
  unit: string;
  totalQuantity: number;
  usedQuantity: number;
  remainingQuantity: number;
  expiryDate: Date;
}

interface State {
  drugs: Drug[];
}

interface Actions {
  setDrugs: (drugs: Drug[]) => void;
}

export const useDrugsStore = create<State & Actions>()(
  persist(
    (set) => ({
      drugs: [],
      setDrugs: (drugs: Drug[]) => set({ drugs: drugs }),
    }),

    { name: "drugs" }
  )
);
