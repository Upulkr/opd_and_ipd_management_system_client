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
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/stores/useAuth";
import { useClinicStore } from "@/stores/useClinicStore";

import { usePatientStore } from "@/stores/usePatientStore";
import axios from "axios";

import debounce from "lodash.debounce";
import { MessageSquare, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

interface SMSScheduleRequest {
  phoneNumbers: string[];
  message: string;
  scheduleTime: string;
  jobId: string;
}

interface SMSScheduleResponse {
  message: string;
  jobId: string;
  scheduledTime: string;
  recipientCount: number;
}
// Previous data and state management code remains the same...
interface Suggestion {
  nic: string;
  name: string;
}

interface Patient {
  id: string;
  name: string;
  phone: string;
  city: string;
  nic: string;
}
export default function ClinicPage() {
  // Previous state and handlers remain the same...
  const [loading, setLoading] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState("");
  const [searchNic, setSearchNic] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [clinicsAssign, setClinicsAssign] = useState([]);
  const [clinincPAtients, setClinincPAtients] = useState<Patient[]>([]);
  const [smsPhoneNumbers, setSmsPhoneNumbers] = useState<string[]>([]);
  const { setPatient, patient: patients } = usePatientStore((state) => state);
  const { clinics } = useClinicStore((state) => state);
  const navigate=useNavigate();
  const token = useAuthStore((state) => state.token);
  console.log("smsPhoneNumbers", smsPhoneNumbers);
  console.log("clinics", clinics);
  console.log("selectedClinic", selectedClinic);

  const handlegetPatientDetailsByClinicName = async (clinicName: string) => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/clinicassigmnent/getPatientDetailsByClinicName/${clinicName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setLoading(false);
        setClinincPAtients(response.data.patientDetails);
        console.log("fetched patient details");
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Error fetching patient details", error);
    }
  };

  const handlePatientAssign = async () => {
    if (!selectedClinic || !searchNic) {
      toast.error("Please select a clinic and patient");
      return;
    }
    try {
      setLoading(true);
      const response = await apiClient.post(
        `/clinicassigmnent`,
        {
          nic: searchNic,
          clinicName: selectedClinic,
          clinicId: clinics.find((clinic) => clinic.name === selectedClinic)
            ?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        
        toast.success("Patient assigned successfully");
        setTimeout(() => {
          navigate(0);
        }, 3000);
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

  const getAllClinicAssigmentsForTable = useCallback(async () => {
    try {
      const response = await apiClient.get(
        `/clinicassigmnent/getallclinicassigmentsfortable`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        
        setClinicsAssign(response.data.clinicAssigments);
      }
    } catch (error) {
      console.log("Error fetching patients", error);
    }
  }, [token]);

  const fetchPatients = useCallback(async () => {
    try {
      const response = await apiClient.get(`/patient`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setPatient(response.data.Patients);
      }
    } catch (error) {
      console.log("Error fetching patients", error);
    }
  }, [token]);

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

  const scheduleNewSMS = async (smsData: SMSScheduleRequest) => {
    try {
      const response = await apiClient.post<SMSScheduleResponse>(
        "/sendsms/schedule-sms",
        smsData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Handle Axios specific errors
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(
            error.response.data.error || "Failed to schedule SMS"
          );
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error("No response received from server");
        } else {
          // Something happened in setting up the request
          throw new Error("Error setting up the request");
        }
      } else {
        // Handle non-Axios errors
        throw new Error("An unexpected error occurred");
      }
    }
  };

  // Example usage:
  const scheduleSMS = async (
    message: string,
    sheduledAt: string | Date,
    patientName: string,
    location: string
  ) => {
    try {
      console.log("clicking");
      setLoading(true);

      // Validate input type for `sheduledAt`
      if (typeof sheduledAt !== "string" && !(sheduledAt instanceof Date)) {
        throw new Error(
          `Invalid type for sheduledAt. Expected a string or Date, received: ${typeof sheduledAt}`
        );
      }

      const smsData = {
        phoneNumbers: ["+94720979028"],
        message: `Hello ${patientName}, your ${message} clinic is scheduled at ${sheduledAt} in ${location}, please be on time`,
        scheduleTime: new Date(Date.now()).toISOString(),
        jobId: `sms-${Date.now()}`, // Generate unique job ID
      };

      const result = await scheduleNewSMS(smsData);
      setSmsPhoneNumbers([]);
      console.log("SMS Scheduled successfully:", result);
    } catch (error) {
      setSmsPhoneNumbers([]);
      console.error(
        "Failed to schedule SMS:",
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setLoading(false);
    }
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
                {clinics.map((clinic) => (
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
                {clinicsAssign?.map((clinic: any, i) => (
                  <tr key={i} className="hover:bg-gray-50">
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handlegetPatientDetailsByClinicName(
                                  clinic.clinicName
                                )
                              }
                            >
                              View Patients
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
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
                                  {clinincPAtients.length > 0 &&
                                    clinincPAtients.map((patient: Patient) => (
                                      <tr
                                        key={patient.id}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="px-4 py-2 border-b text-center">
                                          {patient.name}
                                        </td>
                                        <td className="px-4 py-2 border-b text-center">
                                          {patient.phone}
                                        </td>{" "}
                                        <td className="px-4 py-2 border-b text-center">
                                          {patient.city}
                                        </td>
                                        <td className="px-4 py-2 border-b text-center">
                                          {patient.nic}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const phoneNumbers = clinincPAtients.map(
                              (patient) => patient.phone
                            );
                            setSmsPhoneNumbers(phoneNumbers);
                            scheduleSMS(
                              clinic.clinicName,
                              clinic.doctorName,
                              clinic.sheduledAt,
                              clinic.location
                            );
                          }}
                          className="inline-flex items-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          {loading ? "Sending SMS..." : "Send SMS"}
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
