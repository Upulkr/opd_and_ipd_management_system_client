import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface IPDAdmission {
  id: number;
  patientName: string;
  age: number;
  admissionDate: string;
  diagnosis: string;
  assignedDoctor: string;
}

const ipdAdmissions: IPDAdmission[] = [
  {
    id: 1,
    patientName: "John Doe",
    age: 45,
    admissionDate: "2023-04-25",
    diagnosis: "Pneumonia",
    assignedDoctor: "Dr. Smith",
  },
  {
    id: 2,
    patientName: "Jane Smith",
    age: 32,
    admissionDate: "2023-04-25",
    diagnosis: "Appendicitis",
    assignedDoctor: "Dr. Johnson",
  },
  {
    id: 3,
    patientName: "Bob Johnson",
    age: 58,
    admissionDate: "2023-04-24",
    diagnosis: "Myocardial Infarction",
    assignedDoctor: "Dr. Williams",
  },
  {
    id: 4,
    patientName: "Alice Brown",
    age: 27,
    admissionDate: "2023-04-24",
    diagnosis: "Severe Dehydration",
    assignedDoctor: "Dr. Davis",
  },
  {
    id: 5,
    patientName: "Charlie Davis",
    age: 41,
    admissionDate: "2023-04-23",
    diagnosis: "Fracture",
    assignedDoctor: "Dr. Wilson",
  },
];

export function IPDAdmissions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{`Today's IPD Admissions from OPD -${new Date().toLocaleDateString()}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Admission Date</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead>Assigned Doctor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ipdAdmissions.map((admission) => (
              <TableRow key={admission.id}>
                <TableCell>{admission.patientName}</TableCell>
                <TableCell>{admission.age}</TableCell>
                <TableCell>{admission.admissionDate}</TableCell>
                <TableCell>{admission.diagnosis}</TableCell>
                <TableCell>{admission.assignedDoctor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
