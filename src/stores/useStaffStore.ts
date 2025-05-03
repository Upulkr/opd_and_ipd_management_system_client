import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StaffCount {
  ward: string;
  noofdoctors: number;
  noofnurses: number;
  noofpharmacist: number;
}

interface State {
  staffCount: StaffCount[];
}
interface Actions {
  setStaffCount: (staffCount: StaffCount[]) => void;
}

export const useStaffStore = create<State & Actions>()(
  persist(
    (set) => ({
      staffCount: [],
      setStaffCount: (staffCount: StaffCount[]) => set({ staffCount }),
    }),
    { name: "staff-count" }
  )
);
