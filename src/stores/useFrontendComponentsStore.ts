import { create } from "zustand";
import { persist } from "zustand/middleware";

export type State = {
  showBhtInput: boolean;
  enableUpdate: boolean;
  enableAddOutPatient: boolean;
  IsNAvigateToOutPatientPage: boolean;
};

export type Actions = {
  setShowBhtInput: () => void;

  setEnableUpdating: (value: boolean) => void;
  navigateOutPatientPage: (value: boolean) => void;
  setEnableAddOutPatient: (value: boolean) => void;
};

export const useFrontendComponentsStore = create<State & Actions>()(
  persist(
    (set) => ({
      showBhtInput: false,
      enableUpdate: false,
      IsNAvigateToOutPatientPage: false,
      enableAddOutPatient: false,
      setShowBhtInput: () =>
        set((state) => ({ showBhtInput: !state.showBhtInput })),
      setEnableUpdating: (value) => set({ enableUpdate: value }),
      navigateOutPatientPage: (value) =>
        set({ IsNAvigateToOutPatientPage: value }),
      setEnableAddOutPatient: (value) => set({ enableAddOutPatient: value }),
    }),

    { name: "frontend-components-store" }
  )
);
