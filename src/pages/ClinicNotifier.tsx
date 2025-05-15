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

function ClinicNotifier() {
  const { setClinics } = useClinicStore((state) => state);
  const token = useAuthStore((state) => state.token);
  const fetchSheduledClinincs = async () => {
    try {
      const response = await apiClient.get("/clinic", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setClinics(response.data.clinics);
      }
    } catch (error) {
      console.error("Error fetching clinics:", error);
    }
  };

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
