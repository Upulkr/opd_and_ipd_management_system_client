import { DashboardMetrics } from "@/components/drug-management/dashboard-metrics";
import { Header } from "@/components/drug-management/header";
import { MedicationsTable } from "@/components/drug-management/medications-table";
import { SearchDrugs } from "@/components/drug-management/search-drugs";
import { Button } from "@/components/ui/button";

function Pharamacy() {
  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
            <SearchDrugs />
            <Button>Add New Medication</Button>
          </div>
        </div>
        <DashboardMetrics />
        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Medication Inventory
        </h2>
        <MedicationsTable />
      </main>
    </div>
  );
}

export default Pharamacy;
