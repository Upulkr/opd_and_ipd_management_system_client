import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Clinic {
  id: number;
  name: string;
  doctorName: string;
  location: string;
  sheduledAt: Date;
}

interface State {
  clinics: Clinic[];
}

interface Actions {
  setClinics: (clinics: Clinic[]) => void;
}

export const useClinicStore = create<State & Actions>()(
  persist(
    (set) => ({
      clinics: [],
      setClinics: (clinics) => set({ clinics }),
    }),
    {
      name: "clinic-store",
    }
  )
);
