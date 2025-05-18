"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/stores/useAuth";
import { useStaffStore } from "@/stores/useStaffStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { set } from "date-fns";

import {
  ChevronDown,
  Edit,
  PlusCircle,
  Trash2,
  UserCircle,
} from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import * as z from "zod";
type StaffMember = {
  id: number;
  registrationId: string;
  role: string;
  ward?: string;
  nic?: string;
};

type Ward = {
  wardName: string;
};

// Simulated database of wards
const formSchema = z.object({
  id: z.number(),
  registrationId: z.string().min(1, "Registration ID is required"),
  role: z.string().min(1, "Role is required").optional(),
  ward: z.string().min(1, "Ward is required"),
});
export default function AdminDashboard() {
  const [wardsNames, setWardNames] = React.useState<Ward[]>([]);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<StaffMember[]>([]);
  const [fetchedStaff, setFetchedStaff] = React.useState<StaffMember[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { staffCount, setStaffCount } = useStaffStore((state) => state);
  const [deletingId, setDeletingId] = React.useState<number | undefined>(
    undefined
  );
  const token = useAuthStore((state) => state.token);
  const fetchStaff = async () => {
    try {
      // setLoading(true);
      const response = await apiClient.get("/staffwardassignment", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setFetchedStaff(response.data.staffAssignments);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching staff:", error);
    }
  };
  const getstaffCount = async () => {
    try {
      const response = await apiClient.get(
        "/staffwardassignment/getstaffcount",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setStaffCount(response.data.staffCountGroupByWard);
      }
    } catch (error) {
      console.error("Error fetching staff counts:", error);
    }
  };

  const getWardNames = async () => {
    try {
      const response = await apiClient.get("/warddetails/wardnames", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setWardNames(response.data);
      }
    } catch (error) {
      console.error("Error fetching staff counts:", error);
    }
  };
  React.useEffect(() => {
    fetchStaff();
    getstaffCount();
    getWardNames();
  }, []);

  const assignToWard = async (staffId: string, ward: string) => {
    try {
      setLoading(true);
      const response = await apiClient.put(
        `/staffwardassignment/${staffId}`,
        { ward },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Staff assigned successfully");
      }
    } catch (error) {
      console.error("Error assigning staff to ward:", error);
    }
  };

  const deleteStaffMember = async (staffId: number) => {
    try {
      setDeletingId(staffId);
      const response = await apiClient.delete(
        `/staffwardassignment/${staffId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setLoading(false);
        toast.success("Staff deleted successfully");
        setDeletingId(undefined);
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
                                {wardsNames.map((ward, index) => (
                                  <SelectItem key={index} value={ward.wardName}>
                                    {ward.wardName}
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
                        disabled={deletingId === s.id}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {deletingId === s.id ? "Deleting..." : "Delete"}
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
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: Date.now(),
      registrationId: "",
      role: undefined,
      ward: "", // ✅ same for ward if it's a <Select>
    },
  });

  async function handleAssignStaff(values: z.infer<typeof formSchema>) {
    // Prevent duplicate submissions
    if (loading) return;

    setLoading(true);

    try {
      // Make sure all values are present and valid
      if (!values.role || !values.ward || !values.registrationId) {
        throw new Error("Please fill all required fields");
      }

      const response = await apiClient.post("/staffwardassignment", values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success("Staff assigned successfully");

        // Clear form and reset states
        form.reset({
          id: Date.now(), // Generate a new ID for the next submission
          registrationId: "",
          role: undefined,
          ward: "",
        });
        navigate(0);
        // Important: Reset the submitted state to avoid validation messages showing up incorrectly
      }
    } catch (error: any) {
      console.error("Error assigning staff:", error);

      const errorMessage =
        error.response?.status === 500
          ? "Error saving Assignment"
          : error.response?.data?.error ||
            error.message ||
            "An unknown error occurred";

      toast.error(errorMessage);

      // Don't reset the form on validation errors so user can correct them
      if (error.response?.status !== 400) {
        // For server errors (not validation errors), keep the values but allow resubmission
        form.clearErrors();
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Hospital Admin Dashboard</h1>
      <ToastContainer />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StaffCounter
          role="Total Staff"
          count={staffCount?.reduce(
            (acc, curr) =>
              acc + curr.noofdoctors + curr.noofnurses + curr.noofpharmacist,
            0
          )}
        />
        <StaffCounter
          role="Doctors"
          count={staffCount?.reduce((acc, curr) => acc + curr.noofdoctors, 0)}
        />
        <StaffCounter
          role="Nurses"
          count={staffCount?.reduce((acc, curr) => acc + curr.noofnurses, 0)}
        />
        <StaffCounter
          role="Pharmacists"
          count={staffCount?.reduce(
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
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  // Check if form is already being processed
                  if (loading) {
                    e.preventDefault();
                    return;
                  }

                  // Let react-hook-form handle the submission
                  form.handleSubmit(handleAssignStaff)(e);
                }}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="registrationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={loading}
                          onChange={(e) => {
                            field.onChange(e);
                            if (e.target.value) {
                              form.clearErrors("registrationId");
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Clear any error on this field when user selects a value
                          form.clearErrors("role");
                        }}
                        value={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={
                              field.value ? "" : "text-muted-foreground"
                            }
                          >
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="nurse">Nurse</SelectItem>
                          <SelectItem value="pharmacist">Pharmacist</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ward"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ward</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Clear any error on this field when user selects a value
                          form.clearErrors("ward");
                        }}
                        value={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={
                              field.value ? "" : "text-muted-foreground"
                            }
                          >
                            <SelectValue placeholder="Select a Ward" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {wardsNames && wardsNames.length > 0 ? (
                            wardsNames.map((ward, i) => (
                              <SelectItem key={i} value={ward.wardName}>
                                {ward.wardName}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-wards" disabled>
                              No wards available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    !loading &&
                    !form.formState.isSubmitting &&
                    !form.formState.isValid
                  }
                  onClick={() => {
                    // If there are validation errors and we're not loading, prevent default and show errors
                    const formState = form.getValues();

                    if (
                      !formState.registrationId ||
                      !formState.role ||
                      !formState.ward
                    ) {
                      form.trigger(); // Trigger validation to show errors
                      // No need to prevent default as we want the form validation to run
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <span className="mr-2">⏳</span>
                      Assigning Staff...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Assign Staff
                    </>
                  )}
                </Button>
              </form>
            </Form>
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
              {staffCount.length > 0 ? (
                staffCount.map((detail, i) => (
                  <TableRow key={i + 1}>
                    <TableCell>{detail.ward}</TableCell>
                    <TableCell>{detail.noofdoctors}</TableCell>
                    <TableCell>{detail.noofnurses}</TableCell>
                    <TableCell>{detail.noofpharmacist}</TableCell>
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
