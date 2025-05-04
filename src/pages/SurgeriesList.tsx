import { DashboardStats } from "@/components/surgery-list/dashboard-stats";
import { SurgeryTable } from "@/components/surgery-list/surgery-table";
import { useAuthStore } from "@/stores/useAuth";
import axios from "axios";
import { Suspense, useEffect, useState } from "react";

export const SurgeriesList = () => {
  const token = useAuthStore((state) => state.token);
  const [surgeries, setSurgeries] = useState([]);
  const getSurgeries = async () => {
    try {
      const response = await axios.get("/api/surgery/getallsurgeryschedule", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data.length > 0) {
        setSurgeries(response.data);
      } else {
        console.log("No surgeries found.");
      }
    } catch (error) {
      console.error("Error fetching surgeries:", error);
    }
  };
  useEffect(() => {
    getSurgeries();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-2">
      <h1 className="text-3xl font-bold mb-6">Surgeries List</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardStats surgeries={surgeries} />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <SurgeryTable surgeries={surgeries} />
      </Suspense>
    </div>
  );
};

export default SurgeriesList;
