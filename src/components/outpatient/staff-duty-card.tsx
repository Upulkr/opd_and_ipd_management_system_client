import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StaffMember {
  id: number;
  name: string;
  role: "Doctor" | "Nurse";
  specialty: string;
  shift: string;
}

const staffMembers: StaffMember[] = [
  {
    id: 1,
    name: "Dr. John Smith",
    role: "Doctor",
    specialty: "General Medicine",
    shift: "Morning",
  },
  {
    id: 2,
    name: "Dr. Emily Johnson",
    role: "Doctor",
    specialty: "Pediatrics",
    shift: "Evening",
  },
  {
    id: 3,
    name: "Nurse Sarah Brown",
    role: "Nurse",
    specialty: "General Care",
    shift: "Morning",
  },
  {
    id: 4,
    name: "Nurse Michael Lee",
    role: "Nurse",
    specialty: "Emergency Care",
    shift: "Night",
  },
  {
    id: 5,
    name: "Dr. David Wilson",
    role: "Doctor",
    specialty: "Orthopedics",
    shift: "Morning",
  },
  {
    id: 6,
    name: "Nurse Jessica Taylor",
    role: "Nurse",
    specialty: "Pediatric Care",
    shift: "Evening",
  },
];

export function StaffDutyCard() {
  const doctorCount = staffMembers.filter(
    (staff) => staff.role === "Doctor"
  ).length;
  const nurseCount = staffMembers.filter(
    (staff) => staff.role === "Nurse"
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>OPD Staff on Duty</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{doctorCount}</p>
            <p className="text-sm text-muted-foreground">Doctors</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{nurseCount}</p>
            <p className="text-sm text-muted-foreground">Nurses</p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Shift</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffMembers.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.role}</TableCell>
                <TableCell>{staff.specialty}</TableCell>
                <TableCell>{staff.shift}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
