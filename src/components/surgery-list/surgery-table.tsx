import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  PlusCircle,
  AlertCircle,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuthStore } from "@/stores/useAuth";

interface Surgery {
  id: string;
  patientName: string;
  AssignedDoctor: string;
  ScheduledDate: string;
  PatientPhonenUmber: string;
  PatientNic: string;
  surgeryName: string;
}

export function SurgeryTable({ surgeries }: { surgeries: Surgery[] }) {
  const token = useAuthStore((state) => state.token);
  const [filteredSurgeries, setFilteredSurgeries] =
    useState<Surgery[]>(surgeries);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [surgeryToDelete, setSurgeryToDelete] = useState<string | null>(null);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(surgeries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSurgeries = surgeries.slice(startIndex, endIndex);
  const navigate = useNavigate();

  const openConfirmDialog = (surgeryId: string) => {
    setSurgeryToDelete(surgeryId);
    setIsConfirmOpen(true);
  };

  const cancelSurgery = async () => {
    if (!surgeryToDelete) return;

    try {
      const response = await axios.delete(
        `/api/surgery/deletesurgeryschedule/${surgeryToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Surgery canceled successfully");
        setIsConfirmOpen(false);
        // Refresh the page or refetch data
        navigate(0); // This refreshes the current page
      }
    } catch (error: any) {
      if (error.status === 401) {
        toast.error("Unauthorized. Please log in again.");
      }
      console.error("Error canceling surgery:", error);
      toast.error("Failed to cancel surgery");
    }
  };

  const handleSearchSurgeriesByNic = () => {
    if (search.length > 8) {
      const surgeriesByNic = surgeries.filter((surgery) =>
        surgery.PatientNic.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredSurgeries(surgeriesByNic);
    }
  };
  return (
    <div className="space-y-4">
      <ToastContainer />
      <div className="flex space-x-3 items-center m-5">
        <Input
          placeholder="Search surgeries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Search
          className="h-5 w-5 text-gray-500"
          onClick={handleSearchSurgeriesByNic}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Surgery Name</TableHead>
            <TableHead>Assigned Doctor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {surgeries.length > 0 ? (
          <TableBody>
            {(filteredSurgeries.length > 0
              ? filteredSurgeries
              : currentSurgeries
            ).map((surgery) => (
              <TableRow key={surgery.id}>
                <TableCell>{surgery.patientName}</TableCell>
                <TableCell>{surgery.surgeryName}</TableCell>
                <TableCell>{surgery.AssignedDoctor}</TableCell>
                <TableCell>
                  {new Date(surgery.ScheduledDate).toLocaleDateString("si-LK", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>{surgery.PatientPhonenUmber}</TableCell>
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
                      <Link to={`/patient-profile-page/${surgery.PatientNic}`}>
                        <DropdownMenuItem>
                          View patient details
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <Link to={`/view-surgery/${surgery.id}`}>
                        <DropdownMenuItem>Edit surgery</DropdownMenuItem>
                      </Link>

                      <DropdownMenuItem
                        onClick={() => openConfirmDialog(surgery.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        Cancel surgery
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <div className="text-center mx-auto justify-center m-3">
            <p className="text-2xl text-center">No surgeries found</p>
          </div>
        )}
      </Table>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Confirm Surgery Cancellation
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this surgery? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              No, Keep Surgery
            </Button>
            <Button variant="destructive" onClick={cancelSurgery}>
              Yes, Cancel Surgery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
