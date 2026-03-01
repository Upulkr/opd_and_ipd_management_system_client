import AddClinicDetails from "@/components/clinic/add-clininc-details";
import AppointmentsOverview from "@/components/clinic/appointment-overview";
import DashboardHeader from "@/components/clinic/clininc-header";
import PatientSearch from "@/components/clinic/patient-search";
import PatientStatistics from "@/components/clinic/patient-statics";
import TodaysClinics from "@/components/clinic/todays-clininc";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/stores/useAuth";
import { useClinicStore } from "@/stores/useClinicStore";
import { useEffect } from "react";

/**
 * ClinicNotifier Component
 *
 * This component acts as a dashboard for clinic-related notifications and management.
 * It aggregates various sub-components to display patient statistics, appointment overviews,
 * and tools for adding new clinic details.
 */
function ClinicNotifier() {
  const { setClinics } = useClinicStore((state) => state); // Access clinic store actions
  const token = useAuthStore((state) => state.token); // Access auth token
  // Fetch scheduled clinics from the backend
  const fetchSheduledClinincs = async () => {
    try {
      const response = await apiClient.get("/clinic", {
        headers: {
          Authorization: `Bearer ${token}`, // Include auth token in headers
        },
      });
      // If request is successful, update the global clinic store
      if (response.status === 200) {
        setClinics(response.data.clinics);
      }
    } catch (error) {
      console.error("Error fetching clinics:", error);
    }
  };

  // useEffect to fetch clinics on component mount
  useEffect(() => {
    fetchSheduledClinincs();
  }, []);
  return (
    <div className="container mx-auto p-4">
      <DashboardHeader />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PatientSearch />
        <AddClinicDetails />
        <PatientStatistics />
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <AppointmentsOverview />
        <TodaysClinics />
      </div>
    </div>
  );
}

export default ClinicNotifier;
