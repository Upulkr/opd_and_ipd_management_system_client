import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClinincStore } from "@/stores/useClinicStore";

export default function AppointmentsOverview() {
  const { clinincs } = useClinincStore((state) => state);
  const sheduledClinincs = clinincs.filter((clinic) => {
    const today = new Date().toLocaleDateString("en-CA"); // 'en-CA' ensures format 'YYYY-MM-DD'
    const clinicDate = new Date(clinic.sheduledAt).toLocaleDateString("en-CA");
    return clinicDate !== today;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sheduled Clinincs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Clininc Name</TableHead>
              <TableHead>Doctor Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Sheduled At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sheduledClinincs.length > 0 ? (
              sheduledClinincs.map((clininc, i) => (
                <TableRow key={clininc.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{clininc.name}</TableCell>
                  <TableCell>{clininc.doctorName}</TableCell>
                  <TableCell>{clininc.location}</TableCell>
                  <TableCell>
                    {new Date(clininc.sheduledAt).toLocaleString("en-US", {
                      timeZone: "Asia/Colombo",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center" }}>
                  No Scheduled Appointments
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
