import {
  Ambulance,
  ArrowLeftToLine,
  ArrowRightFromLine,
  BrainCircuit,
  HeartPulseIcon,
  LayoutDashboard,
  Pill,
  Users,
} from "lucide-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoleProtectedRoute from "./components/RouteGuards/RoleProtectedRoute";
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
import DashBoard from "./pages/DashBoard";
import DiseasePrediction from "./pages/DiseasePrediction";
import DrugsAllocatingToWardPAge from "./pages/DrugsAllocatingToWardPAge";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import Employee from "./pages/Employee";
import IndividuslOutPatientForms from "./pages/IndividuslOutPatientForms";
import InpatientDepartment from "./pages/InpatientDepartment";
import LogIn from "./pages/LogIn";
import MobileClinic from "./pages/MobileClinic";
import OutpatientDepartment from "./pages/OutpatientDepartment";
import PatientProfilePage from "./pages/PatientProfilePage";
import PatientRegister from "./pages/PatientRegister";
import PatientReports from "./pages/PatientReports";
import Pharamacy from "./pages/Pharamacy";
import SheduledSurgeryForm from "./pages/SheduledSurgeryForm";
import Signup from "./pages/SignUp";
import Wards, { SurgeriesList } from "./pages/SurgeriesList";
import UserProfile from "./pages/UserProfile";
import ViewInMapPage from "./pages/ViewInMapPage";
import { useAuthStore } from "./stores/useAuth";
import Header from "./components/Header/Header";

function App() {
  const role = useAuthStore((state) => state.role);

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
    // {
    //   id: 5,
    //   name: "Intensive Care Unit",
    //   url: "/icu",
    //   icon: <SquareActivity />,
    // },
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

  const filteredDepartments = Departments.filter((dept) => {
    if (role === "PHARMACIST") return ["/pharmacy"].includes(dept.url);
    if (role === "PATIENT") return dept.url === "/";
    return true;
  });

  return (
    <BrowserRouter>
      {" "}
      <div className="mb-20">
        <Header />
      </div>
      <SidebarProvider>
        <SidebarComponent Departments={filteredDepartments} />
        <Routes>
          {/* Common route for all roles */}
          <Route path="/" element={<RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN", "PHARMACIST", "PATIENT"]}><DashBoard /></RoleProtectedRoute>} />
          {/* Public Routes */}
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route
            path={`/auth/verify-email/:token`}
            element={<EmailVerificationPage />}
          />

          {/* Patient-only route */}
          <Route
            path="/user-profile"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <UserProfile />
              </RoleProtectedRoute>
            }
          />

          {/* Pharmacist-only route */}
          <Route
            path="/pharmacy"
            element={
              <RoleProtectedRoute allowedRoles={["PHARMACIST", "ADMIN", "DOCTOR","NURSE"]}>
                <Pharamacy />
              </RoleProtectedRoute>
            }
          />

          {/* Doctor and Nurse access only */}
          <Route
            path="/mobile-clinic"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <MobileClinic />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/outpatient-department"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <OutpatientDepartment />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/inpatient-department"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <InpatientDepartment />
              </RoleProtectedRoute>
            }
          />
          {/* <Route
            path="/icu"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <IntensiveCareUnit />
              </RoleProtectedRoute>
            }
          /> */}
          <Route
            path="/clinic"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <ClinicNotifier />
              </RoleProtectedRoute>
            }
          />

          {/* More Role-based Routes */}
          <Route
            path="/employee"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <Employee />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/ward-details"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <Wards />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/disease-prediction"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <DiseasePrediction />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/surgeries"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <SurgeriesList />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/sheduled-surgery"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <SheduledSurgeryForm />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/view-surgery/:id"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <SheduledSurgeryForm />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/inpatient-department/admission-sheet"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <AdmissionSheet />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/patient-register-form"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <PatientRegister />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admission-sheet-register-page/:bht?/:view?/:nic?"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <AdmissionSheetRegisterPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admission-book-page/:bht?/:view?"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <AdmissionBookPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/patient-profile-page/:nic?"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <PatientProfilePage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admission-outpatient-register-page/:id?/:view?/:outPatientdescription?"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <AddOutPatientForm />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/individual-outpatientViewForms-page/:id?"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <IndividuslOutPatientForms />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/add-new-drug-page/:drugId?"
            element={
              <RoleProtectedRoute
                allowedRoles={["DOCTOR", "NURSE", "ADMIN", "PHARMACIST"]}
              >
                <AddNewDrugFormpage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/patient-profile/:doctype?/:nic?"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <PatientReports />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/drug-allocating-to-wards"
            element={
              <RoleProtectedRoute
                allowedRoles={["DOCTOR", "NURSE", "ADMIN", "PHARMACIST"]}
              >
                <DrugsAllocatingToWardPAge />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/create-new-clinic"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <AddClininicFormpage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/clinic-assign"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <ClinincAssignPAge />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/view-in-map/:location?"
            element={
              <RoleProtectedRoute allowedRoles={["DOCTOR", "NURSE", "ADMIN"]}>
                <ViewInMapPage />
              </RoleProtectedRoute>
            }
          />
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
