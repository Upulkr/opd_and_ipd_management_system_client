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
import { usePatientStore } from "@/stores/usePatientStore";
import { FileImage, FileIcon as FilePdf, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// const patientData = {
//   name: "John Doe",
//   age: 45,
//   gender: "Male",
//   bloodType: "A+",
//   contactNumber: "+1 (555) 123-4567",
//   emergencyContact: "Jane Doe: +1 (555) 987-6543",
// };

const admissionData = [
  {
    date: "2023-05-15",
    bht: "BHT001",
    admissionSheet: "AS001",
    admissionBook: "AB001",
  },
  {
    date: "2023-07-22",
    bht: "BHT002",
    admissionSheet: "AS002",
    admissionBook: "AB002",
  },
  {
    date: "2023-09-10",
    bht: "BHT003",
    admissionSheet: "AS003",
    admissionBook: "AB003",
  },
];

const reportsAndDocuments = [
  { name: "Blood Test Results", type: "pdf", date: "2023-09-15" },
  { name: "X-Ray Image", type: "image", date: "2023-09-16" },
  { name: "Doctor's Notes", type: "text", date: "2023-09-17" },
  { name: "MRI Scan", type: "image", date: "2023-09-18" },
  { name: "Prescription", type: "pdf", date: "2023-09-19" },
];

export default function PatientProfile() {
  const { patient } = usePatientStore((state) => state);
  console.log("patient", patient);
  return (
    <div className="container mx-auto p-6 space-y-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800">Patient Profile</h1>

      {/* Personal Information Card */}
      <Card className="bg-white shadow-md rounded-lg">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patient && (
            <div
              className="flex flex-col sm:flex-row items-center sm:items-start gap-8"
              key={patient.id}
            >
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="w-32 h-32 shadow-lg mt-2">
                  <AvatarImage
                    src="https://static.vecteezy.com/system/resources/thumbnails/001/840/612/small_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg"
                    alt={patient.name}
                  />
                  <AvatarFallback className="bg-gray-200 text-gray-700">
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Badge variant="secondary" className="px-3 py-1">
                  {patient.bloodType}
                </Badge>
              </div>

              {/* Patient and Address Details */}
              <div className="flex-1 grid md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-sm">
                {/* Patient Details */}
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {patient.name}
                  </h2>
                  <p className="text-gray-700">
                    <span className="font-medium">NIC:</span> {patient.nic}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Age:</span> {patient.age}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Gender:</span>{" "}
                    {patient.gender}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Blood Group:</span>{" "}
                    {/* {patient.bloddgroup} */}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Contact:</span>{" "}
                    {patient.phone}
                  </p>
                </div>

                {/* Address Details */}
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <span className="font-medium">Street Address:</span>{" "}
                    {patient.streetAddress || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">City:</span>{" "}
                    {patient.city || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Country:</span>{" "}
                    {patient.country || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Province:</span>{" "}
                    {patient.stateProvince || "N/A"}
                  </p>{" "}
                  <p className="text-gray-700">
                    <span className="font-medium">Emergency Contact:</span>{" "}
                    {patient.emergencyContact || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reports and Documents Card */}
      <Card className="bg-white shadow-md rounded-lg">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Reports and Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reportsAndDocuments.map((doc, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                {doc.type === "pdf" && (
                  <FilePdf className="mr-3 text-red-500" />
                )}
                {doc.type === "image" && (
                  <FileImage className="mr-3 text-blue-500" />
                )}
                {doc.type === "text" && (
                  <FileText className="mr-3 text-green-500" />
                )}
                <div>
                  <p className="font-semibold text-gray-800">{doc.name}</p>
                  <p className="text-sm text-gray-600">{doc.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admission History Card */}
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
                <TableHead>Admission Sheet</TableHead>
                <TableHead>Admission Book</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admissionData.map((admission, index) => (
                <TableRow key={index}>
                  <TableCell>{admission.date}</TableCell>
                  <TableCell>{admission.bht}</TableCell>
                  <TableCell>{admission.admissionSheet}</TableCell>
                  <TableCell>{admission.admissionBook}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
