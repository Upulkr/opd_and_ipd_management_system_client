import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Surgery } from "@/types/surgery";

interface SurgeryTableProps {
  surgeries: Surgery[];
}

export function SurgeryTable({
  surgeries: initialSurgeries,
}: SurgeryTableProps) {
  const [surgeries, setSurgeries] = useState(initialSurgeries);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredSurgeries = surgeries.filter(
    (surgery) =>
      surgery.patientName.toLowerCase().includes(search.toLowerCase()) ||
      surgery.surgeryType.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSurgeries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSurgeries = filteredSurgeries.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search surgeries..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Surgery Type</TableHead>
            <TableHead>Assigned Staff</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentSurgeries.map((surgery) => (
            <TableRow key={surgery.id}>
              <TableCell>{surgery.patientName}</TableCell>
              <TableCell>{surgery.surgeryType}</TableCell>
              <TableCell>{surgery.assignedStaff}</TableCell>
              <TableCell>{surgery.date}</TableCell>
              <TableCell>{surgery.phoneNumber}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() =>
                        alert(`View details for ${surgery.patientName}`)
                      }
                    >
                      View patient details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Edit surgery</DropdownMenuItem>
                    <DropdownMenuItem>Cancel surgery</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
