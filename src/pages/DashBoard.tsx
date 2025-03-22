"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  Activity,
  BedDouble,
  Calendar,
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
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// const monthlyVisitData = [
//   { name: "Jan", visits: 4000 },
//   { name: "Feb", visits: 3000 },
//   { name: "Mar", visits: 2000 },
//   { name: "Apr", visits: 2780 },
//   { name: "May", visits: 1890 },
//   { name: "Jun", visits: 2390 },
//   { name: "Jul", visits: 3490 },
// ];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [noOfOutPatients, setNoOfOutPatients] = useState(0);
  const [noOfInPatients, setNoOfInPatients] = useState(0);
  const [monthlyVisitData, setMonthlyVisitData] = useState([]);
  const getNoOfOutPatients = async () => {
    try {
      const response = await axios.get("/api/outPatient//outpatientscount");
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
  useEffect(() => {
    getNoOfOutPatients();
    getNoOfInPatients();
    getMOnthlyPatientVisits();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">MediCare</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Login</Button>
            </DialogTrigger>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Sign Up</Button>
            </DialogTrigger>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button size="sm" className="h-8">
                  Find
                </Button>
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
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">General Ward (32 beds)</div>
                    <div className="text-muted-foreground">85% Occupied</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[85%] rounded-full bg-blue-500"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Pediatric Ward (24 beds)</div>
                    <div className="text-muted-foreground">62% Occupied</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[62%] rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">ICU (12 beds)</div>
                    <div className="text-muted-foreground">92% Occupied</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[92%] rounded-full bg-red-500"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Surgical Ward (28 beds)</div>
                    <div className="text-muted-foreground">78% Occupied</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[78%] rounded-full bg-yellow-500"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Maternity Ward (18 beds)</div>
                    <div className="text-muted-foreground">56% Occupied</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[56%] rounded-full bg-green-500"></div>
                  </div>
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
                    15
                  </span>
                </div>
                <div className="flex items-center pt-2 border-t">
                  <BedDouble className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Net Change:</span>
                  <span className="ml-auto text-2xl font-bold text-primary">
                    +3
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button className="w-full justify-start" variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Register New Patient
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BedDouble className="mr-2 h-4 w-4" />
                Manage Bed Allocation
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Today's Staff Overview</CardTitle>
              <CardDescription>
                Medical personnel currently on duty
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-4">
                <Stethoscope className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Doctors</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Syringe className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Nurses</p>
                  <p className="text-2xl font-bold">58</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Pill className="h-5 w-5 text-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Pharmacists</p>
                  <p className="text-2xl font-bold">7</p>
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
