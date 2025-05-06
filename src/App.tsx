import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashBoard from "./pages/DashBoard";

import DiseasePrediction from "./pages/DiseasePrediction";
import Employee from "./pages/Employee";
import InpatientDepartment from "./pages/InpatientDepartment";
import OutpatientDepartment from "./pages/OutpatientDepartment";
import Wards, { SurgeriesList } from "./pages/SurgeriesList";

import {
  Ambulance,
  ArrowLeftToLine,
  ArrowRightFromLine,
  BrainCircuit,
  HeartPulseIcon,
  LayoutDashboard,
  Pill,
  SquareActivity,
  Users,
} from "lucide-react";
import SidebarComponent from "./components/SideBar/SidebarComponent";
import { SidebarProvider } from "./components/ui/sidebar";
import AddClininicFormpage from "./pages/AddClininicFormpage";
import { AddNewDrugFormpage } from "./pages/AddNewDrugFormpage";
import AddOutPatientForm from "./pages/AddOutPatientFormPage";
import AdmissionBookPage from "./pages/AdmiisionBookPage";
import AdmissionSheet from "./pages/AdmissionSheet";
import AdmissionSheetRegisterPage from "./pages/AdmissionSheetRegisterPage";
import ClinicNotifier from "./pages/ClinicNotifier";
import ClinincAssignPAge from "./pages/ClinincAssignPAge";
import DrugsAllocatingToWardPAge from "./pages/DrugsAllocatingToWardPAge";
import IndividuslOutPatientForms from "./pages/IndividuslOutPatientForms";
import IntensiveCareUnit from "./pages/IntensiceCareUnit";
import LogIn from "./pages/LogIn";
import MobileClinic from "./pages/MobileClinic";
import PatientProfilePage from "./pages/PatientProfilePage";
import PatientRegister from "./pages/PatientRegister";
import Pharamacy from "./pages/Pharamacy";
import Signup from "./pages/SignUp";
import ViewInMapPage from "./pages/ViewInMapPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import Header from "./components/Header/Header";
import UserProfile from "./pages/UserProfile";
import SheduledSurgeryForm from "./pages/SheduledSurgeryForm";
import PatientReports from "./pages/PatientReports";

function App() {
  const Departments = [
    {
      id: 1,
      name: "Dashboard",
      url: "/",
      icon: <LayoutDashboard />,
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
      name: "Surgeries List",
      url: "/surgeries",
      icon: <LayoutDashboard />,
    },
    {
      id: 10,
      name: "Clinic",
      url: "/clinic",
      icon: <HeartPulseIcon />,
    },

    {
      id: 7,
      name: "Pharmacy Unit",
      url: "/pharmacy",
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
    {
      id: 2,
      name: "Mobile Clinic",
      url: "/mobile-clinic",
      icon: <Ambulance />,
    },
  ];

  return (
    <BrowserRouter>
      <SidebarProvider>
        {/* <Header /> */}
        <SidebarComponent Departments={Departments} />

        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/mobile-clinic" element={<MobileClinic />} />
          <Route
            path="/outpatient-department"
            element={<OutpatientDepartment />}
          />
          <Route
            path="/inpatient-department"
            element={<InpatientDepartment />}
          />
          <Route path="/sheduled-surgery" element={<SheduledSurgeryForm />} />
          <Route path="/view-surgery/:id" element={<SheduledSurgeryForm />} />
          <Route path="/icu" element={<IntensiveCareUnit />} />
          <Route path="/clinic" element={<ClinicNotifier />} />
          <Route path="/pharmacy" element={<Pharamacy />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/ward-details" element={<Wards />} />
          <Route path="/disease-prediction" element={<DiseasePrediction />} />
          <Route path="/surgeries" element={<SurgeriesList />} />
          <Route
            path="/inpatient-department/admission-sheet"
            element={<AdmissionSheet />}
          />
          <Route path="/patient-register-form" element={<PatientRegister />} />
          <Route
            path="/admission-sheet-register-page"
            element={<AdmissionSheetRegisterPage />}
          />
          <Route
            path="/admission-book-page/:bht?"
            element={<AdmissionBookPage />}
          />
          <Route
            path="/patient-profile-page/:nic?"
            element={<PatientProfilePage />}
          />
          <Route
            path="/admission-outpatient-register-page/:id?/:view?/:outPatientdescription?"
            element={<AddOutPatientForm />}
          />
          <Route
            path="/individual-outpatientViewForms-page/:id?"
            element={<IndividuslOutPatientForms />}
          />
          <Route
            path="/add-new-drug-page/:drugId?"
            element={<AddNewDrugFormpage />}
          />
          <Route
            path="/patient-profile/:doctype?/:nic?"
            element={<PatientReports />}
          />
          <Route
            path="/drug-allocating-to-wards"
            element={<DrugsAllocatingToWardPAge />}
          />
          <Route path="/create-new-clinic" element={<AddClininicFormpage />} />
          <Route path="/clinic-assign" element={<ClinincAssignPAge />} />
          <Route path="/view-in-map/:location?" element={<ViewInMapPage />} />
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route
            path={`/auth/verify-email/:token`}
            element={<EmailVerificationPage />}
          />{" "}
          <Route path="/user-profile" element={<UserProfile />} />
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
