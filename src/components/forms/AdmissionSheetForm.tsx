import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAdmissionSheetByBHT } from "@/stores/useAdmissionSheet";
import { useAuthStore } from "@/stores/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
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
import apiClient from "@/lib/apiClient";

const formSchema = z.object({
  bht: z.string().min(3).max(100),
  nic: z.string().min(10).max(12),
  name: z.string().min(2).max(100),
  age: z.string().min(1).max(3),
  gender: z.enum(["Male", "Female", "Other"]),
  streetAddress: z.string(),
  city: z.string(),
  stateProvince: z.string(),
  postalCode: z.string(),
  country: z.string(),
  phone: z.string(),
  wardNo: z.string().min(1).max(100),
  reason: z.string().min(5).max(500),
  pressure: z.string().min(1).max(100),
  weight: z.string().min(1).max(100),
  livingStatus: z.string(),
});

export const AdmissionSheetForm = () => {
  const { bht = "", view = "", nic = "" } = useParams();
  console.log("nic", nic);
  const [isLoading, setIsLoading] = useState(false);
  // const { patient } = usePatientStore((state) => state);

  const { admissionSheetByBHT } = useAdmissionSheetByBHT((state) => state);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bht: "",
      nic: "",
      name: "",
      age: "",
      gender: "Male",
      streetAddress: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      country: "",
      phone: "",
      wardNo: "",
      reason: "",
      pressure: "",
      weight: "",
      livingStatus: "",
    },
  });

  const getPatientDataByNIC = async () => {
    try {
      const response = await apiClient.get(`/patient/${nic}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        form.setValue("nic", response.data.Patient.nic);
        form.setValue("name", response.data.Patient.name);
        form.setValue("age", response.data.Patient.age);
        form.setValue("gender", response.data.Patient.gender);
        form.setValue("streetAddress", response.data.Patient.streetAddress);
        form.setValue("city", response.data.Patient.city);
        form.setValue("stateProvince", response.data.Patient.stateProvince);
        form.setValue("postalCode", response.data.Patient.postalCode);
        form.setValue("country", response.data.Patient.country);
        form.setValue("phone", response.data.Patient.phone);
      }
    } catch (erro: any) {
      if (erro.status === 404) {
        toast.error("Patient not found");
      }
      // navigate("/patient-register-form");
      console.error("Error fetching patient data by NIC", erro);
    }
  };

  const getAdmissionSheetByBHT = async () => {
    try {
      const reponse = await apiClient.get(`/admissionsheet/bht?bht=${bht}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (reponse.status === 200) {
        for (const [key, value] of Object.entries(
          reponse.data.admissionSheet
        )) {
          if (key in formSchema.shape) {
            form.setValue(
              key as keyof typeof formSchema.shape,
              value as string
            );
          }
        }
      }
    } catch (error: any) {
      console.error("Error fetching admission sheet by BHT", error);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await apiClient.post(`/admissionSheet`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        setIsLoading(false);
        toast.success("Admission Sheet Created");
        // form.reset();
        setIsLoading(false);
        await apiClient.put(`/wardbedscontroller/${values.wardNo}`, undefined, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        navigate("/inpatient-department");
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error) {
        if (error.response?.status === 400) {
          toast.error("Patient already exists");
          navigate("/admission-sheet-register-page");
        }

        toast.error("Error creating admission sheet");
        console.log(error);
      }
    }
  }
  useEffect(() => {
    if (bht !== "" && bht !== "undefined" && bht !== "null") {
      getAdmissionSheetByBHT();
    }
    if (nic !== "") {
      getPatientDataByNIC();
    }
  }, []);
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
              name="bht"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" font-bold">BHT Number</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-gray-500 disabled:text-black disabled:font-bold "
                      placeholder="BHT Number"
                      disabled={!!form.getValues("bht") && !nic}
                      {...field}
                    />
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
                  <FormLabel className=" font-bold">NIC</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-gray-500 disabled:text-black disabled:font-bold "
                      placeholder="NIC"
                      disabled={!!form.getValues("nic")}
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
                      className="border border-gray-500 disabled:text-black disabled:font-bold "
                      placeholder="Full Name"
                      disabled={!!form.getValues("name")}
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
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" font-bold">Age</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-gray-500 disabled:text-black disabled:font-bold "
                      placeholder="Age"
                      disabled={!!form.getValues("age")}
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
                    disabled={!!form.getValues("gender")}
                  >
                    <FormControl>
                      <SelectTrigger className="border border-gray-500 disabled:text-black disabled:font-bold ">
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
                      className="border border-gray-500 disabled:text-black disabled:font-bold "
                      type="tel"
                      placeholder="Phone number"
                      disabled={!!form.getValues("phone")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" font-bold">Street Address</FormLabel>
                    <FormControl>
                      <Input
                        className="border border-gray-500 disabled:text-black disabled:font-bold "
                        placeholder="Street Address"
                        disabled={!!form.getValues("streetAddress")}
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
                        className="border border-gray-500 disabled:text-black disabled:font-bold "
                        placeholder="City"
                        disabled={!!form.getValues("city")}
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
                    <FormLabel className=" font-bold">State/Province</FormLabel>
                    <FormControl>
                      <Input
                        className="border border-gray-500 disabled:text-black disabled:font-bold "
                        placeholder="State/Province"
                        disabled={!!form.getValues("stateProvince")}
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
                        className="border border-gray-500 disabled:text-black disabled:font-bold "
                        placeholder="Postal Code"
                        disabled={!!form.getValues("postalCode")}
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
                        className="border border-gray-500 disabled:text-black disabled:font-bold "
                        placeholder="Country"
                        disabled={!!form.getValues("country")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="wardNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" font-bold">Ward Number</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-gray-500 disabled:text-black disabled:font-bold "
                      placeholder="Ward Number ex: 12"
                      // disabled={!!form.getValues("wardNo")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pressure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" font-bold">Blood Pressure</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-gray-500 disabled:text-black disabled:font-bold "
                      placeholder="Blood Pressure"
                      // disabled={!!form.getValues("pressure")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" font-bold">Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-gray-500 disabled:text-black disabled:font-bold "
                      placeholder="Weight in kg"
                      // disabled={!!form.getValues("weight")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" font-bold">
                  Reason for Admission
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="border border-gray-500 disabled:text-black disabled:font-bold "
                    placeholder="Reason for admission"
                    disabled={!!form.getValues("reason") && !nic}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                isLoading ||
                Object.keys(admissionSheetByBHT).length > 0 ||
                view === "true"
              }
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
            >
              Submit
              {/* {isLoading
                ? enableUpdate
                  ? "Updating..."
                  : "Submitting..."
                : enableUpdate
                ? "Update"
                : "Submit"} */}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AdmissionSheetForm;
