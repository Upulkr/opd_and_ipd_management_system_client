import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import debounce from "lodash.debounce";

import {
  ActivityIcon,
  AlertCircle,
  CalendarIcon,
  ClipboardListIcon,
  HomeIcon,
  Search,
  UserPlusIcon,
  X,
} from "lucide-react";

import { PatientTable } from "@/components/mobile-clinic/patient-table";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useClinincStore } from "@/stores/useClinicStore";
import { usePatientStore } from "@/stores/usePatientStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import axios from "axios";
import { format } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface Suggestion {
  nic: string;
  name: string;
}
export const MobileClinic = () => {
  const { setPatientNic } = usePatientStore((state) => state);
  const [patients, setPatients] = useState<
    { nic: string; name: string; city?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [searchNic, setSearchNic] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedClinic, setSelectedClinic] = useState("");
  const [predifinedCity, setPredifinedCity] = useState("");
  const { clinincs } = useClinincStore((state) => state);
  const [customCity, setCustomCity] = useState("");
  const [sheduledMobileclinics, setSheduledMobileclinics] = useState([]);
  const [date, setDate] = React.useState<Date>();
  const [clinincAgeGroups, setClinincAgeGroups] = useState<
    { age_group: string; value: number }[]
  >([]);

  const [monthlyHomeVisit, setMonthlyHomeVisits] = useState([]);
  const [completedClinincCountFor30days, setCompletedClinincCountFor30days] =
    useState(0);
  const [totalCompletedVisits, setTotalCompletedVisits] = useState(0);
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
  //     const response = await axios(`/api/clinicassigmnent`, {
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

  const getPatientsbyAge = async () => {
    try {
      const response = await axios.get(`/api/mobileclinic/getpatientsbyage`);
      if (response.status === 200) {
        setPatients(response.data.ageGroupCounts);
        setClinincAgeGroups(response.data.ageGroupCounts);
      }
    } catch (error: any) {
      console.log("Error assigning patient", error);
    }
  };

  const getMonthlyhomevisitsForEachMonth = async () => {
    try {
      const response = await axios.get(`/api/mobileclinic/monthlyhomevisits`);
      if (response.status === 200) {
        setMonthlyHomeVisits(response.data.monthlyhomevisits);
      }
    } catch (error: any) {
      console.log("Error assigning patient", error);
    }
  };

  const getCountCompletedVisits = async () => {
    try {
      const res = await axios.get(
        `/api/mobileclinic/getcountofcompletedmobileclinincs`
      );
      if (res.status === 200) {
        setCompletedClinincCountFor30days(res.data.completedMobileClinics);
        setTotalCompletedVisits(res.data.totalcompletedMobileClinics);
      }
    } catch (error: any) {
      console.log("Error assigning patient", error);
    }
  };

  const fetchPatients = useCallback(async () => {
    try {
      const response = await axios.get(`/api/patient`);
      if (response.status === 200) {
        setPatients(response.data.Patients);
      }
    } catch (error) {
      console.log("Error fetching patients", error);
    }
  }, []);

  const getPAtientByNic = patients.filter(
    (patient) => patient.nic === searchNic
  );

  const mobileClinincsForTable = useCallback(async () => {
    try {
      const res = await axios.get(`/api/mobileclinic/sheduled`);
      if (res.status === 200) {
        const mobileclinicAssigments = res.data.mobileclinicAssigments;
        if (mobileclinicAssigments) {
          setSheduledMobileclinics(mobileclinicAssigments);
        } else {
          setSheduledMobileclinics([]); // default value
        }
      }
    } catch (error: any) {
      // Correct error handling
      if (error.response?.status === 500) {
        console.error("Error fetching patient:", error);
      } else {
        console.error("An error occurred:", error);
      }
    }
  }, []);
  useEffect(() => {
    fetchPatients();
    mobileClinincsForTable();
    getCountCompletedVisits();
    getMonthlyhomevisitsForEachMonth();
    getPatientsbyAge();
    // getAllClinicAssigmentsForTable();
    // Fetch patients once when the component mounts
  }, []);

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

  // Update the filteredPatientDetails whenever searchNic changes
  useEffect(() => {
    debouncedSearchNic(searchNic);

    return () => debouncedSearchNic.cancel(); // Cleanup debounce on unmount
  }, [searchNic, debouncedSearchNic, sheduledMobileclinics]);

  const createMobileClinic = async () => {
    if (!selectedClinic || !searchNic) {
      toast.error("Please select a clinic and patient");
    }
    try {
      setLoading(true);
      const response = await axios(`/api/mobileclinic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          nic: searchNic,
          sheduledAt: date,
          clinicName: selectedClinic,
          clinicId: clinincs.find((clinic) => clinic.name === selectedClinic)
            ?.id,
          location:
            customCity !== ""
              ? customCity
              : predifinedCity !== "" && predifinedCity,
        },
      });
      if (response.status === 200) {
        toast.success("Patient assigned successfully");
        const timeOut = setTimeout(() => {
          setLoading(false);
          setCustomCity("");
          setDate(undefined);

          setSelectedClinic("");
          setSearchNic("");
        }, 3000);
        return () => clearTimeout(timeOut);
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
  console.log("ClinincAgeGroups", clinincAgeGroups);
  return (
    <div className="min-h-screen bg-gray-50 p-6 w-full">
      <ToastContainer />
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
          <CardHeader className="border-b text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-3">
              <UserPlusIcon className="h-6 w-6 text-primary" />
              <span>New Patient Assignment</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Patient Search */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block text-center">
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
                    <div className="absolute top-0 left-0 right-0 bg-background rounded-lg border shadow-lg max-h-60 overflow-y-auto z-10">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleNicSelect(suggestion.nic)}
                          className="w-full text-left px-4 py-3 hover:bg-muted flex flex-col gap-1 border-b last:border-0"
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
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex items-start gap-3">
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
                            }}
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
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block text-center">
                    Clinic Location
                  </label>
                  <div className="space-y-4">
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
                        {getPAtientByNic.map(({ city = "Unknown" }, i) => (
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
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block text-center">
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

                <div>
                  <label className="text-sm font-semibold mb-2 block text-center">
                    Select Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-white z-10"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={date || new Date()}
                        onSelect={setDate}
                        initialFocus
                        disabled={{
                          before: new Date(), // Disable dates before today
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  className="w-full mt-8"
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
        <div className="grid gap-6 md:grid-cols-3 ">
          {[
            {
              title: "Total Home Visits",
              value: totalCompletedVisits,
              icon: HomeIcon,
              change: "+20% from last month",
              color: "text-blue-600",
            },
            {
              title: "Completed Visits between 30days",
              value: completedClinincCountFor30days,
              icon: UserPlusIcon,
              change: "+5 this week",
              color: "text-green-600",
            },
            {
              title: "Pending Visits",
              value: sheduledMobileclinics.length,
              icon: ClipboardListIcon,
              change: "3 urgent cases",
              color: "text-yellow-600",
            },
            // {
            //   title: "Avg. Visit Duration",
            //   value: "45 min",
            //   icon: ActivityIcon,
            //   change: "-5 min from last week",
            //   color: "text-purple-600",
            // },
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
                Home Visits Trend in 30days
              </CardTitle>
            </CardHeader>
            <CardContent className="w-full aspect-[4/3]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyHomeVisit}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
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
                Patient Demographics in 30days
              </CardTitle>
            </CardHeader>
            <CardContent className="w-full aspect-[4/3]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clinincAgeGroups}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total_count"
                  >
                    {clinincAgeGroups.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke={COLORS[index % COLORS.length]}
                        name={entry.age_group}
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
        <PatientTable sheduledMobileclinics={sheduledMobileclinics} />
      </div>
    </div>
  );
};

export default MobileClinic;
