"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useStaffStore } from "@/stores/useStaffStore";
import axios from "axios";
import {
  BedDouble,
  Calendar,
  Heart,
  Pill,
  Search,
  Stethoscope,
  Syringe,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Dashboard() {
  const [noOfOutPatients, setNoOfOutPatients] = useState(0);
  const [noOfInPatients, setNoOfInPatients] = useState(0);
  const [monthlyVisitData, setMonthlyVisitData] = useState([]);
  const [dischargecount, setNoOfDischarge] = useState(0);
  interface WardBedStatus {
    wardName: string;
    noOfBeds: number;
    percentage: number;
  }

  const [wardBedStatus, setWardBedStatus] = useState<WardBedStatus[]>([]);

  const [nic, setNic] = useState<string>("");
  const { staffCount } = useStaffStore((state) => state);
  console.log("dischargecount", dischargecount);
  const getdischargecounts = async () => {
    try {
      const response = await axios.get("/api/admissionbook/getdischargecounts");
      if (response.status === 200 && response.data.length > 0) {
        const count = response.data[0]?._count?.dischargeDate || 0;
        setNoOfDischarge(count);
      } else {
        setNoOfDischarge(0); // no discharges today
      }
    } catch (error) {
      console.error(error);
      setNoOfDischarge(0); // handle error by setting to 0
    }
  };

  // const patientProfileHandler = async () => {
  //   try {
  //     // setIsSearching(true);
  //     const response = await axios.get(`/api/patient/${nic}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (response.status === 200) {
  //       console.log("response", response.data.Patient);
  //       setPatient(response.data.Patient);
  //       // setIsSearching(false);
  //       toast.success("Patient found successfully");
  //       navigate(`/patient-profile-page`);
  //     }
  //   } catch (error: any) {
  //     if (error.status === 500) {
  //       // setIsSearching(false);
  //       toast.error("Patient not found");
  //       return;
  //     } else {
  //       // setIsSearching(false);
  //       console.log("Error fetching patient", error);
  //     }
  //   }
  // };
  const getNoOfOutPatients = async () => {
    try {
      const response = await axios.get("/api/outPatient/outpatientscount");
      setNoOfOutPatients(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getNoOfInPatients = async () => {
    try {
      const response = await axios.get(
        "/api/admissionbook/noofadmissionbookstoday"
      );
      if (response.data) setNoOfInPatients(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getMOnthlyPatientVisits = async () => {
    try {
      const response = await axios.get("/api/getmonthlypatientvisit");
      if (response.data) setMonthlyVisitData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getWardbedstatus = async () => {
    try {
      const response = await axios.get("/api/getwardbedstatus");
      if (response.data) setWardBedStatus(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getNoOfOutPatients();
    getNoOfInPatients();
    getMOnthlyPatientVisits();
    getWardbedstatus();
    getdischargecounts();
  }, []);
  const noOfDoctors = staffCount?.reduce(
    (acc, curr) => acc + curr.noofdoctors,
    0
  );

  const noOfNurses = staffCount?.reduce(
    (acc, curr) => acc + curr.noofnurses,
    0
  );
  const noOfPharmacists = staffCount?.reduce(
    (acc, curr) => acc + curr.noofpharmacist,
    0
  );
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 mt-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients Today
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {noOfInPatients + noOfOutPatients}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Outpatients Today
              </CardTitle>
              {/* <UserPlus className="h-4 w-4 text-muted-foreground" /> */}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{noOfOutPatients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inpatients</CardTitle>
              <BedDouble className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{noOfInPatients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Patient Search
              </CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input
                  type="search"
                  placeholder="Search by NIC..."
                  className="h-8 text-sm"
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
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Monthly Patient Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyVisitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month_year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Ward Bed Occupancy</CardTitle>
              <CardDescription>
                Current bed status across hospital wards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {wardBedStatus.map((ward) => (
                    <div key={ward.wardName}>
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">
                          {ward.wardName} -- total beds {ward.noOfBeds}
                        </div>
                        <div className="text-muted-foreground">
                          {ward.percentage}% Occupied
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-300 relative overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${ward.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Today's Patient Movement</CardTitle>
              <CardDescription>
                Admissions and discharges for the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Admissions:</span>
                  <span className="ml-auto text-2xl font-bold text-green-500">
                    {noOfInPatients}
                  </span>
                </div>
                <div className="flex items-center">
                  <UserMinus className="mr-2 h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Discharges:</span>
                  <span className="ml-auto text-2xl font-bold text-blue-500">
                    {dischargecount}
                  </span>
                </div>
                {/* <div className="flex items-center pt-2 border-t">
                  <BedDouble className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Net Change:</span>
                  <span className="ml-auto text-2xl font-bold text-primary">
                    +3
                  </span>
                </div> */}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link to="/patient-register-form ">
                {" "}
                <Button className="w-full justify-start" variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register New Patient
                </Button>
              </Link>

              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
              <Link to="/disease-prediction">
                <Button className="w-full justify-start" variant="outline">
                  <Heart className="mr-2 h-4 w-4" />
                  Disease Prediction
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Staff Overview</CardTitle>
              <CardDescription>
                Medical personnel currently on duty
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-4">
                <Stethoscope className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Doctors</p>
                  <p className="text-2xl font-bold">{noOfDoctors}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Syringe className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Nurses</p>
                  <p className="text-2xl font-bold">{noOfNurses}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Pill className="h-5 w-5 text-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Pharmacists</p>
                  <p className="text-2xl font-bold">{noOfPharmacists}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                View Detailed Staff Roster
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
