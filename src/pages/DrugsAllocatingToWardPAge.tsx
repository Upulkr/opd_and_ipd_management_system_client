"use client";

import React, { useState } from "react";
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

const wards = [
  "Pediatric Ward",
  "Surgical Ward",
  "Maternity Ward",
  "Intensive Care Unit",
  "General Ward",
];

const units = ["mg", "g", "ml", "tablets", "capsules"];

type Allocation = {
  drugId: number;
  drugName: string;
  ward: string;
  //   amount: number;
  quantity: number;
  unit: string;
  dateGiven: Date;
};

export default function DrugAllocation() {
  const { drugs } = useDrugsStore((state) => state);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  //   const [amount, setAmount] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedWardForDetails, setSelectedWardForDetails] = useState<
    string | null
  >(null);

  const filteredDrugs = drugs.filter((drug) =>
    drug.drugName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAllocate = () => {
    if (selectedDrug && selectedWard && quantity && selectedUnit) {
      const drug = drugs.find((d) => d.drugId.toString() === selectedDrug);
      if (drug) {
        setAllocations([
          ...allocations,
          {
            drugId: drug.drugId,

            drugName: drug.drugName,
            ward: selectedWard,
            quantity: drug.totalQuantity - parseFloat(quantity),
            unit: selectedUnit,
            dateGiven: new Date(), // Current date
          },
        ]);
        setSelectedDrug("");
        setSelectedWard("");
        // setAmount("");
        setQuantity("");
        setSelectedUnit("");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Drug Allocation</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="relative">
          {/* <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          /> */}
        </div>
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

        {/* <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-[120px]"
        /> */}

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
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedWardForDetails(ward)}
          >
            <CardHeader>
              <CardTitle>{ward}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {allocations.filter((a) => a.ward === ward).length} allocations
              </p>
            </CardContent>
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
                  <TableHead>Amount</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Date Given</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allocations
                  .filter(
                    (allocation) => allocation.ward === selectedWardForDetails
                  )
                  .map((allocation, index) => (
                    <TableRow key={`${allocation.drugId}-${index}`}>
                      <TableCell>{allocation.drugName}</TableCell>
                      {/* <TableCell>{allocation.amount}</TableCell> */}
                      <TableCell>{allocation.quantity}</TableCell>
                      <TableCell>{allocation.unit}</TableCell>
                      <TableCell>
                        {allocation.dateGiven.toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
