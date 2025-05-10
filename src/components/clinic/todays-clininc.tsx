import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const clinics = [
  {
    id: 1,
    name: "Cardiology Clinic",
    patients: 15,
    time: "09:00 AM - 01:00 PM",
    doctor: "Dr. Jane Smith",
    location: "Building A, Floor 2",
  },
  {
    id: 2,
    name: "Pediatric Clinic",
    patients: 20,
    time: "10:00 AM - 03:00 PM",
    doctor: "Dr. John Doe",
    location: "Building B, Floor 1",
  },
  {
    id: 3,
    name: "Orthopedic Clinic",
    patients: 12,
    time: "02:00 PM - 06:00 PM",
    doctor: "Dr. Emily Brown",
    location: "Building A, Floor 3",
  },
];

export default function TodaysClinics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Clinics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Clinic Name</TableHead>
              <TableHead>Patients</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clinics.map((clinic) => (
              <TableRow key={clinic.id}>
                <TableCell>{clinic.name}</TableCell>
                <TableCell>{clinic.patients}</TableCell>
                <TableCell>{clinic.time}</TableCell>
                <TableCell>{clinic.doctor}</TableCell>
                <TableCell>{clinic.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
