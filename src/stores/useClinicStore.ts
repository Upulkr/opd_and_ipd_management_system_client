import { create } from "zustand";
import { persist } from "zustand/middleware";
interface clininc {
  id: number;
  name: string;
  doctorName: string;
  location: string;
  sheduledAt: Date;
}

interface State {
  clinincs: clininc[];
}

interface Actions {
  setClinics: (clinincs: clininc[]) => void;
}

export const useClinincStore = create<State & Actions>()(
  persist(
    (set) => ({
      clinincs: [],
      setClinics: (clinincs) => set({ clinincs }),
    }),
    {
      name: "clininc-store",
    }
  )
);
