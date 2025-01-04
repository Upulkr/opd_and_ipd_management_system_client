"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAdmissionSheetByBHT } from "@/stores/useAdmissionSheet";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
const formSchema = z.object({
  bht: z.string().min(1, "BHT is required"),
  nic: z.string().min(1, "NIC is required"),
  name: z.string().min(1, "Name is required"),
  dailyno: z.number().int().positive(),
  yearlyno: z.number().int().positive(),
  city: z.string().min(1, "City is required"),
  stateProvince: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  age: z.string().min(1, "Age is required"),
  admittedDate: z.string().min(1, "Admitted date is required"),
  reason: z.string().min(1, "Reason is required"),
  allergies: z.array(z.string()),
  transferCategory: z.enum(["ward", "hospital-to-hospital", "direct-admit"]),
  dischargeDate: z.string().optional(),
  phone: z.string().min(1, "Phone number is required"),
});

export const AdmissionBookForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { admissionSheetByBHT } = useAdmissionSheetByBHT((state) => state);
  const [noOfAdmissionSheetsperDay, setNoOfAdmissionSheetsperDay] = useState(0);
  const [noOfAdmissionSheetsperYear, setNoOfAdmissionSheetsperYear] =
    useState(0);
  // Fetching the number of admission sheets per day
  const fetchingNoOfAdmissionSheetsperDay = async () => {
    try {
      const fetchAdmissionSheetperDay = await axios.get(
        `http://localhost:8000/admissionSheet/noOfAdmissionSheetsperday`
      );
      setNoOfAdmissionSheetsperDay(
        Number(fetchAdmissionSheetperDay.data.NoOfAdmissionSheetsPerDay)
      );
    } catch (err: any) {
      console.error("Error fetching admission sheet", err);
    }
  };
  // Fetching the number of admission sheets per year
  const fetchingNoOfAdmissionSheetsperYear = async () => {
    try {
      const fetchAdmissionSheetperYear = await axios.get(
        `http://localhost:8000/admissionSheet/noOfAdmissionSheetsperyear`
      );
      setNoOfAdmissionSheetsperYear(
        Number(fetchAdmissionSheetperYear.data.NoOfAdmissionSheetsPerYear)
      );
    } catch (error: any) {
      console.log("Error fetching admission sheet", error);
    }
  };

  useEffect(() => {
    fetchingNoOfAdmissionSheetsperDay();
    fetchingNoOfAdmissionSheetsperYear();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bht: String(admissionSheetByBHT?.bht) || "",
      nic: admissionSheetByBHT?.nic || "",
      name: admissionSheetByBHT?.name || "",
      dailyno:
        (noOfAdmissionSheetsperDay > 0 && noOfAdmissionSheetsperDay) || 0,
      yearlyno:
        (noOfAdmissionSheetsperYear > 0 && noOfAdmissionSheetsperYear) || 0,
      city: admissionSheetByBHT?.city || "",
      stateProvince: admissionSheetByBHT?.stateProvince || "",
      postalCode: admissionSheetByBHT?.postalCode || "",
      country: admissionSheetByBHT?.country || "",
      streetAddress: admissionSheetByBHT?.streetAddress || "",
      phone: admissionSheetByBHT?.phone || "",
      age: admissionSheetByBHT?.age || "",
      admittedDate: admissionSheetByBHT?.createdAt
        ? format(new Date(admissionSheetByBHT.createdAt), "yyyy-MM-dd'T'HH:mm")
        : "",
      reason: admissionSheetByBHT?.reason || "",
      allergies: admissionSheetByBHT?.allergies || [],
      transferCategory: admissionSheetByBHT.transferCategory || "ward",
      dischargeDate: admissionSheetByBHT.dischargeDate || "",
    },
  });
  const { setValue } = form; // Access setValue function

  useEffect(() => {
    // After state change, update the form values
    if (noOfAdmissionSheetsperDay > 0) {
      setValue("dailyno", noOfAdmissionSheetsperDay);
    }
    if (noOfAdmissionSheetsperYear > 0) {
      setValue("yearlyno", noOfAdmissionSheetsperYear);
    }
  }, [noOfAdmissionSheetsperDay, noOfAdmissionSheetsperYear, setValue]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await axios(`http://localhost:8000/admissionbook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: values,
      });
      if (response.status === 201) {
        toast.success("Admission book submitted successfully");
      }
      setIsLoading(false);
      navigate("/inpatient-department");
    } catch (error: any) {
      if (error.response?.status === 500) {
        toast.error("Error submitting admission book");
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="bht"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BHT</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIC</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dailyno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daily No</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="yearlyno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yearly No</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="stateProvince"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel className=" font-bold">Phone</FormLabel>
                <FormControl>
                  <Input
                    className="border border-gray-500"
                    type="tel"
                    placeholder="Phone number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="admittedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admitted Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-full">
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-full space-y-4">
          <FormField
            control={form.control}
            name="allergies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allergies</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex-shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange([...field.value, ""])}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Allergy
                      </Button>
                    </div>
                    {field.value.map((allergy, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={allergy}
                          onChange={(e) => {
                            const newAllergies = [...field.value];
                            newAllergies[index] = e.target.value;
                            field.onChange(newAllergies);
                          }}
                          className="w-40"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            const newAllergies = field.value.filter(
                              (_, i) => i !== index
                            );
                            field.onChange(newAllergies);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-full md:col-span-1 space-y-4">
          <FormField
            control={form.control}
            name="transferCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Transfer Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a transfer category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ward">Ward</SelectItem>
                    <SelectItem value="hospital-to-hospital">
                      Hospital to Hospital
                    </SelectItem>
                    <SelectItem value="direct-admit">Direct Admit</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-full md:col-span-1 space-y-4">
          <FormField
            control={form.control}
            name="dischargeDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discharge Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-full flex justify-center">
          <Button
            type="submit"
            className="px-12 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AdmissionBookForm;
