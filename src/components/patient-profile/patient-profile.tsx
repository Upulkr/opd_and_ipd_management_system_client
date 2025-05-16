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
    redirect: `x-ray-images`,
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
export default function CurrentPatientProfile() {
  const navigate = useNavigate();
  const [currentPatient, setCurrentPatient] = useState<CurrentPatient | null>(
    null
  );
  const [admissionData, setAdmissionData] = useState<genralData[]>([]);
  const token = useAuthStore((state) => state.token);
  const { nic } = useParams<{ nic: string }>();
  const fetchCurrentPatient = async () => {
    try {
      const response = await apiClient.get(`/patient/${nic}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response", response.data.Patient);
      if (response.status === 200 && response.data.Patient) {
        setCurrentPatient(response.data.Patient);
      } else {
        console.warn("No patient data found");
      }
    } catch (error) {
      console.error("Error fetching currentPatient data:", error);
    }
  };

  const getAdmiitedDetails = async () => {
    try {
      const reponse = await apiClient.get(
        `/generaladmission/generaldetails/${nic}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (reponse.status === 200) {
        setAdmissionData(reponse.data.combinedAdmissionData || []);
      }
    } catch (error: any) {
      if (error.status === 401) {
        toast.error("Pleas Log first");
        navigate("/log-in");
      }
      console.log(error);
    }
  };
  useEffect(() => {
    if (nic) {
      fetchCurrentPatient();
      getAdmiitedDetails();
    }
  }, [nic, token]);

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gray-50">
      <ToastContainer />
      <h1 className="text-4xl font-bold text-gray-800">
        currentPatient Profile
      </h1>
      {currentPatient ? (
        <>
          <>
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
                    {/* Avatar Section */}
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

                    {/* currentPatient and Address Details */}
                    <div className="flex-1 grid md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-sm">
                      {/* currentPatient Details */}
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

                      {/* Address Details */}
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
            <Card className="bg-white shadow-md rounded-lg">
              <div className="flex items-center justify-items-center p-4 border-b border-gray-200">
                <CardHeader className="border-b border-gray-200 ">
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    Reports and Documents
                  </CardTitle>
                </CardHeader>
                <FileUploadPopup patientNic={nic} />
              </div>

              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {reportsAndDocuments.map((doc, index) => (
                    <Link to={`/patient-profile/${doc.redirect}/${nic}`}>
                      {" "}
                      <div
                        key={index}
                        className="flex items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                      >
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
                            <p>click to view</p>
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p> Id: {admission.admissionBookId} </p>
                          <Link
                            to={`/admission-book-page/${admission.bht}/${true}`}
                          >
                            <p>click to view</p>
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
