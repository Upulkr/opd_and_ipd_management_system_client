import { DashboardMetrics } from "@/components/drug-management/dashboard-metrics";
import { Header } from "@/components/drug-management/header";
import { MedicationsTable } from "@/components/drug-management/medications-table";
import { SearchDrugs } from "@/components/drug-management/search-drugs";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/stores/useAuth";
import { useDrugsStore } from "@/stores/useDrugsStore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// --------------------------------------------------------------------------
// MODULE: Pharmacy Dashboard
// PURPOSE: Central hub for managing medication inventory.
//          Provides features to view, search, add, and monitor drug stocks.
// --------------------------------------------------------------------------

// Define or import the Drug type
export interface Drug {
  drugId: number;
  drugName: string;
  unit: string;
  totalQuantity: number;
  usedQuantity: number;
  remainingQuantity: number;
  expiryDate: Date;
}

function Pharamacy() {
  // Global state management using Zustand
  // We extract 'drugs' data and the 'setDrugs' action from our dedicated drugs store
  // This allows the inventory data to be consistent across different components if needed
  const { setDrugs, drugs } = useDrugsStore((state) => state);

  // Local state for handling client-side filtering
  // 'searchedDrug' holds the subset of drugs that match the user's search query
  const [searchedDrug, setSearchedDrug] = useState<Drug[]>([]);

  // Retrieve the JWT token from the authentication store
  // This is required to make authenticated requests to our protected API endpoints
  const token = useAuthStore((state) => state.token);

  /**
   * Asynchronous function to fetch the complete drug inventory from the backend.
   * This implements the Read operation of the CRUD cycle.
   */
  const fethingAllDrugs = async () => {
    try {
      // Make a GET request to the /drugs endpoint
      // We explicitly attach the Authorization header with the Bearer token
      const response = await apiClient.get("/drugs", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Validating the response status code before updating the state
      // HTTP 200 OK indicates the request was processed successfully
      if (response.status === 200) {
        // Update the global store with the fetched data
        setDrugs(response.data.drugs);
      }
    } catch (error: any) {
      // Basic error handling to catch network or server errors
      console.log("Error fetching drugs");
    }
  };

  // 'useEffect' hook with an empty dependency array []
  // This ensures the effect runs only once when the component initially mounts (renders)
  // Similar to 'componentDidMount' in class-based components
  useEffect(() => {
    fethingAllDrugs();
  }, []);

  return (
    // Main container with full viewport height and light gray background
    <div className="min-h-screen bg-gray-100 w-full">
      {/* Reusable Header component for consistent navigation/branding */}
      <Header />

      {/* Content wrapper centered horizontally with responsive padding */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Title and Actions Area */}
        {/* Uses flexbox for responsive layout: stacks vertically on mobile, row on desktop */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
            {/* Navigation link to the 'Add New Drug' form */}
            <Link to="/add-new-drug-page">
              <Button>Add New Medication</Button>
            </Link>
          </div>
        </div>

        {/* Analytics Cards Component: functional programming style - passing data as props */}
        <DashboardMetrics drugs={drugs} />

        {/* Search and Filter Section */}
        <div className="flex space-x-4 items-baseline">
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Medication Inventory
          </h2>
          {/* Search component receives the full dataset and the setter for the filtered result */}
          {/* This implements the "Inverse Data Flow" pattern where child updates parent state */}
          <SearchDrugs drugs={drugs} setSearchedDrug={setSearchedDrug} />
        </div>

        {/* Data Table Component: Displays the actual list of drugs */}
        {/* Conditionally renders either the search results or the full list based on logic inside the component */}
        <MedicationsTable drugs={drugs} searchedDrug={searchedDrug} />
      </main>
    </div>
  );
}

export default Pharamacy;
