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
  patientNic: string;
};

export type Actions = {
  setPatient: (patient: []) => void;
  setPatientNic: (nic: string) => void;
};

export const usePatientStore = create<State & Actions>()(
  persist(
    (set) => ({
      patient: [],
      patientNic: "",
      setPatientNic: (nic) => set({ patientNic: nic }),
      setPatient: (patient) => set({ patient: patient }),
    }),
    { name: "patient-store" }
  )
);
