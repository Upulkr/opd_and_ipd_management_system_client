"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuth";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const prescriptionSchema = z.object({
  medicationName: z.string().min(2, {
    message: "Medication name must be at least 2 characters.",
  }),
  dosage: z.string().min(1, {
    message: "Dosage is required.",
  }),
  frequency: z.string({
    required_error: "Please select a frequency.",
  }),
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  notes: z.string().optional(),
});

const formSchema = z.object({
  nic: z.string().min(1, { message: "NIC is required." }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.string().min(1, { message: "Age is required." }),
  phone: z.string().min(10, {
    message: "Contact number must be at least 10 characters.",
  }),
  streetAddress: z
    .string()
    .min(5, { message: "Street Address is required." })
    .optional(),
  city: z.string().min(2, { message: "City is required." }).optional(),
  stateProvince: z
    .string()
    .min(2, { message: "State/Province is required." })
    .optional(),
  postalCode: z
    .string()
    .min(5, { message: "Postal Code is required." })
    .optional(),
  description: z.string().optional(),

  prescriptions: z.array(prescriptionSchema).optional(),
});

export function AddOutpatientForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // const { patient, setPatient } = usePatientStore((state) => state);
  const token = useAuthStore((state) => state.token);
  const { id: nic, view, outPatientdescription } = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nic: "",
      name: "",
      age: "",
      phone: "",
      streetAddress: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      description: "",
      prescriptions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "prescriptions",
  });

  const getGeneralPatientDetailsByNic = async () => {
    try {
      const response = await apiClient.get(`/patient/${nic}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.Patient;
        form.setValue("nic", data.nic);
        form.setValue("name", data.name);
        form.setValue("age", data.age);
        form.setValue("phone", data.phone);
        form.setValue("streetAddress", data.streetAddress);
        form.setValue("city", data.city);
        form.setValue("stateProvince", data.stateProvince);
        form.setValue("postalCode", data.postalCode);
        form.setValue(
          "description",
          data.description || outPatientdescription === undefined
            ? "Not Provided"
            : outPatientdescription
        );

        form.setValue("prescriptions", data.prescriptions);
      } else {
        console.warn("No patient data found");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (nic) {
      getGeneralPatientDetailsByNic();
    }
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await apiClient.post("/outPatient", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success(
          "The outpatient has been successfully added to the system"
        );
        setIsLoading(false);
        form.reset();

        // Delay navigation to allow the toast to display
        setTimeout(() => {
          navigate("/outpatient-department");
        }, 4000); // 2 seconds delay
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error.status === 400) {
        toast.error(" Error. Please try again later.");
      }
    }
  }

  return (
    <Card className="w-full  ">
      <ToastContainer />
      <CardHeader>
        {/* <CardTitle>
          {outPatient.length > 0
            ? `OutPatient details NIC: ${}`
            : "Add Outpatient"}
        </CardTitle> */}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="nic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIC</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter NIC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stateProvince"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter state/province" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter postal code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any relevant medical details here..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include any relevant medical conditions, allergies, or
                      past treatments.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <h3 className="text-lg font-semibold mb-2">Prescriptions</h3>
                {fields.map((field, index) => (
                  <Card key={field.id} className="mb-4">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`prescriptions.${index}.medicationName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Medication Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter medication name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`prescriptions.${index}.dosage`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dosage</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 500mg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`prescriptions.${index}.frequency`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frequency</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="daily">Daily</SelectItem>
                                  <SelectItem value="twice_daily">
                                    Twice Daily
                                  </SelectItem>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="as_needed">
                                    As Needed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`prescriptions.${index}.startDate`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Start Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date < new Date() ||
                                      date > new Date("2100-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name={`prescriptions.${index}.notes`}
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any additional information or instructions"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="mt-2"
                        onClick={() => remove(index)}
                      >
                        <X className="w-4 h-4 mr-2" /> Remove Prescription
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() =>
                    append({
                      medicationName: "",
                      dosage: "",
                      frequency: "",
                      startDate: new Date(),
                      notes: "",
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Prescription
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex gap-4">
        {!view && (
          <Button
            type="submit"
            className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white mx-auto "
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Outpatient"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
