import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashBoard from "./pages/DashBoard";

import SearchPatient from "./pages/SearchPatient";
import OutpatientDepartment from "./pages/OutpatientDepartment";
import InpatientDepartment from "./pages/InpatientDepartment";
import EmergencyDepartment from "./pages/IntensiceCareUnit";
import DiseasePrediction from "./pages/DiseasePrediction";
import Employee from "./pages/Employee";
import DrugQuantity from "./pages/DrugQuantity";
import Wards from "./pages/Wards";

import SidebarComponent from "./components/SideBar/SidebarComponent";
import {
  ArrowLeftToLine,
  ArrowRightFromLine,
  BellRing,
  BrainCircuit,
  LayoutDashboard,
  Pill,
  Search,
  SquareActivity,
  Users,
} from "lucide-react";
import { SidebarProvider } from "./components/ui/sidebar";
import ClinicNotifier from "./pages/ClinicNotifier";
import IntensiveCareUnit from "./pages/IntensiceCareUnit";

function App() {
  const Departments = [
    {
      id: 1,
      name: "Dashboard",
      url: "/",
      icon: <LayoutDashboard />,
    },
    {
      id: 2,
      name: "Search Patient",
      url: "/search-patient",
      icon: <Search />,
    },
    {
      id: 3,
      name: "Out-patient Department",
      url: "/outpatient-department",
      icon: <ArrowLeftToLine />,
    },
    {
      id: 4,
      name: "In-patient Department",
      url: "/inpatient-department",
      icon: <ArrowRightFromLine />,
    },
    {
      id: 5,
      name: "Intensive Care Unit",
      url: "/icu",
      icon: <SquareActivity />,
    },
    {
      id: 6,
      name: "Current Wards Details",
      url: "/current-ward-details",
      icon: <LayoutDashboard />,
    },
    {
      id: 10,
      name: "Clinic Notifier",
      url: "/clinic-notifier",
      icon: <BellRing />,
    },

    {
      id: 7,
      name: "Current Drugs Quantity",
      url: "/drugs-quantity",
      icon: <Pill />,
    },

    {
      id: 8,
      name: "Current Employees",
      url: "/employee",
      icon: <Users />,
    },
    {
      id: 9,
      name: "Disease Prediction",
      url: "/disease-prediction",
      icon: <BrainCircuit />,
    },
  ];

  return (
    <BrowserRouter>
      <SidebarProvider>
        <SidebarComponent Departments={Departments} />

        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/search-patient" element={<SearchPatient />} />
          <Route
            path="/outpatient-department"
            element={<OutpatientDepartment />}
          />
          <Route
            path="/inpatient-department"
            element={<InpatientDepartment />}
          />
          <Route path="/icu" element={<IntensiveCareUnit />} />
          <Route path="/clinic-notifier" element={<ClinicNotifier />} />

          <Route path="/drugs-quantity" element={<DrugQuantity />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/ward-details" element={<Wards />} />
          <Route path="/disease-prediction" element={<DiseasePrediction />} />
          <Route path="/current-ward-details" element={<Wards />} />
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
