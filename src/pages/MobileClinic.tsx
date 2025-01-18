import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import debounce from "lodash.debounce";

import {
  PlusCircle,
  HomeIcon,
  UserPlusIcon,
  ClipboardListIcon,
  ActivityIcon,
  Search,
  X,
  AlertCircle,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { PatientTable } from "@/components/mobile-clinic/patient-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import { useClinincStore } from "@/stores/useClinicStore";
import { toast } from "react-toastify";
import { usePatientStore } from "@/stores/usePatientStore";
import axios from "axios";

const visitsTrendData = [
  { name: "Jan", visits: 65 },
  { name: "Feb", visits: 59 },
  { name: "Mar", visits: 80 },
  { name: "Apr", visits: 81 },
  { name: "May", visits: 56 },
  { name: "Jun", visits: 55 },
  { name: "Jul", visits: 40 },
];

const patientDemographicsData = [
  { name: "Elderly", value: 400 },
  { name: "Adults", value: 300 },
  { name: "Children", value: 200 },
  { name: "Infants", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const recentVisits = [
  { patientName: "Maria Garcia", date: "2023-06-15", status: "Completed" },
  { patientName: "John Smith", date: "2023-06-16", status: "Scheduled" },
  { patientName: "Emma Johnson", date: "2023-06-14", status: "Completed" },
  { patientName: "Robert Lee", date: "2023-06-17", status: "Pending" },
  { patientName: "Sophia Brown", date: "2023-06-15", status: "Completed" },
];

const upcomingVisits = [
  { patientName: "Alice Johnson", date: "2023-06-18", time: "10:00 AM" },
  { patientName: "David Lee", date: "2023-06-18", time: "2:30 PM" },
  { patientName: "Sarah Williams", date: "2023-06-19", time: "11:15 AM" },
  { patientName: "Michael Brown", date: "2023-06-19", time: "3:45 PM" },
  { patientName: "Emily Davis", date: "2023-06-20", time: "9:30 AM" },
];
interface Suggestion {
  nic: string;
  name: string;
}
export default function MobileClininic() {
  const {
    setPatient,
    patient: patients,
    setPatientNic,
  } = usePatientStore((state) => state);
  const [loading, setLoading] = useState(false);
  const [searchNic, setSearchNic] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedClinic, setSelectedClinic] = useState("");
  const [predifinedCity, setPredifinedCity] = useState("");
  const { clinincs } = useClinincStore((state) => state);
  const [customCity, setCustomCity] = useState("");
  const navigate = useNavigate();
  const clearSearch = () => {
    setSearchNic("");
    setSuggestions([]);
    setShowSuggestions(false);
  };
  const handleNicSelect = (nic: string) => {
    setSearchNic(nic);
    setShowSuggestions(false);
  };

  // const handlePatientAssign = async () => {
  //   const clinicId = selectedClinic
  //     ? clinincs.filter((clinic) => clinic.name === selectedClinic)
  //     : [];
  //   console.log("clinicId+++++++++++", clinicId?.[0]?.id);
  //   if (!selectedClinic || !searchNic) {
  //     toast.error("Please select a clinic and patient");
  //     return;
  //   }
  //   try {
  //     setLoading(true);
  //     const response = await axios(`http://localhost:8000/clinicassigmnent`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       data: {
  //         nic: searchNic,
  //         clinicName: selectedClinic,
  //         clinicId: clinincs.find((clinic) => clinic.name === selectedClinic)
  //           ?.id,
  //       },
  //     });
  //     if (response.status === 200) {
  //       toast.success("Patient assigned successfully");
  //     }
  //     setLoading(false);
  //   } catch (error: any) {
  //     setLoading(false);
  //     if (error.response?.status === 404) {
  //       toast.error("Patient not found, please register the patient");
  //     } else {
  //       console.error("Error assigning patient", error);
  //     }
  //   }
  // };

  const fetchPatients = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/patient`);
      if (response.status === 200) {
        setPatient(response.data.Patients);
      }
    } catch (error) {
      console.log("Error fetching patients", error);
    }
  }, []);

  const getPAtientByNic = patients.filter(
    (patient) => patient.nic === searchNic
  );

  useEffect(() => {
    fetchPatients();
    // getAllClinicAssigmentsForTable();
    // Fetch patients once when the component mounts
  }, [fetchPatients]);

  // Debounce logic for searchNic changes
  const debouncedSearchNic = useCallback(
    debounce((nic: string) => {
      if (nic) {
        const filtered = patients
          .filter((patient) =>
            patient.nic.toLowerCase().includes(nic.toLowerCase())
          )
          .map((patient) => ({
            nic: patient.nic,
            name: patient.name,
          }));
        setSuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300), // 300ms debounce time
    [patients]
  );

  useEffect(() => {
    debouncedSearchNic(searchNic);
    return () => debouncedSearchNic.cancel(); // Cleanup debounce on unmount
  }, [searchNic, debouncedSearchNic]);

  const createMobileClinic = async () => {
    if (!selectedClinic || !searchNic) {
      toast.error("Please select a clinic and patient");
    }
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:8000/clinic`, {
        nic: searchNic,
        clinicName: selectedClinic,
        clinicId: clinincs.find((clinic) => clinic.name === selectedClinic)?.id,
        location:
          customCity !== ""
            ? customCity
            : predifinedCity !== "" && predifinedCity,
      });
      if (response.status === 200) {
        toast.success("Patient assigned successfully");
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.status === 404) {
        toast.error("Patient not found, please register the patient");
      } else {
        console.error("Error assigning patient", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 w-full">
      {/* Header Section */}
      <header className="mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Mobile Home Clinic Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Manage patient assignments and monitor clinic activities
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Patient Assignment Section */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <UserPlusIcon className="h-5 w-5 text-primary" />
              New Patient Assignment
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Patient Search */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">
                    Find Patient
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter Patient NIC number"
                      className="pl-9 pr-9"
                      value={searchNic}
                      onChange={(e) => setSearchNic(e.target.value)}
                    />
                    {searchNic && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Results */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="relative">
                    <div className="absolute top-0 left-0 right-0 bg-gray-50 rounded-md border shadow-lg max-h-[240px] overflow-y-auto z-10">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleNicSelect(suggestion.nic)}
                          className="w-full text-left px-4 py-3 hover:bg-muted/50 flex flex-col gap-0.5 border-b last:border-0"
                        >
                          <span className="font-medium">{suggestion.nic}</span>
                          <span className="text-sm text-muted-foreground">
                            {suggestion.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {searchNic && suggestions.length === 0 && (
                  <div className="mt-2 rounded-md bg-muted p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Patient not found</p>
                        <p className="text-sm text-muted-foreground">
                          Would you like to{" "}
                          <Button
                            variant="link"
                            className="h-auto p-0 text-primary hover:text-primary/80"
                            onClick={() => {
                              setPatientNic(searchNic);
                              navigate("/patient-register-form");
                            }} // Adjust this to your routing method
                          >
                            register a new patient
                          </Button>
                          ?
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Middle Column - Location */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">
                    Clinic Location
                  </label>
                  <div className="space-y-3">
                    <Select
                      value={predifinedCity}
                      onValueChange={(value) => {
                        setPredifinedCity(value);
                        setCustomCity("");
                      }}
                      disabled={customCity?.length > 0 || !searchNic}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select from existing locations" />
                      </SelectTrigger>
                      <SelectContent>
                        {getPAtientByNic.map(({ city }, i) => (
                          <SelectItem
                            key={i}
                            value={city ?? ""}
                            disabled={!city || customCity.length > 0}
                          >
                            {city || "No location available"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          or
                        </span>
                      </div>
                    </div>

                    <Input
                      placeholder="Enter a new location"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      disabled={!searchNic || predifinedCity !== ""}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Clinic Selection & Submit */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">
                    Assign to Clinic
                  </label>
                  <Select
                    value={selectedClinic}
                    onValueChange={setSelectedClinic}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a clinic" />
                    </SelectTrigger>
                    <SelectContent>
                      {clinincs.map((clinic) => (
                        <SelectItem key={clinic.id} value={clinic.name}>
                          {clinic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full mt-6"
                  onClick={createMobileClinic}
                  disabled={
                    loading ||
                    !searchNic ||
                    (!predifinedCity && !customCity) ||
                    !selectedClinic
                  }
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⌛</span>
                      <span>Assigning Patient...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <UserPlusIcon className="h-4 w-4" />
                      <span>Complete Assignment</span>
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Home Visits",
              value: "1,284",
              icon: HomeIcon,
              change: "+20% from last month",
              color: "text-blue-600",
            },
            {
              title: "New Patients",
              value: "32",
              icon: UserPlusIcon,
              change: "+5 this week",
              color: "text-green-600",
            },
            {
              title: "Pending Visits",
              value: "18",
              icon: ClipboardListIcon,
              change: "3 urgent cases",
              color: "text-yellow-600",
            },
            {
              title: "Avg. Visit Duration",
              value: "45 min",
              icon: ActivityIcon,
              change: "-5 min from last week",
              color: "text-purple-600",
            },
          ].map((card, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-sm text-gray-600 mt-1">{card.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ActivityIcon className="h-5 w-5" />
                Home Visits Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="w-full aspect-[4/3]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitsTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlusIcon className="h-5 w-5" />
                Patient Demographics
              </CardTitle>
            </CardHeader>
            <CardContent className="w-full aspect-[4/3]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={patientDemographicsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {patientDemographicsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Patient Table */}
        <PatientTable />
      </div>
    </div>
  );
}
