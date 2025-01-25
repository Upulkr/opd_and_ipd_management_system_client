"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { useDrugsStore } from "@/stores/useDrugsStore";
import axios from "axios";

const wards = [
  "Pediatric Ward",
  "Surgical Ward",
  "Maternity Ward",
  "Intensive Care Unit",
  "General Ward",
];

const units = [
  "ml",
  "L",
  "mg",
  "g",
  "kg",
  "mcg",
  "tablet",
  "capsule",
  "ampule",
  "vial",
  "suppository",
  "patch",
  "drop",
  "spray",
  "unit",
  "iu",
];

type Allocation = {
  drugId: number;
  drugName: string;
  wardName: string;
  //   amount: number;
  totalQuantity: number;
  unit: string;
  dateGiven: Date;
  usedQuantity: number;
  createdAt: Date;
};

export default function DrugAllocation() {
  const { drugs } = useDrugsStore((state) => state);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedWardForDetails, setSelectedWardForDetails] = useState<
    string | null
  >(null);

  const filteredDrugs = drugs.filter((drug) =>
    drug.drugName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleAllocate = async () => {
    if (selectedDrug && selectedWard && quantity && selectedUnit) {
      const drug = drugs.find((d) => d.drugId.toString() === selectedDrug);
      if (drug) {
        try {
          await axios.post("http://localhost:8000/drugs/createdrugallocation", {
            drugId: drug.drugId,
            drugName: drug.drugName,
            totalQuantity: quantity,
            usedQuantity: 0,
            wardName: selectedWard,
            unit: selectedUnit,
          });
        } catch (error) {
          console.error("Error allocating drug:", error);
        }

        setSelectedDrug("");
        setSelectedWard("");
        setQuantity("");
        setSelectedUnit("");
      }
    }
  };

  const getAllocationByWard = async (wardName: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/drugs/getdrugallocationbywardname/${wardName}`
      );

      setAllocations(response.data.allocations);
    } catch (error) {
      console.error("Error fetching allocations:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Drug Allocation</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="relative"></div>
        <Select value={selectedDrug} onValueChange={setSelectedDrug}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a drug" />
          </SelectTrigger>
          <SelectContent>
            <Input
              type="text"
              placeholder="Search drugs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-[300px]"
            />
            {filteredDrugs.map((drug) => (
              <SelectItem key={drug.drugId} value={drug.drugId.toString()}>
                {drug.drugName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedWard} onValueChange={setSelectedWard}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a ward" />
          </SelectTrigger>
          <SelectContent>
            {wards.map((ward) => (
              <SelectItem key={ward} value={ward}>
                {ward}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-[120px]"
        />

        <Select value={selectedUnit} onValueChange={setSelectedUnit}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a unit" />
          </SelectTrigger>
          <SelectContent>
            {units.map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleAllocate}>Allocate</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {wards.map((ward) => (
          <Card
            key={ward}
            className={`cursor-pointer hover:shadow-lg transition-shadow ${
              selectedWardForDetails === ward ? "bg-blue-100" : ""
            }`}
            onClick={() => {
              setSelectedWardForDetails(ward);
              getAllocationByWard(ward);
            }}
          >
            <CardHeader>
              <CardTitle>{ward}</CardTitle>
            </CardHeader>
            {/* <CardContent>
              <p>
                {allocations.filter((a) => a.wardName === ward).length}{" "}
                allocations
              </p>
            </CardContent> */}
          </Card>
        ))}
      </div>

      {selectedWardForDetails && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedWardForDetails} - Drug Allocations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Drug Name</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Used Quantity</TableHead>

                  <TableHead>Date Given</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allocations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No allocations found
                    </TableCell>
                  </TableRow>
                ) : (
                  allocations
                    .filter(
                      (allocation) =>
                        allocation.wardName === selectedWardForDetails
                    )
                    .map((allocation, index) => (
                      <TableRow key={`${allocation.drugId}-${index}`}>
                        <TableCell>{allocation.drugName}</TableCell>
                        <TableCell>{allocation.unit}</TableCell>
                        <TableCell>{allocation.totalQuantity}</TableCell>
                        <TableCell>{allocation.usedQuantity}</TableCell>
                        <TableCell>
                          {new Date(allocation.createdAt).toLocaleString(
                            "en-US",
                            {
                              timeZone: "Asia/Colombo",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
