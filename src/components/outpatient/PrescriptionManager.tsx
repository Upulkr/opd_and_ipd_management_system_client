"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface Prescription {
  id: number;
  patientName: string;
  medication: string;
  dosage: string;
  frequency: string;
}

const initialPrescriptions: Prescription[] = [
  {
    id: 1,
    patientName: "John Doe",
    medication: "Aspirin",
    dosage: "100mg",
    frequency: "Once daily",
  },
  {
    id: 2,
    patientName: "Jane Smith",
    medication: "Amoxicillin",
    dosage: "500mg",
    frequency: "Twice daily",
  },
];

export function PrescriptionManager() {
  const [prescriptions, setPrescriptions] =
    useState<Prescription[]>(initialPrescriptions);
  const [newPrescription, setNewPrescription] = useState<
    Omit<Prescription, "id">
  >({
    patientName: "",
    medication: "",
    dosage: "",
    frequency: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPrescription((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPrescription = () => {
    setPrescriptions((prev) => [
      ...prev,
      { id: Date.now(), ...newPrescription },
    ]);
    setNewPrescription({
      patientName: "",
      medication: "",
      dosage: "",
      frequency: "",
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Prescription Manager</h2>
      <div className="flex space-x-2">
        <Input
          placeholder="Patient Name"
          name="patientName"
          value={newPrescription.patientName}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Medication"
          name="medication"
          value={newPrescription.medication}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Dosage"
          name="dosage"
          value={newPrescription.dosage}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Frequency"
          name="frequency"
          value={newPrescription.frequency}
          onChange={handleInputChange}
        />
        <Button onClick={handleAddPrescription}>Add Prescription</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Medication</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Frequency</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions?.map((prescription) => (
            <TableRow key={prescription.id}>
              <TableCell>{prescription.patientName}</TableCell>
              <TableCell>{prescription.medication}</TableCell>
              <TableCell>{prescription.dosage}</TableCell>
              <TableCell>{prescription.frequency}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
