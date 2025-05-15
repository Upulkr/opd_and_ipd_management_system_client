import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { usePatientStore } from "@/stores/usePatientStore";
import { useNavigate } from "react-router-dom";
import { useFrontendComponentsStore } from "@/stores/useFrontendComponentsStore";
import { useAuthStore } from "@/stores/useAuth";
import apiClient from "@/lib/apiClient";

const formSchema = z.object({
  nic: z.string(),
  name: z.string(),
  age: z.string(),
  gender: z.enum(["Male", "Female", "Other"]),
  streetAddress: z.string(),
  city: z.string(),
  stateProvince: z.string(),
  postalCode: z.string().min(2).max(20),
  country: z.string(),
  phone: z.string(),
  livingStatus: z.string(),
});

export const PatientRegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { patientNic, setPatient } = usePatientStore((state) => state);
  const token = useAuthStore((state) => state.token);

  const { navigateOutPatientPage, IsNAvigateToOutPatientPage } =
    useFrontendComponentsStore((state) => state);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nic: (patientNic !== "" && patientNic) || " ",
      name: "",
      age: "",
      gender: "Male",

      city: "",
      stateProvince: "",
      postalCode: "",
      country: "",
      phone: "",

      streetAddress: "",
      livingStatus: "live",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const createPatient = await apiClient.post("/patient", values, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (createPatient.status === 200) {
        setPatient(createPatient.data.newPatient);

        toast.success("Patient created successfully");
        navigateOutPatientPage(true);
        if (IsNAvigateToOutPatientPage) {
          navigate("/admission-outpatient-register-page");
        } else {
          navigate("/admission-sheet-register-page");
        }
      } else if (createPatient.status === 400) {
        toast.error("User already exists");
      }

      setIsLoading(false);
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error("Patient already exists");
      } else {
        toast.error("Error creating patient");
        console.log(error);
      }
      setIsLoading(false);
    }
  }

  return (
    <>
      <ToastContainer />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full mx-auto  py-1"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="nic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" font-bold">NIC</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-gray-500"
                      placeholder="NIC"
                      {...field}
                    />
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
                  <FormLabel className=" font-bold">Name</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-gray-500"
                      placeholder="Full Name"
                      {...field}
                    />
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
                  <FormLabel className=" font-bold">Age</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-gray-500"
                      placeholder="Age"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" font-bold">Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
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
              name="livingStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Life status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ward">Live</SelectItem>

                      <SelectItem value="direct-admit">Death</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" font-bold">
                        Street Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border border-gray-500"
                          placeholder="Street Address"
                          {...field}
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
                      <FormLabel className=" font-bold">City</FormLabel>
                      <FormControl>
                        <Input
                          className="border border-gray-500"
                          placeholder="City"
                          {...field}
                        />
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
                      <FormLabel className=" font-bold">
                        State/Province
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border border-gray-500"
                          placeholder="State/Province"
                          {...field}
                        />
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
                      <FormLabel className=" font-bold">Postal Code</FormLabel>
                      <FormControl>
                        <Input
                          className="border border-gray-500"
                          placeholder="Postal Code"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" font-bold">Country</FormLabel>
                      <FormControl>
                        <Input
                          className="border border-gray-500"
                          placeholder="Country"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default PatientRegisterForm;
