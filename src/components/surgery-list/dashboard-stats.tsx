import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PlusCircle } from "lucide-react";
interface Surgery {
  id: string;
  patientName: string;
  AssignedDoctor: string;
  ScheduledDate: string;
  PatientPhonenUmber: string;
  PatientNic: string;
  surgeryName: string;
}

export function DashboardStats({ surgeries }: { surgeries: Surgery[] }) {
  const [nic, setNic] = useState<string>("");
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Upcoming Surgeries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{surgeries.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Successful Surgeries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"></div>
        </CardContent>
      </Card>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 ">
          <div className="flex items-center gap-2">
            {" "}
            <Input
              type="search"
              placeholder="Search by NIC..."
              className="h-8 text-sm max-w-md"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
            />{" "}
            <Link to={`/patient-profile-page/${nic}`}>
              <Button
                size="sm"
                className="h-8"
                // onClick={patientProfileHandler}
              >
                Find
              </Button>
            </Link>{" "}
          </div>

          <Link to="/sheduled-surgery">
            <Button className="bg-green-600 hover:bg-green-700">
              <PlusCircle className="mr-2 h-4 w-4" /> Schedule a New Surgery
            </Button>
          </Link>
        </div>
      </CardContent>{" "}
    </>
  );
}
