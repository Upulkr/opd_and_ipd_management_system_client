import { DashboardMetrics } from "@/components/drug-management/dashboard-metrics";
import { Header } from "@/components/drug-management/header";
import { MedicationsTable } from "@/components/drug-management/medications-table";
import { SearchDrugs } from "@/components/drug-management/search-drugs";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuth";
import { useDrugsStore } from "@/stores/useDrugsStore";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Pharamacy() {
  const { drugs, setDrugs } = useDrugsStore((state) => state);
  const [searchedDrug, setSearchedDrug] = useState([]);
  const token = useAuthStore((state) => state.token);
  const fethingAllDrugs = async () => {
    try {
      const response = await axios.get("/api/drugs", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setDrugs(response.data.drugs);
      }
    } catch (error: any) {
      console.log("Eror fetching drugs");
    }
  };

  useEffect(() => {
    fethingAllDrugs();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
            <Link to="/add-new-drug-page">
              <Button>Add New Medication</Button>
            </Link>
          </div>
        </div>
        <DashboardMetrics />
        <div className="flex space-x-4 items-baseline">
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Medication Inventory
          </h2>
          <SearchDrugs drugs={drugs} setSearchedDrug={setSearchedDrug} />
        </div>

        <MedicationsTable drugs={drugs} searchedDrug={searchedDrug} />
      </main>
    </div>
  );
}

export default Pharamacy;
