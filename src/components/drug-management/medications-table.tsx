import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const medications = [
  {
    id: 1,
    name: "Aspirin",
    stock: 5000,
    unit: "tablets",
    expiryDate: "2024-12-31",
  },
  {
    id: 2,
    name: "Amoxicillin",
    stock: 2000,
    unit: "capsules",
    expiryDate: "2024-06-30",
  },
  {
    id: 3,
    name: "Ibuprofen",
    stock: 3000,
    unit: "tablets",
    expiryDate: "2025-03-31",
  },
  {
    id: 4,
    name: "Paracetamol",
    stock: 4000,
    unit: "tablets",
    expiryDate: "2024-09-30",
  },
  {
    id: 5,
    name: "Omeprazole",
    stock: 1000,
    unit: "capsules",
    expiryDate: "2024-11-30",
  },
];

export function MedicationsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medications.map((medication) => (
            <TableRow key={medication.id}>
              <TableCell className="font-medium">{medication.name}</TableCell>
              <TableCell>{medication.stock}</TableCell>
              <TableCell>{medication.unit}</TableCell>
              <TableCell>{medication.expiryDate}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
