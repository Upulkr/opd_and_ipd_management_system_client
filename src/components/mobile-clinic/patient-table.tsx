import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuth";
interface Patient {
  name: string;
  phone: string;
}

interface ScheduledMobileClinic {
  id: string;
  Patient: Patient;
  clinicName: string;
  sheduledAt: string;
  location: string;
  distance: string;
  status: string;
  nic: string;
}

interface PatientTableProps {
  sheduledMobileclinics: ScheduledMobileClinic[];
}

export function PatientTable({ sheduledMobileclinics }: PatientTableProps) {
  const token = useAuthStore((state) => state.token);
  const [selectedRows, setSelectedRows] = useState<
    { nic: string; id: string }[]
  >([]);
  const [loading, setloading] = useState(false);
  // const navigate = useNavigate();
  // const { setPatient } = usePatientStore((state) => state);

  // const getPatientProfile = async (nic: string) => {
  //   try {
  //     setPatient([]);
  //     const response = await axios.get(`/api/patient/${nic}`);

  //     setPatient(response.data.Patient);
  //     navigate(`/patient-profile-page`);
  //   } catch (error: any) {
  //     console.log("Error fetching patient", error);
  //   }
  // };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(
        Array.isArray(sheduledMobileclinics)
          ? sheduledMobileclinics.map((patient) => ({
              nic: patient.nic,
              id: patient.id,
            }))
          : []
      );
    } else {
      setSelectedRows([]);
    }
  };
  const handleSelectRow = (checked: boolean, nic: string, id: string) => {
    if (checked) {
      setSelectedRows([...selectedRows, { nic, id }]);
    } else {
      setSelectedRows(selectedRows.filter((row) => row.id !== id));
    }
  };

  const handleMarkAsComplete = async () => {
    try {
      setloading(true);
      const response = await axios("/api/mobileclinic/markascompleted", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        data: { selectedRows },
      });
      if (response.status === 200) {
        toast.success("Marked as complete");
        setloading(false);
        setSelectedRows([]);
      }
    } catch (error: any) {
      if (error.response.status === 500) {
        toast.error("Error marking as complete");
      }
      setloading(false);

      console.log("Error marking as complete", error);
    }
  };
  return (
    <div className="space-y-4">
      <ToastContainer />
      {selectedRows.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedRows.length === sheduledMobileclinics.length}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all">Select All</label>
          </div>
          <Button
            onClick={handleMarkAsComplete}
            disabled={selectedRows.length === 0}
          >
            {loading ? "Marking as complete..." : "Mark Selected as Complete"}
          </Button>
        </div>
      )}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>Clinic Type</TableHead>
              <TableHead>Scheduled At</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>View On Map</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sheduledMobileclinics.map((patient, i: number) => (
              <TableRow key={i}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.some(
                      (row) => row.nic === patient.nic
                    )}
                    onCheckedChange={(checked: boolean) =>
                      handleSelectRow(checked, patient.nic, patient.id)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {patient.Patient.name}
                </TableCell>
                <TableCell>{patient.clinicName}</TableCell>
                <TableCell>
                  {new Date(patient.sheduledAt).toLocaleString("en-US", {
                    timeZone: "Asia/Colombo",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </TableCell>
                <TableCell>{patient.location}</TableCell>
                <TableCell>
                  <Link to={`/view-in-map/${patient.location}`}>
                    <Button>View On Map</Button>
                  </Link>
                </TableCell>
                <TableCell>{patient.Patient.phone}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      patient.status === "completed" ? "default" : "secondary"
                    }
                    className={
                      patient.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {patient.status === "completed" ? "Completed" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link to={`/patient-profile-page/${patient.nic}`}>
                    {" "}
                    <Button
                    // onClick={() => {
                    //   getPatientProfile(patient.nic);
                    // }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
