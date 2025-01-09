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
}

interface State {
  wardData: WardData[];
  noOfTotalBeds: number;
  noOfFreeBeds: number;
}
interface Actions {
  setWardData: (wardData: WardData[]) => void;
  setNoOfFreeBeds: (noOfFreeBeds: number) => void;
  setNoOfTotalBeds: (noOfTotalBeds: number) => void;
}

export const useWardTableInpatient = create<State & Actions>()(
  persist(
    (set) => ({
      wardData: [],
      noOfTotalBeds: 0,
      noOfFreeBeds: 0,
      setWardData: (wardData: WardData[]) => set({ wardData }),
      setNoOfFreeBeds: (value: number) => set({ noOfFreeBeds: value }),
      setNoOfTotalBeds: (value: number) => set({ noOfTotalBeds: value }),
    }),

    { name: "ward-table-data" }
  )
);
