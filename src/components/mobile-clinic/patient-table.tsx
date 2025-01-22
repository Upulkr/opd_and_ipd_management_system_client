import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import axios from "axios";
import { usePatientStore } from "@/stores/usePatientStore";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface Patient {
  name: string;
  phone: string;
}

interface ScheduledMobileClinic {
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
  const navigate = useNavigate();
  const { setPatient } = usePatientStore((state) => state);

  const getPatientProfile = async (nic: string) => {
    try {
      setPatient([]);
      const response = await axios.get(`http://localhost:8000/patient/${nic}`);

      setPatient(response.data.Patient);
      navigate(`/patient-profile-page`);
    } catch (error: any) {
      console.log("Error fetching patient", error);
    }
  };
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Clinic Type</TableHead>
            <TableHead>Sheduled At</TableHead>
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
                <Button
                  onClick={() => {
                    getPatientProfile(patient.nic);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
