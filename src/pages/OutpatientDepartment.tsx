import { InputNicFormForOutPatient } from "@/components/input-id-models/nic-input-for-outPatient";
import { AddOutpatientForm } from "@/components/outpatient/addOutPatientDashBoard";
import { InventoryTracker } from "@/components/outpatient/inventory-tracker";
import { IPDAdmissions } from "@/components/outpatient/ipd-Admissions";
import { PersonSearchCard } from "@/components/outpatient/person-search-chart";
import { StaffDutyCard } from "@/components/outpatient/staff-duty-card";
import Statistics from "@/components/outpatient/statisticsForOutPAtientDashboard";
import { TodaysPatients } from "@/components/outpatient/todays-patients";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { statistics } from "@/lib/mock-data";
import { useState } from "react";
function OutpatientDepartment() {
  const [showNicInput, setShowNicInput] = useState(false);

  return (
    <div className="container mx-auto p-4 relative">
      {showNicInput && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
          onClick={() => setShowNicInput(false)} // Close when clicking outside
        >
          <InputNicFormForOutPatient onClose={() => setShowNicInput(false)} />
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6">
        Outpatient Department Dashboard
      </h1>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger
            value="add-outpatient"
            onClick={() => setShowNicInput(true)}
          >
            Add Outpatient
          </TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Statistics data={statistics} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TodaysPatients />
            <IPDAdmissions />
          </div>
        </TabsContent>
        <TabsContent value="add-outpatient">
          <AddOutpatientForm />
        </TabsContent>
        <TabsContent value="prescriptions"></TabsContent>
        <TabsContent value="inventory">
          <InventoryTracker />
        </TabsContent>
        <TabsContent value="search">
          <PersonSearchCard />
        </TabsContent>
        <TabsContent value="staff">
          <StaffDutyCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default OutpatientDepartment;
