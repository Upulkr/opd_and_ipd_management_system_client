import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdmissionSheet {
  bht: string;
  nic: string;
  name: string;
  age: number;
  gender: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  phone: string;
  wardNo: string;
  reason: string;
  pressure: string;
  weight: string;
  address: string;
}

interface State {
  admissionSheetByBHT: AdmissionSheet[];
}

interface Actions {
  setAdmissionSheetByBHT: (admissionSheet: AdmissionSheet[]) => void;
}

export const useAdmissionSheetByBHT = create<State & Actions>()(
  persist(
    (set) => ({
      admissionSheetByBHT: [],
      setAdmissionSheetByBHT: (admissionSheet) =>
        set({ admissionSheetByBHT: admissionSheet }),
    }),
    { name: "admission-sheet-by-bht" }
  )
);
