/* Previous imports remain the same */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClinincStore } from "@/stores/useClinicStore";
import { usePatientStore } from "@/stores/usePatientStore";
import axios from "axios";
import debounce from "lodash.debounce";
import { MessageSquare, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

// Previous data and state management code remains the same...
interface Suggestion {
  nic: string;
  name: string;
}
export default function ClinicPage() {
  // Previous state and handlers remain the same...
  const [loading, setLoading] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState("");
  const [searchNic, setSearchNic] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [clinicsAssign, setClinicsAssign] = useState([]);
  const { setPatient, patient: patients } = usePatientStore((state) => state);
  const { clinincs } = useClinincStore((state) => state);

  const handlePatientAssign = async () => {
    if (!selectedClinic || !searchNic) {
      toast.error("Please select a clinic and patient");
      return;
    }
    try {
      setLoading(true);
      const response = await axios(`http://localhost:8000/clinicassigmnent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          nic: searchNic,
          clinicName: selectedClinic,
          clinicId: clinincs.find((clinic) => clinic.name === selectedClinic)
            ?.id,
        },
      });
      if (response.status === 200) {
        toast.success("Patient assigned successfully");
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.response?.status === 404) {
        toast.error("Patient not found, please register the patient");
      } else {
        console.error("Error assigning patient", error);
      }
    }
  };

  function handleSendSMS(id: number): void {
    throw new Error("Function not implemented.");
  }
  const getAllClinicAssigmentsForTable = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/clinicassigmnent/getAllClinicAssigmentsfortable`
      );
      if (response.status === 200) {
        setClinicsAssign(response.data.clinicAssigments);
      }
    } catch (error) {
      console.log("Error fetching patients", error);
    }
  }, []);

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

  useEffect(() => {
    fetchPatients();
    getAllClinicAssigmentsForTable();
    // Fetch patients once when the component mounts
  }, [fetchPatients, getAllClinicAssigmentsForTable]);

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

  const handleNicSelect = (nic: string) => {
    setSearchNic(nic);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchNic("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <ToastContainer />
      {/* Search section remains the same */}
      <Card className="p-6">
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by NIC"
                  className="pl-8 pr-8"
                  value={searchNic}
                  onChange={(e) => setSearchNic(e.target.value)}
                />
                {searchNic && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-col"
                      onClick={() => handleNicSelect(suggestion.nic)}
                    >
                      <span className="font-medium">{suggestion.nic}</span>
                      <span className="text-sm text-gray-600">
                        {suggestion.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Select value={selectedClinic} onValueChange={setSelectedClinic}>
              <SelectTrigger>
                <SelectValue placeholder="Select Clinic" />
              </SelectTrigger>
              <SelectContent>
                {clinincs.map((clinic) => (
                  <SelectItem key={clinic.id} value={clinic.name}>
                    {clinic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="w-full md:w-auto" onClick={handlePatientAssign}>
              {loading ? "Assigning..." : " Assign Patient"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clinics Table with updated actions column */}
      <Card>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-center border-b">
                    Clinic Name
                  </th>
                  <th className="px-4 py-2 text-center border-b">Doctor</th>
                  <th className="px-4 py-2 text-center border-b">Location</th>
                  <th className="px-4 py-2 text-right border-b">
                    No. of Patients
                  </th>
                  <th className="px-4 py-2 text-center border-b">
                    Sheduled Time
                  </th>
                  <th className="px-4 py-2 text-center border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clinicsAssign?.map((clinic) => (
                  <tr key={clinic.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b text-center">
                      {clinic.clinicName}
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      {clinic.doctorName}
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      {clinic.location}
                    </td>
                    <td className="px-4 py-2 text-center border-b">
                      {clinic.noofpatients}
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      {new Date(clinic.sheduledAt).toLocaleString("en-US", {
                        timeZone: "Asia/Colombo",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="px-4 py-2 text-right border-b">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View Patients
                            </Button>
                          </DialogTrigger>
                          {/* <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>
                                {clinic.name} - Patient Details
                              </DialogTitle>
                            </DialogHeader>
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-4 py-2 text-left border-b">
                                      Patient Name
                                    </th>
                                    <th className="px-4 py-2 text-left border-b">
                                      Address
                                    </th>
                                    <th className="px-4 py-2 text-left border-b">
                                      Phone
                                    </th>
                                    <th className="px-4 py-2 text-left border-b">
                                      NIC
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {patients &&
                                    patients.map((patient) => (
                                      <tr
                                        key={patient.id}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="px-4 py-2 border-b text-center">
                                          {patient.name}
                                        </td>
                                        <td className="px-4 py-2 border-b text-center">
                                          {patient.address}
                                        </td>
                                        <td className="px-4 py-2 border-b text-center">
                                          {patient.phone}
                                        </td>
                                        <td className="px-4 py-2 border-b text-center">
                                          {patient.nic}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </DialogContent> */}
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendSMS(clinic.id)}
                          className="inline-flex items-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Send SMS
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

//HERE IS HOW useEffect,useCallback,debounce work together

// import React, { useState, useEffect, useCallback } from "react";
// import debounce from "lodash.debounce";

// const App = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   // Debounce the API call
//   const fetchResults = debounce((term) => {
//     console.log("Fetching results for:", term);
//     // API call here
//   }, 300);

//   // Stable callback for useEffect
//   const handleSearch = useCallback(
//     (term) => {
//       fetchResults(term);
//     },
//     [fetchResults]
//   );

//   useEffect(() => {
//     if (searchTerm) {
//       handleSearch(searchTerm);
//     }
//   }, [searchTerm, handleSearch]); // Reacts to searchTerm changes

//   return (
//     <input
//       type="text"
//       placeholder="Search..."
//       onChange={(e) => setSearchTerm(e.target.value)}
//     />
//   );
// };
