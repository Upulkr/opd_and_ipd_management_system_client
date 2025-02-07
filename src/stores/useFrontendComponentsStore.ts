import { create } from "zustand";
import { persist } from "zustand/middleware";

export type State = {
  IsNAvigateToOutPatientPage: boolean;
  showBhtInput: boolean;
  enableUpdate: boolean;
  enableAddOutPatient: null;
  IssavePredictionButonClick: boolean;
};

export type Actions = {
  setShowBhtInput: () => void;

  setEnableUpdating: (value: boolean) => void;
  navigateOutPatientPage: (value: boolean) => void;
  setIsSavePredictionButonClick: (value: boolean) => void;
};

export const useFrontendComponentsStore = create<State & Actions>()(
  persist(
    (set) => ({
      showBhtInput: false,
      enableUpdate: false,
      IsNAvigateToOutPatientPage: false,
      enableAddOutPatient: null,
      IssavePredictionButonClick: false,
      setShowBhtInput: () =>
        set((state) => ({ showBhtInput: !state.showBhtInput })),
      setEnableUpdating: (value) => set({ enableUpdate: value }),
      navigateOutPatientPage: (value) =>
        set({ IsNAvigateToOutPatientPage: value }),
      setIsSavePredictionButonClick: (value) =>
        set({ IssavePredictionButonClick: value }),
    }),

    { name: "frontend-components-store" }
  )
);
