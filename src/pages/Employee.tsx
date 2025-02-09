"use client";

import * as React from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  UserCircle,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StaffMember = {
  id: number;
  registrationNumber: string;
  role: "doctor" | "nurse" | "pharmacist";
  ward?: string;
};

type Ward = {
  id: number;
  name: string;
};

// Simulated database of wards
const WARDS: Ward[] = [
  { id: 1, name: "Emergency" },
  { id: 2, name: "ICU" },
  { id: 3, name: "Pediatrics" },
  { id: 4, name: "Surgery" },
  { id: 5, name: "Cardiology" },
];

export default function AdminDashboard() {
  const [staff, setStaff] = React.useState<StaffMember[]>([]);
  const [newStaffRegistration, setNewStaffRegistration] = React.useState("");
  const [newStaffRole, setNewStaffRole] =
    React.useState<StaffMember["role"]>("doctor");
  const [newStaffWard, setNewStaffWard] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<StaffMember[]>([]);

  const assignStaffMember = () => {
    if (newStaffRegistration && newStaffRole) {
      const newStaff: StaffMember = {
        id: Date.now(),
        registrationNumber: newStaffRegistration,
        role: newStaffRole,
        ward: newStaffWard || undefined,
      };
      setStaff([...staff, newStaff]);
      setNewStaffRegistration("");
      setNewStaffRole("doctor");
      setNewStaffWard("");
    }
  };

  const assignToWard = (staffId: number, wardName: string) => {
    setStaff(
      staff.map((s) => (s.id === staffId ? { ...s, ward: wardName } : s))
    );
  };

  const removeFromWard = (staffId: number) => {
    setStaff(
      staff.map((s) => (s.id === staffId ? { ...s, ward: undefined } : s))
    );
  };

  const deleteStaffMember = (staffId: number) => {
    setStaff(staff.filter((s) => s.id !== staffId));
  };

  const getWardStats = () => {
    return WARDS.map((ward) => ({
      ...ward,
      doctors: staff.filter((s) => s.ward === ward.name && s.role === "doctor")
        .length,
      nurses: staff.filter((s) => s.ward === ward.name && s.role === "nurse")
        .length,
    }));
  };

  const searchStaff = () => {
    const results = staff.filter((s) =>
      s.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const StaffTable = ({ role }: { role: StaffMember["role"] }) => {
    const [showAll, setShowAll] = React.useState(false);
    const filteredStaff = staff.filter((s) => s.role === role);
    const displayStaff = showAll ? filteredStaff : filteredStaff.slice(0, 4);

    return (
      <div>
        <div className="max-h-80 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration Number</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayStaff.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.registrationNumber}</TableCell>
                  <TableCell>{s.ward || "Not assigned"}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="mr-2">
                          <UserCircle className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Staff Profile</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                          <p>
                            <strong>Registration Number:</strong>{" "}
                            {s.registrationNumber}
                          </p>
                          <p>
                            <strong>Role:</strong> {s.role}
                          </p>
                          <p>
                            <strong>Ward:</strong> {s.ward || "Not assigned"}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {role !== "pharmacist" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="mr-2">
                            <Edit className="h-4 w-4 mr-2" />
                            Assign
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign to Ward</DialogTitle>
                          </DialogHeader>
                          <Select
                            onValueChange={(value) => assignToWard(s.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a ward" />
                            </SelectTrigger>
                            <SelectContent>
                              {WARDS.map((ward) => (
                                <SelectItem key={ward.id} value={ward.name}>
                                  {ward.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </DialogContent>
                      </Dialog>
                    )}
                    {s.ward && role !== "pharmacist" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromWard(s.id)}
                        className="mr-2"
                      >
                        Remove from Ward
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteStaffMember(s.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredStaff.length > 4 && (
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            className="mt-4 w-full"
          >
            {showAll ? "Show Less" : "View More"}
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${
                showAll ? "rotate-180" : ""
              }`}
            />
          </Button>
        )}
      </div>
    );
  };

  const StaffCounter = ({ role, count }: { role: string; count: number }) => (
    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
      <span className="text-sm font-medium">{role}</span>
      <span className="text-2xl font-bold">{count}</span>
    </div>
  );

  const SearchComponent = () => (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Search Assignment</h2>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter registration number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={searchStaff}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      {searchResults.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Search Results:</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration Number</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Ward</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchResults.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.registrationNumber}</TableCell>
                  <TableCell>{s.role}</TableCell>
                  <TableCell>{s.ward || "Not assigned"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Hospital Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StaffCounter role="Total Staff" count={staff.length} />
        <StaffCounter
          role="Doctors"
          count={staff.filter((s) => s.role === "doctor").length}
        />
        <StaffCounter
          role="Nurses"
          count={staff.filter((s) => s.role === "nurse").length}
        />
        <StaffCounter
          role="Pharmacists"
          count={staff.filter((s) => s.role === "pharmacist").length}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Staff Management</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchComponent />
            <Tabs defaultValue="doctors" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="doctors">Doctors</TabsTrigger>
                <TabsTrigger value="nurses">Nurses</TabsTrigger>
                <TabsTrigger value="pharmacists">Pharmacists</TabsTrigger>
              </TabsList>
              <TabsContent value="doctors">
                <StaffTable role="doctor" />
              </TabsContent>
              <TabsContent value="nurses">
                <StaffTable role="nurse" />
              </TabsContent>
              <TabsContent value="pharmacists">
                <StaffTable role="pharmacist" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Assign Staff Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                assignStaffMember();
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={newStaffRegistration}
                  onChange={(e) => setNewStaffRegistration(e.target.value)}
                  placeholder="Enter registration number"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newStaffRole}
                  onValueChange={(value: StaffMember["role"]) =>
                    setNewStaffRole(value)
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="pharmacist">Pharmacist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ward">Ward (Optional)</Label>
                <Select value={newStaffWard} onValueChange={setNewStaffWard}>
                  <SelectTrigger id="ward">
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No Ward">No Ward</SelectItem>
                    {WARDS.map((ward) => (
                      <SelectItem key={ward.id} value={ward.name}>
                        {ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Assign Staff
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Ward Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ward Name</TableHead>
                <TableHead>Doctors Assigned</TableHead>
                <TableHead>Nurses Assigned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getWardStats().map((ward) => (
                <TableRow key={ward.id}>
                  <TableCell>{ward.name}</TableCell>
                  <TableCell>{ward.doctors}</TableCell>
                  <TableCell>{ward.nurses}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
