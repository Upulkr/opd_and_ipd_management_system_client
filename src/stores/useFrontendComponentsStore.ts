import { create } from "zustand";
import { persist } from "zustand/middleware";

export type State = {
  showBhtInput: boolean;
  enableUpdate: boolean;
};

export type Actions = {
  setShowBhtInput: () => void;
  setEnableUpdating: (value: boolean) => void;
};

export const useFrontendComponentsStore = create<State & Actions>()(
  persist(
    (set) => ({
      showBhtInput: false,
      enableUpdate: false,
      setShowBhtInput: () =>
        set((state) => ({ showBhtInput: !state.showBhtInput })),
      setEnableUpdating: (value) => set({ enableUpdate: value }),
    }),

    { name: "frontend-components-store" }
  )
);
