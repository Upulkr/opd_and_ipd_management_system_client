import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

const patients = [
  {
    name: "John Doe",
    clinicType: "General Checkup",
    location: "123 Main St, Cityville",
    distance: "5.2 km",
    phoneNumber: "(555) 123-4567",
    status: "completed",
  },
  {
    name: "Jane Smith",
    clinicType: "Physiotherapy",
    location: "456 Elm St, Townsburg",
    distance: "3.8 km",
    phoneNumber: "(555) 987-6543",
    status: "pending",
  },
  {
    name: "Bob Johnson",
    clinicType: "Vaccination",
    location: "789 Oak Ave, Villageton",
    distance: "7.1 km",
    phoneNumber: "(555) 246-8135",
    status: "completed",
  },
  {
    name: "Alice Brown",
    clinicType: "Blood Test",
    location: "321 Pine Rd, Hamletville",
    distance: "2.5 km",
    phoneNumber: "(555) 369-2580",
    status: "pending",
  },
];

export function PatientTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Clinic Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Distance</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.name}>
              <TableCell className="font-medium">{patient.name}</TableCell>
              <TableCell>{patient.clinicType}</TableCell>
              <TableCell>{patient.location}</TableCell>
              <TableCell>{patient.distance}</TableCell>
              <TableCell>{patient.phoneNumber}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    patient.status === "completed" ? "default" : "secondary"
                  }
                  className={
                    patient.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : ""
                  }
                >
                  {patient.status === "completed" ? "Completed" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
