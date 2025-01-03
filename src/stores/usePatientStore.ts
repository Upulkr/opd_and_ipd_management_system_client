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
  pattientBHT: string;
};

export type Actions = {
  setPatient: (patient: []) => void;
  setPatientBHT: (bht: string) => void;
  setPatientNic: (nic: string) => void;
};

export const usePatientStore = create<State & Actions>()(
  persist(
    (set) => ({
      patient: [],
      patientNic: "",
      pattientBHT: "",
      setPatientNic: (nic) => set({ patientNic: nic }),
      setPatient: (patient) => set({ patient: patient }),
      setPatientBHT: (bht) => set({ pattientBHT: bht }),
    }),
    { name: "patient-store" }
  )
);
