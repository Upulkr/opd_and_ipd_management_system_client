import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Patient {
  id?: string;
  nic: string;
  name: string;
  gender: string;
  phone: string;
  address?: string;
  createdAt?: Date;
}

export type State = {
  patient: Patient[];
  patientNic: string;
  pattientBHT: string;
  outPatients: Patient[];
};

export type Actions = {
  setPatient: (patient: []) => void;
  setPatientBHT: (bht: string) => void;
  setPatientNic: (nic: string) => void;
  setOutPatient: (outPatient: Patient[]) => void;
};

export const usePatientStore = create<State & Actions>()(
  persist(
    (set) => ({
      patient: [],
      patientNic: "",
      pattientBHT: "",
      outPatients: [],
      setPatientNic: (nic) => set({ patientNic: nic }),
      setPatient: (patient) => set({ patient: patient }),
      setPatientBHT: (bht) => set({ pattientBHT: bht }),
      setOutPatient: (outPatient) => set({ outPatients: outPatient }),
    }),
    { name: "patient-store" }
  )
);
