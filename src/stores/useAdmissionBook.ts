import { create } from "zustand";
import { persist } from "zustand/middleware";
interface AdmissionBook {
  bht: string;
  nic: string;
  name: string;
  phone: string;
  dailyno: number;
  yearlyno: number;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  streetAddress: string;
  age: string;
  admittedDate: Date;
  reason: string;
  allergies: string[];
  transferCategory: string;
  dischargeDate: Date;
}

interface State {
  admissionBook: AdmissionBook[];
}

interface Actions {
  setAdmissionBook: (admissionBook: AdmissionBook[]) => void;
}

export const useAdmissionBookByBHT = create<State & Actions>()(
  persist(
    (set) => ({
      admissionBook: [],
      setAdmissionBook: (admissionBook: AdmissionBook[]) =>
        set({ admissionBook }),
    }),
    {
      name: "admissionBook-by-bht",
    }
  )
);
