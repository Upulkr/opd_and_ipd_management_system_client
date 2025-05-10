import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  specialty: string;
  shift: string;
}

export function StaffDutyCard() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);

  const fetchStaffMembers = async () => {
    try {
      const response = await axios.get("/api/outPatient/getstaff");
      if (response.status === 200) {
        setStaffMembers(response.data.staffOutPatient);
      }
    } catch (error: any) {
      if (error.status === 500) {
        console.log(error.data.message);
      } else {
        console.log("Something went wrong", error);
      }
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, []);
  const doctors = staffMembers?.filter((staff) => staff.role === "doctor");
  const nurses = staffMembers?.filter((staff) => staff.role === "nurse");
  return (
    <Card>
      <CardHeader>
        <CardTitle>OPD Staff on Duty</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{doctors.length}</p>
            <p className="text-sm text-muted-foreground">Doctors</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{nurses.length}</p>
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
