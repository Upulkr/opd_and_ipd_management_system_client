import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WardData {
  wardNumber: number;
  noOfpatientsUndergoing: number;
  getnoOfTodayAdmitted: number;
  wardName: string;
  noOfDischargedToday: number;
  noOfBeds: number;
  noOfUsedBeds: number;
  noOfFreeBeds: number;
  noOfdoctors: number;
  noOfnurses: number;
  telephone: number;
};

interface State {
  wardData: WardData[];
}
interface Actions {
  setWardData: (wardData: WardData[]) => void;
}

export const useWardTableInpatient = create<State & Actions>()(
  persist(
    (set) => ({
      wardData: [],
      setWardData: (wardData:WardData[]) => set({ wardData }),
    }),
    { name: "ward-table-data" }
  )
);
