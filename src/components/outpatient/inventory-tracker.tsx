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

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

const initialInventory: InventoryItem[] = [
  { id: 1, name: "Disposable Gloves", quantity: 1000, unit: "pairs" },
  { id: 2, name: "Surgical Masks", quantity: 500, unit: "pieces" },
  { id: 3, name: "Alcohol Swabs", quantity: 2000, unit: "pieces" },
];
export const InventoryTracker = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, "id">>({
    name: "",
    quantity: 0,
    unit: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));
  };

  const handleAddItem = () => {
    setInventory((prev) => [...prev, { id: Date.now(), ...newItem }]);
    setNewItem({ name: "", quantity: 0, unit: "" });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Inventory Tracker</h2>
      <div className="flex space-x-2">
        <Input
          placeholder="Item Name"
          name="name"
          value={newItem.name}
          onChange={handleInputChange}
        />
        <Input
          type="number"
          placeholder="Quantity"
          name="quantity"
          value={newItem.quantity}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Unit"
          name="unit"
          value={newItem.unit}
          onChange={handleInputChange}
        />
        <Button onClick={handleAddItem}>Add Item</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTracker;
