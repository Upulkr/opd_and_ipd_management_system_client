import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/stores/useAuth";

import { FileText, Pill, Skull } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FileUploadPopup from "./fileUpload";
import { toast, ToastContainer } from "react-toastify";
import apiClient from "@/lib/apiClient";

// const currentPatientData = {
//   name: "John Doe",
//   age: 45,
//   gender: "Male",
//   bloodType: "A+",
//   contactNumber: "+1 (555) 123-4567",
//   emergencyContact: "Jane Doe: +1 (555) 987-6543",
// };
interface genralData {
  date?: Date;
  bht?: number;
  admissionSheetId?: number;
  admissionBookId?: number;
}

const reportsAndDocuments = [
  {
    name: "Blood Test Results",
    type: "blood-test",
    date: "2023-09-15",
    redirect: `blood-tests`,
  },
  {
    name: "X-Ray Image",
    type: "x-ray",
    date: "2023-09-16",
    redirect: `x-ray`,
  },
  {
    name: "Doctor's Notes",
    type: "doctor-notes",
    date: "2023-09-17",
    redirect: `doctor-notes`,
  },
  {
    name: "MRI Scan",
    type: "mri-scan",
    date: "2023-09-18",
    redirect: `mri`,
  },
  {
    name: "Prescription",
    type: "prescription",
    date: "2023-09-19",
    redirect: `prescription`,
  },
  {
    name: "others",
    type: "other",
    date: "2023-09-19",
    redirect: `others`,
  },
];

type CurrentPatient = {
  nic: string;
  name: string;
  age: string;
  gender: string;
  livingStatus: string;
  phone: string;

  reason?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  streetAddress: string;
};
// --------------------------------------------------------------------------
// MODULE: CurrentPatientProfile
// PURPOSE: This component acts as the main profile view for a specific patient.
//          It fetches and displays personal information, medical reports, and
//          admission history.
// AUTHOR: [Student Name]
// DATE: [Current Date]
// --------------------------------------------------------------------------
export default function CurrentPatientProfile() {
  // HOOKS INITIALIZATION
  // 'useNavigate': Used to programmatic navigation (e.g., redirecting to login).
  // 'useState': Manages local component state.
  // 'useAuthStore': Accesses the global authentication state (Zustand).
  // 'useParams': Retrieves dynamic parameters from the URL (specifically 'nic').
  const navigate = useNavigate();

  // STATE: currentPatient
  // Stores the detailed information of the patient fetched from the backend.
  // Initialized to null to indicate data is being loaded or not found.
  const [currentPatient, setCurrentPatient] = useState<CurrentPatient | null>(
    null,
  );

  // STATE: admissionData
  // Stores a list of admission history records for the patient.
  // Initialized as an empty array.
  const [admissionData, setAdmissionData] = useState<genralData[]>([]);

  // GLOBAL STATE: Token
  // We need the JWT token to authenticate our API requests.
  const token = useAuthStore((state) => state.token);

  // URL PARAMETER: nic
  // The National Identity Card number is extracted from the route path to identify the patient.
  const { nic } = useParams<{ nic: string }>();
  // --------------------------------------------------------------------------
  // FUNCTION: fetchCurrentPatient
  // PURPOSE: Asynchronously fetches patient details from the backend API using the NIC.
  // COMPLEXITY: O(1) - Network bound.
  // --------------------------------------------------------------------------
  const fetchCurrentPatient = async () => {
    try {
      // API Call: HTTP GET request to retrieve patient data.
      // We pass the Authorization header with the Bearer token.
      const response = await apiClient.get(`/patient/${nic}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Response Handling:
      // If status is 200 (OK) and data exists, update the state.
      if (response.status === 200 && response.data.Patient) {
        setCurrentPatient(response.data.Patient);
      } else {
        console.warn("No patient data found");
      }
    } catch (error) {
      // Error Handling: Log any errors that occur during the fetch.
      console.error("Error fetching currentPatient data:", error);
    }
  };

  // --------------------------------------------------------------------------
  // FUNCTION: getAdmiitedDetails
  // PURPOSE: Fetches the admission history for the patient.
  //          This includes details like BHT (Bed Head Ticket), dates, and IDs.
  // --------------------------------------------------------------------------
  const getAdmiitedDetails = async () => {
    try {
      // API Call: Fetch general admission details.
      const reponse = await apiClient.get(
        `/generaladmission/generaldetails/${nic}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Data Processing:
      // If successful, update the admissionData state.
      // We default to an empty array [] if 'combinedAdmissionData' is undefined to prevent crashes.
      if (reponse.status === 200) {
        setAdmissionData(reponse.data.combinedAdmissionData || []);
      }
    } catch (error: any) {
      // Error Handling:
      // Specifically check for 401 Unauthorized errors.
      // If the user's session is invalid, redirect them to the login page.
      if (error.status === 401) {
        toast.error("Pleas Log first");
        navigate("/log-in");
      }
      console.log(error);
    }
  };
  // --------------------------------------------------------------------------
  // EFFECT: Initial Data Load
  // PURPOSE: Trigger data fetching when the component mounts or when dependencies change.
  // DEPENDENCIES: [nic, token] - Re-run if the patient NIC or auth token changes.
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (nic) {
      fetchCurrentPatient();
      getAdmiitedDetails();
    }
  }, [nic, token]);

  // --------------------------------------------------------------------------
  // RENDER: Component JSX
  // PURPOSE: Displays the patient's profile information.
  // STRUCTURE:
  //  - Container div with padding and background.
  //  - ToastContainer for notifications.
  //  - Conditional Rendering:
  //      - IF 'currentPatient' data exists:
  //          - Card 1: Personal Information (Avatar, Name, Address, Contact).
  //          - Card 2: Reports and Documents (Grid of available reports).
  //          - Card 3: Admission History (Table showing past admissions).
  //      - ELSE:
  //          - Display a "No data available" message.
  // --------------------------------------------------------------------------
  return (
    <div className="container mx-auto p-6 space-y-8 bg-gray-50">
      <ToastContainer />
      <h1 className="text-4xl font-bold text-gray-800">
        Current Patient Profile
      </h1>

      {/* Conditional Block: Show profile only if data is loaded */}
      {currentPatient ? (
        <>
          <>
            {/* SECTION: Personal Information */}
            <Card className="bg-white shadow-md rounded-lg">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentPatient && (
                  <div
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-8"
                    key={currentPatient.nic}
                  >
                    {/* SUB-SECTION: Avatar & Badge */}
                    <div className="flex flex-col items-center space-y-3">
                      <Avatar className="w-32 h-32 shadow-lg mt-2">
                        <AvatarImage
                          src="https://static.vecteezy.com/system/resources/thumbnails/001/840/612/small_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg"
                          alt={currentPatient.name}
                        />
                        <AvatarFallback className="bg-gray-200 text-gray-700">
                          {currentPatient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <Badge variant="secondary" className="px-3 py-1">
                        {/* {currentPatient.bloodType} */}
                      </Badge>
                    </div>

                    {/* SUB-SECTION: Text Details (Name, Contact, Address) */}
                    <div className="flex-1 grid md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-sm">
                      {/* Personal Details Column */}
                      <div className="space-y-3">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {currentPatient.name}
                        </h2>
                        <p className="text-gray-700">
                          <span className="font-medium">NIC:</span>{" "}
                          {currentPatient.nic}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Age:</span>{" "}
                          {currentPatient.age}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Gender:</span>{" "}
                          {currentPatient.gender}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Blood Group:</span>{" "}
                          {/* {currentPatient.bloddgroup} */}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Contact:</span>{" "}
                          {currentPatient.phone}
                        </p>
                      </div>

                      {/* Address Details Column */}
                      <div className="space-y-3">
                        <p className="text-gray-700">
                          <span className="font-medium">Street Address:</span>{" "}
                          {currentPatient.streetAddress || "N/A"}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">City:</span>{" "}
                          {currentPatient.city || "N/A"}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Country:</span>{" "}
                          {currentPatient.country || "N/A"}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Province:</span>{" "}
                          {currentPatient.stateProvince || "N/A"}
                        </p>{" "}
                        <p className="text-gray-700">
                          <span className="font-medium">
                            Emergency Contact:
                          </span>{" "}
                          {currentPatient.phone || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SECTION: Reports and Documents */}
            <Card className="bg-white shadow-md rounded-lg">
              <div className="flex items-center justify-items-center p-4 border-b border-gray-200">
                <CardHeader className="border-b border-gray-200 ">
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    Reports and Documents
                  </CardTitle>
                </CardHeader>
                {/* File Upload Component Injection */}
                <FileUploadPopup patientNic={nic} />
              </div>

              <CardContent>
                {/* Grid Layout for Document Links */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {reportsAndDocuments.map((doc, index) => (
                    <Link to={`/patient-profile/${doc.redirect}/${nic}`}>
                      {" "}
                      <div
                        key={index}
                        className="flex items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                      >
                        {/* Dynamic Icon Rendering based on doc type */}
                        {doc.type === "x-ray" && (
                          <Skull className="mr-3 text-red-500" />
                        )}
                        {doc.type === "blood-test" && (
                          <Pill className="mr-3 text-blue-500" />
                        )}
                        {doc.type === "text" && (
                          <FileText className="mr-3 text-green-500" />
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">
                            {doc.name}
                          </p>
                          <p className="text-sm text-gray-600">{doc.date}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>

          {/* SECTION: Admission History Table */}
          <Card className="bg-white shadow-md rounded-lg">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Admission History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>BHT</TableHead>
                    <TableHead>Admission Sheet Id</TableHead>
                    <TableHead>Admission Book Id</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Map through admissionData to create table rows */}
                  {admissionData.map((admission, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {admission.date
                          ? new Date(admission.date).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>{admission.bht}</TableCell>
                      <TableCell>
                        <div>
                          <p> Id: {admission.admissionSheetId} </p>
                          <Link
                            to={`/admission-sheet-register-page/${
                              admission.bht
                            }/${true}`}
                          >
                            {" "}
                            <p className="text-blue-500 underline-offset-1 hover:underline">
                              click to view
                            </p>
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p> Id: {admission.admissionBookId} </p>
                          <Link
                            to={`/admission-book-page/${admission.bht}/${true}`}
                          >
                            <p className="text-blue-500 underline-offset-1 hover:underline">
                              click to view
                            </p>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Fallback View: Displayed when no patient data is found */
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No data available</p>
          <p className="text-gray-400 text-sm">
            Please check back later or contact support if the issue persists.
          </p>
        </div>
      )}
    </div>
  );
}
