import { DashboardStats } from "@/components/surgery-list/dashboard-stats";
import { SurgeryTable } from "@/components/surgery-list/surgery-table";
import { dashboardStats, surgeries } from "@/lib/mock-data";
import { Suspense } from "react";

export const SurgeriesList = () => {
  return (
    <div className="container mx-auto p-4 space-y-2">
      <h1 className="text-3xl font-bold mb-6">Surgeries List</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardStats stats={dashboardStats} />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <SurgeryTable surgeries={surgeries} />
      </Suspense>
    </div>
  );
};

export default SurgeriesList;
