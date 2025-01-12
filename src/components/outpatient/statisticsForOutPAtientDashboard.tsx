import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble, Search, UserCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { usePatientStore } from "@/stores/usePatientStore";

// interface StatisticsData {
//   totalPatients: number;
//   patientsScheduledToday: number;
//   patientsSeenToday: number;
//   admittedToIPD: number;
// }
interface StatisticsProps {
  numberOfTodayOutPatients: number;
  setShowNicInput: (show: boolean) => void;
  setShowNicInputForView: (show: boolean) => void;
}

export default function Statistics({
  numberOfTodayOutPatients,
  setShowNicInput,
  setShowNicInputForView,
}: StatisticsProps) {
  const [nic, setNic] = useState<string>("");
  const [isSearcing, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { setPatient, setOutPatient } = usePatientStore((state) => state);
  const patientProfileHandler = async () => {
    try {
      setIsSearching(true);
      const response = await axios.get(`http://localhost:8000/patient/${nic}`);
      if (response.status === 200) {
        setPatient(response.data.Patient);
        setIsSearching(false);
        toast.success("Patient found successfully");
        navigate(`/patient-profile-page`);
      }
    } catch (error: any) {
      if (error.status === 500) {
        setIsSearching(false);
        toast.error("Patient not found");
        return;
      } else {
        setIsSearching(false);
        console.log("Error fetching patient", error);
      }
    }
  };
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <ToastContainer />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Patient Search</CardTitle>
          <Search className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Search patients..."
              value={nic}
              onChange={(e) => setNic(e.target.value)}
            />
            <Button onClick={patientProfileHandler}>Search</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Out Patient Form
          </CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Button className="w-full mt-4" onClick={() => setShowNicInput(true)}>
            Add New Out Patient
          </Button>
        </CardContent>
        <CardContent>
          {/* <div className="text-2xl font-bold">
            {data.patientsScheduledToday}
          </div> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Patients Seen Today
          </CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{numberOfTodayOutPatients}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Out Patient Form
          </CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Button
            className="w-full mt-4"
            onClick={() => {
              setShowNicInputForView(true);
              setPatient([]);
              setOutPatient([]);
            }}
          >
            View OutPatient Form
          </Button>
        </CardContent>
        <CardContent>
          {/* <div className="text-2xl font-bold">
            {data.patientsScheduledToday}
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
