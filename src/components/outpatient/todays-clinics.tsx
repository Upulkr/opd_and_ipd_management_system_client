import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Clinic {
  id: number;
  name: string;
  doctor: string;
  startTime: string;
  endTime: string;
  location: string;
}

const todaysClinics: Clinic[] = [
  {
    id: 1,
    name: "General Medicine",
    doctor: "Dr. John Smith",
    startTime: "09:00 AM",
    endTime: "01:00 PM",
    location: "Room 101",
  },
  {
    id: 2,
    name: "Pediatrics",
    doctor: "Dr. Emily Johnson",
    startTime: "10:00 AM",
    endTime: "02:00 PM",
    location: "Room 102",
  },
  {
    id: 3,
    name: "Orthopedics",
    doctor: "Dr. David Wilson",
    startTime: "11:00 AM",
    endTime: "03:00 PM",
    location: "Room 103",
  },
  {
    id: 4,
    name: "Dermatology",
    doctor: "Dr. Sarah Brown",
    startTime: "01:00 PM",
    endTime: "05:00 PM",
    location: "Room 104",
  },
  {
    id: 5,
    name: "Cardiology",
    doctor: "Dr. Michael Lee",
    startTime: "02:00 PM",
    endTime: "06:00 PM",
    location: "Room 105",
  },
];

export function TodaysClinics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Clinics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Clinic</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todaysClinics.map((clinic) => (
              <TableRow key={clinic.id}>
                <TableCell>{clinic.name}</TableCell>
                <TableCell>{clinic.doctor}</TableCell>
                <TableCell>{`${clinic.startTime} - ${clinic.endTime}`}</TableCell>
                <TableCell>{clinic.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
