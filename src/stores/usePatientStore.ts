import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Patient {
  nic: string;
  name: string;
  gender: string;
  phone: string;
  address: string;
}

export type State = {
  patient: Patient[];
};

export type Actions = {
  setPatient: (patient: []) => void;
};

export const usePatientStore = create<State & Actions>()(
  persist(
    (set) => ({
      patient: [],
      setPatient: (patient) => set({ patient: patient }),
    }),
    { name: "patient-store" }
  )
);
