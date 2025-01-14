/* Previous imports remain the same */
import React, { useState, useEffect } from "react";
import { Search, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

// Previous data and state management code remains the same...
const clinics = [
  {
    id: 1,
    name: "BackPain",
    doctorName: "Dr. Smith",
    location: "Room106",
    sheduledAt: "2025-01-14T10:11:00.000Z",
    patientCount: 15,
  },
  {
    id: 2,
    name: "Physio",
    doctorName: "Dr. Johnson",
    location: "Room107",
    sheduledAt: "2025-01-14T11:00:00.000Z",
    patientCount: 8,
  },
];

const patients = [
  {
    id: 1,
    name: "John Doe",
    address: "123 Main St",
    phone: "555-0123",
    nic: "951234567V",
  },
  {
    id: 2,
    name: "Jane Smith",
    address: "456 Oak Ave",
    phone: "555-0456",
    nic: "982345678V",
  },
  {
    id: 3,
    name: "Bob Wilson",
    address: "789 Pine Rd",
    phone: "555-0789",
    nic: "957654321V",
  },
  {
    id: 4,
    name: "Alice Brown",
    address: "321 Elm St",
    phone: "555-0321",
    nic: "986543210V",
  },
];

export default function ClinicPage() {
  // Previous state and handlers remain the same...
  const [selectedClinic, setSelectedClinic] = useState("");
  const [searchNic, setSearchNic] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchPatients = async () => {
    const response = await axios.get(`http://localhost:8000/patient`);
  };
  useEffect(() => {
    if (searchNic) {
      const filtered = patients
        .filter((patient) =>
          patient.nic.toLowerCase().includes(searchNic.toLowerCase())
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
  }, [searchNic]);

  const handleNicSelect = (nic) => {
    setSearchNic(nic);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchNic("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSendSMS = (clinicId) => {
    // Implement your SMS sending logic here
    console.log(`Sending SMS to all patients in clinic ${clinicId}`);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
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
                  <SelectItem key={clinic.id} value={clinic.id.toString()}>
                    {clinic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="w-full md:w-auto">Assign Patient</Button>
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
                  <th className="px-4 py-2 text-left border-b">Clinic Name</th>
                  <th className="px-4 py-2 text-left border-b">Doctor</th>
                  <th className="px-4 py-2 text-left border-b">Location</th>
                  <th className="px-4 py-2 text-right border-b">
                    No. of Patients
                  </th>
                  <th className="px-4 py-2 text-left border-b">Time</th>
                  <th className="px-4 py-2 text-right border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clinics.map((clinic) => (
                  <tr key={clinic.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{clinic.name}</td>
                    <td className="px-4 py-2 border-b">{clinic.doctorName}</td>
                    <td className="px-4 py-2 border-b">{clinic.location}</td>
                    <td className="px-4 py-2 text-right border-b">
                      {clinic.patientCount}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {new Date(clinic.sheduledAt).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-2 text-right border-b">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
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
                                  {patients.map((patient) => (
                                    <tr
                                      key={patient.id}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-4 py-2 border-b">
                                        {patient.name}
                                      </td>
                                      <td className="px-4 py-2 border-b">
                                        {patient.address}
                                      </td>
                                      <td className="px-4 py-2 border-b">
                                        {patient.phone}
                                      </td>
                                      <td className="px-4 py-2 border-b">
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
