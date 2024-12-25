import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Patient {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
  clinicReason: string;
  appointmentTime: string;
}

const todaysPatients: Patient[] = [
  {
    id: 1,
    name: "John Doe",
    phoneNumber: "(555) 123-4567",
    address: "123 Main St, Anytown, AN 12345",
    clinicReason: "Follow-up",
    appointmentTime: "09:30 AM",
  },
  {
    id: 2,
    name: "Jane Smith",
    phoneNumber: "(555) 234-5678",
    address: "456 Elm St, Somewhere, SW 67890",
    clinicReason: "Annual checkup",
    appointmentTime: "10:15 AM",
  },
  {
    id: 3,
    name: "Bob Johnson",
    phoneNumber: "(555) 345-6789",
    address: "789 Oak Rd, Nowhere, NW 13579",
    clinicReason: "Vaccination",
    appointmentTime: "11:00 AM",
  },
  {
    id: 4,
    name: "Alice Brown",
    phoneNumber: "(555) 456-7890",
    address: "321 Pine Ave, Everywhere, EV 24680",
    clinicReason: "Consultation",
    appointmentTime: "01:45 PM",
  },
  {
    id: 5,
    name: "Charlie Davis",
    phoneNumber: "(555) 567-8901",
    address: "654 Maple Ln, Anywhere, AW 97531",
    clinicReason: "Test results",
    appointmentTime: "03:30 PM",
  },
];

export function TodaysPatients() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Reason for Visit</TableHead>
              <TableHead>Appointment Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todaysPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.phoneNumber}</TableCell>
                <TableCell>{patient.address}</TableCell>
                <TableCell>{patient.clinicReason}</TableCell>
                <TableCell>{patient.appointmentTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
