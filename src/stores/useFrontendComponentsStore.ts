import { create } from "zustand";
import { persist } from "zustand/middleware";

export type State = {
  showBhtInput: boolean;
  enableUpdate: null | boolean;
};

export type Actions = {
  setShowBhtInput: () => void;
  setEnableUpdating: () => void;
};

export const useFrontendComponentsStore = create<State & Actions>()(
  persist(
    (set) => ({
      showBhtInput: false,
      enableUpdate: null,
      setShowBhtInput: () =>
        set((state) => ({ showBhtInput: !state.showBhtInput })),
      setEnableUpdating: () =>
        set((state) => ({ enableUpdate: !state.enableUpdate })),
    }),

    { name: "frontend-components-store" }
  )
);
