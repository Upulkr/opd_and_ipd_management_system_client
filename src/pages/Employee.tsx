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
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

type StaffMember = {
  id: number;
  registrationId: string;
  role: "doctor" | "nurse" | "pharmacist";
  ward?: string;
  nic?: string;
};

type StaffCount = {
  ward: string;
  noofdoctors: number;
  noofnurses: number;
  noofpharmacist: number;
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
  const [fetchedStaff, setFetchedStaff] = React.useState<StaffMember[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [staffCountsGroupByWard, setStaffCountsGroupByWard] = React.useState<
    StaffCount[]
  >([]);
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/staffwardassignment");
      if (response.status === 200) {
        setFetchedStaff(response.data.staffAssignments);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching staff:", error);
    }
  };
  const getStaffCountsGroupByWard = async () => {
    try {
      const response = await axios.get(
        "/api/staffwardassignment/getstaffcount"
      );

      if (response.status === 200) {
        setStaffCountsGroupByWard(response.data.staffCountGroupByWard);
      }
    } catch (error) {
      console.error("Error fetching staff counts:", error);
    }
  };
  React.useEffect(() => {
    fetchStaff();
    getStaffCountsGroupByWard();
  }, []);

  const assignStaffMember = () => {
    if (newStaffRegistration && newStaffRole) {
      const newStaff: StaffMember = {
        id: Date.now(),
        registrationId: newStaffRegistration,
        role: newStaffRole,
        ward: newStaffWard || undefined,
      };
      setStaff([newStaff]);
      setNewStaffRegistration("");
      setNewStaffRole("doctor");
      setNewStaffWard("");
    }
  };

  const assignToWard = async (staffId: string, ward: string) => {
    try {
      const response = await axios(`/api/staffwardassignment/${staffId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        data: { ward },
      });
      if (response.status === 200) {
        toast.success("Staff assigned successfully");
      }
    } catch (error) {
      console.error("Error assigning staff to ward:", error);
    }
  };

  const deleteStaffMember = async (staffId: number) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `/api/staffwardassignment/${staffId}`
      );
      if (response.status === 200) {
        setLoading(false);
        toast.success("Staff deleted successfully");
      }
    } catch (error: any) {
      setLoading(false);
      toast.error("Error deleting staff");
      console.error("Error deleting staff:", error);
    }
  };

  // const searchStaff = () => {
  //   const results =
  //     fetchedStaff.length > 0
  //       ? fetchedStaff?.filter((s) =>
  //           s.registrationId.toString().includes(searchQuery.toLowerCase())
  //         )
  //       : [];
  //   setSearchResults(results);
  // };

  const StaffTable = ({ role }: { role: StaffMember["role"] }) => {
    const [showAll, setShowAll] = React.useState(false);

    const filteredStaff =
      fetchedStaff.length > 0
        ? fetchedStaff?.filter((s) => s.role === role)
        : [];
    const displayStaff = showAll ? filteredStaff : filteredStaff.slice(0, 4);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      if (query.trim() === "") {
        setSearchResults([]); // Reset when input is cleared
      } else {
        const searchedStaff = fetchedStaff.filter((s) =>
          String(s.registrationId).includes(searchQuery)
        );
        setSearchResults(searchedStaff);
      }
    };

    return (
      <div>
        <div className="max-h-80 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration Number</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>
                  {" "}
                  <Input
                    id="id"
                    type="number"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search by registration number..."
                    min={1}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(searchResults.length > 0 ? searchResults : displayStaff).map(
                (s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.registrationId}</TableCell>
                    <TableCell>{s.role}</TableCell>

                    <TableCell>{s.ward || "Not assigned"}</TableCell>
                    <TableCell className="flex">
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
                              {s.registrationId}
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
                            <Button
                              variant="outline"
                              size="sm"
                              className="mr-2"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Assign
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign to Ward</DialogTitle>
                            </DialogHeader>
                            <Select
                              onValueChange={(value) =>
                                assignToWard(s.id.toString(), value)
                              }
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

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteStaffMember(s.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {loading ? "Deleting..." : "Delete"}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
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
    <div className="flex items-center space-x-3  p-4 bg-secondary rounded-lg">
      <span className="text-sm font-medium">{role}</span>
      <span className="text-2xl font-bold">{count}</span>
    </div>
  );

  // const SearchComponent = () => (
  //   <div className="mb-6">
  //     <h2 className="text-lg font-semibold mb-2">Search Assignment</h2>
  //     <div className="flex space-x-2">
  //       <Input
  //         type="text"
  //         placeholder="Enter registration number"
  //         value={searchQuery}
  //         onChange={(e) => setSearchQuery(e.target.value)}
  //       />
  //       <Button onClick={searchStaff}>
  //         <Search className="h-4 w-4 mr-2" />
  //         Search
  //       </Button>
  //     </div>
  //     {searchResults.length > 0 && (
  //       <div className="mt-4">
  //         <h3 className="text-md font-semibold mb-2">Search Results:</h3>
  //         <Table>
  //           <TableHeader>
  //             <TableRow>
  //               <TableHead>Registration Number</TableHead>
  //               <TableHead>Role</TableHead>
  //               <TableHead>Ward</TableHead>
  //             </TableRow>
  //           </TableHeader>
  //           <TableBody>
  //             {searchResults.map((s) => (
  //               <TableRow key={s.id}>
  //                 <TableCell>{s.registrationId}</TableCell>
  //                 <TableCell>{s.role}</TableCell>
  //                 <TableCell>{s.ward || "Not assigned"}</TableCell>
  //               </TableRow>
  //             ))}
  //           </TableBody>
  //         </Table>
  //       </div>
  //     )}
  //   </div>
  // );

  async function handleAssignStaff() {
    try {
      assignStaffMember();
      if (staff.length === 0) {
        toast.error("Please select a staff member to assign");
        return;
      }

      const { registrationId, ward, role } = staff[0];

      if (!registrationId || !ward || !role) {
        toast.error("Please fill all the fields");
        return;
      }

      const response = await axios("/api/staffwardassignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          registrationId,

          ward,
          role,
        },
      });
      if (response.status === 200) {
        toast.success("Staff assigned successfully");
      }
    } catch (error: any) {
      console.log("Error assigning staff", error);
      toast.error(
        error.response?.status === 500
          ? "Error saving Assignment"
          : `${error.response?.data.error}`
      );
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Hospital Admin Dashboard</h1>
      <ToastContainer />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StaffCounter
          role="Total Staff"
          count={staffCountsGroupByWard?.reduce(
            (acc, curr) =>
              acc + curr.noofdoctors + curr.noofnurses + curr.noofpharmacist,
            0
          )}
        />
        <StaffCounter
          role="Doctors"
          count={staffCountsGroupByWard?.reduce(
            (acc, curr) => acc + curr.noofdoctors,
            0
          )}
        />
        <StaffCounter
          role="Nurses"
          count={staffCountsGroupByWard?.reduce(
            (acc, curr) => acc + curr.noofnurses,
            0
          )}
        />
        <StaffCounter
          role="Pharmacists"
          count={staffCountsGroupByWard?.reduce(
            (acc, curr) => acc + curr.noofpharmacist,
            0
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Staff Management</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <SearchComponent /> */}

            <Tabs defaultValue="doctors" className="w-full">
              {searchResults.length === 0 && (
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="doctors">Doctors</TabsTrigger>
                  <TabsTrigger value="nurses">Nurses</TabsTrigger>
                  <TabsTrigger value="pharmacists">Pharmacists</TabsTrigger>
                </TabsList>
              )}
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
                handleAssignStaff();
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="registrationId">Registration Number</Label>
                <Input
                  id="registrationId"
                  value={newStaffRegistration}
                  onChange={(e) => setNewStaffRegistration(e.target.value)}
                  placeholder="Enter registration number"
                  required
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
                <Label htmlFor="ward">Ward </Label>
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
              <Button
                type="submit"
                className="w-full"
                disabled={
                  loading ||
                  !newStaffRegistration ||
                  !newStaffRole! ||
                  !newStaffWard
                }
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {loading ? "Assigning Staff" : "  Assign Staff"}
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
              {staffCountsGroupByWard.length > 0 ? (
                staffCountsGroupByWard.map((detail, i) => (
                  <TableRow key={i + 1}>
                    <TableCell>{detail.ward}</TableCell>
                    <TableCell>{detail.noofdoctors}</TableCell>
                    <TableCell>{detail.noofnurses}</TableCell>
                    <TableCell>{detail.noofpharmacists}</TableCell>
                  </TableRow>
                ))
              ) : (
                <p>No Staff Assigned </p>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
