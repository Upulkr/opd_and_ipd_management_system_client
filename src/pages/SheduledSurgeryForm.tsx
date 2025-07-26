"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/useAuth";

import apiClient from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
type Doctor = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
};
// Define the form schema using Zod
const surgeryFormSchema = z.object({
  patientName: z.string().min(2, {
    message: "Patient name must be at least 2 characters.",
  }),
  surgeryName: z.string().min(2, {
    message: "Surgery name must be at least 2 characters.",
  }),
  PatientNic: z.coerce.string({
    required_error: "Patient NIC is required.",
    invalid_type_error: "Patient NIC must be a number.",
  }),
  AssignedDoctor: z.string().min(2, {
    message: "Doctor name must be at least 2 characters.",
  }),
  ScheduledDate: z.string().min(1, "Scheduled date and time is required"),
  PatientPhonenUmber: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
});

type SurgeryFormValues = z.infer<typeof surgeryFormSchema>;

export default function SheduledSurgeryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const token = useAuthStore((state) => state.token);
  // Initialize the form
  const form = useForm<SurgeryFormValues>({
    resolver: zodResolver(surgeryFormSchema),
    defaultValues: {
      patientName: "",
      surgeryName: "",
      AssignedDoctor: "",
      PatientPhonenUmber: "",
      ScheduledDate: "",
      PatientNic: undefined,
    },
  });
  const editSurgery = async (surgeryId: string, data: SurgeryFormValues) => {
    try {
      const response = await apiClient.put(
        `/surgery/updatesurgeryschedule/${surgeryId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Surgery updated successfully");
        setTimeout(() => {
          navigate("/surgeries");
        }, 3000);
      } else {
        toast.error("Failed to update surgery");
      }


    } catch (error) {
      console.error("Error editing surgery:", error);
    }
  };
  const getSurgeryById = async () => {
    try {
      const response = await apiClient.get(`/surgery/getsurgerybyid/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const data = response.data;
        form.setValue("patientName", data.patientName);
        form.setValue("PatientNic", data.PatientNic);
        form.setValue("AssignedDoctor", data.AssignedDoctor);
        form.setValue("ScheduledDate", data.ScheduledDate);
        form.setValue("PatientPhonenUmber", data.PatientPhonenUmber);
        form.setValue("surgeryName", data.surgeryName);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };
  const getAlldoctors = async () => {
    try {
      const response = await apiClient.get("/getusers/getalldoctors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const data = response.data;
        setDoctors(data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };
  useEffect(() => {
    getAlldoctors();
    if (id) {
      getSurgeryById();
    }
  }, []);
  // Define submit handler
  async function onSubmit(data: SurgeryFormValues) {
    if (id) {
      await editSurgery(id, data);
      toast.success("Surgery updated successfully");
      navigate("/surgeries");
    } else {
      try {
        const response = await apiClient.post(
          "/surgery/createsurgeryschedule",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          toast.success("Surgery scheduled successfully");
          navigate("/surgeries");
        }
      } catch (error: any) {
        if (error.response.status === 400) {
          console.error("Bad request:", error.response.data.message);
          toast.error("PAtient alreday assigned to a surgery");
        }
        if (error.ststus === 404) {
          console.error("Patient not registered", error.response.data.message);
          toast.error(
            "Patient not registered ,Please register the patient first"
          );
          navigate("/registerPatient");
        } else {
          console.error(
            "Error scheduling surgery:",
            error.response.data.message
          );
          toast.error("Error scheduling surgery");
        }
      }
    }
  }
  return (
    <div className=" w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md lg:mt-24">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6">Schedule Surgery</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient Name Field */}
          <FormField
            control={form.control}
            name="patientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Patient NIC Field */}
          <FormField
            control={form.control}
            name="PatientNic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient NIC</FormLabel>
                <FormControl>
                  <Input placeholder="970550...v" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="surgeryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surgery Name</FormLabel>
                <FormControl>
                  <Input placeholder="Surgery" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Assigned Doctor Field */}
          <FormField
            control={form.control}
            name="AssignedDoctor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned Doctor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.username}>
                        {doctor.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Scheduled Date Field */}
          <FormField
            control={form.control}
            name="ScheduledDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scheduled Date and Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormDescription>
                  Select the date and time for the clinic
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Patient Phone Number Field */}
          <FormField
            control={form.control}
            name="PatientPhonenUmber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type={"submit"} className="w-full">
            {id ? "Update Surgery" : "Schedule Surgery"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
