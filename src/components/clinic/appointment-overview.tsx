import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const appointments = [
  {
    id: 1,
    time: "09:00 AM",
    patient: "John Doe",
    type: "Check-up",
    phoneNumber: "1234567890",
    nic: "ABC123456",
    status: "Pending",
  },
  {
    id: 2,
    time: "10:30 AM",
    patient: "Jane Smith",
    type: "Follow-up",
    phoneNumber: "0987654321",
    nic: "XYZ789012",
    status: "Completed",
  },
  {
    id: 3,
    time: "02:00 PM",
    patient: "Bob Johnson",
    type: "Consultation",
    phoneNumber: "5678901234",
    nic: "PQR345678",
    status: "Pending",
  },
];

export default function AppointmentsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>NIC</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.patient}</TableCell>
                <TableCell>{appointment.type}</TableCell>
                <TableCell>{appointment.phoneNumber}</TableCell>
                <TableCell>{appointment.nic}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      appointment.status === "Completed"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
