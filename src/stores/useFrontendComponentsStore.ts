import { create } from "zustand";
import { persist } from "zustand/middleware";

export type State = {
  showBhtInput: boolean;
};

export type Actions = {
  setShowBhtInput: () => void;
};

export const useFrontendComponentsStore = create<State & Actions>()(
  persist(
    (set) => ({
      showBhtInput: false,
      setShowBhtInput: () =>
        set((state) => ({ showBhtInput: !state.showBhtInput })),
    }),
    { name: "frontend-components-store" }
  )
);
