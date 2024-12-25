"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface Person {
  id: number;
  name: string;
  age: number;
  contact: string;
}

const mockPersons: Person[] = [
  { id: 1, name: "John Doe", age: 35, contact: "+1 (555) 123-4567" },
  { id: 2, name: "Jane Smith", age: 28, contact: "+1 (555) 987-6543" },
  { id: 3, name: "Bob Johnson", age: 42, contact: "+1 (555) 246-8135" },
];

export function PersonSearchCard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<Person | null>(null);

  const handleSearch = () => {
    const result = mockPersons.find((person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResult(result || null);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Search Person</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        {searchResult && (
          <div className="mt-4">
            <h3 className="font-semibold">Search Result:</h3>
            <p>Name: {searchResult.name}</p>
            <p>Age: {searchResult.age}</p>
            <p>Contact: {searchResult.contact}</p>
          </div>
        )}
        {searchTerm && !searchResult && (
          <p className="mt-4 text-red-500">No person found with that name.</p>
        )}
      </CardContent>
    </Card>
  );
}
