import AddClinicDetails from "@/components/clinic/add-clininc-details";
import AppointmentsOverview from "@/components/clinic/appointment-overview";
import DashboardHeader from "@/components/clinic/clininc-header";
import PatientSearch from "@/components/clinic/patient-search";
import PatientStatistics from "@/components/clinic/patient-statics";
import { TodaysClinics } from "@/components/outpatient/todays-clinics";
import React from "react";

function ClinicNotifier() {
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
