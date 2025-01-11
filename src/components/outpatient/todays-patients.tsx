import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
interface Patient {
  id: number;
  nic: string;
  name: string;
  phone: string;
  city: string;
  reason: string;
  createdAt: string;
}

export function TodaysPatients({
  todayOutPatients,
}: {
  todayOutPatients: Patient[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NIC</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Reason for Visit</TableHead>
              <TableHead>Channeled Time by Doctor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todayOutPatients && todayOutPatients.length > 0 ? (
              todayOutPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.nic}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.city}</TableCell>
                  <TableCell>{patient.reason}</TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Colombo", // Replace with desired time zone
                    }).format(new Date(patient.createdAt))}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center" }}>
                  No Patients
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
