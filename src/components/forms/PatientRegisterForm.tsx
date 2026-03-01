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

// ----------------------------------------------------------------------
// Form Schema Validation (Zod)
// ----------------------------------------------------------------------
// This defines the structure and validation rules for the Patient Registration form.
// We use Zod to enforce strict types and custom error messages.
const formSchema = z.object({
  // NIC must be at least 9 characters long (standard length)
  nic: z.string().min(9, { message: "NIC is required." }),
  name: z.string().min(2, { message: "Name is required." }),
  age: z.string().min(1, { message: "Age is required." }),
  // Enum ensures the gender is strictly "Male", "Female", or "Other"
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required.",
  }),
  streetAddress: z.string().min(2, { message: "Street Address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  stateProvince: z.string().min(2, { message: "State/Province is required." }),
  // Postal code validation with min and max length constraints
  postalCode: z
    .string()
    .min(2, { message: "Postal Code is required." })
    .max(20),
  country: z.string().min(2, { message: "Country is required." }),
  phone: z.string().min(9, { message: "Phone number is required." }),
  livingStatus: z.string().min(2, { message: "Living Status is required." }),
});

export const PatientRegisterForm = () => {
  // ----------------------------------------------------------------------
  // Hooks & Global State
  // ----------------------------------------------------------------------
  const navigate = useNavigate();
  // Local loading state to disable buttons during API submission
  const [isLoading, setIsLoading] = useState(false);

  // Zustand store properties:
  // - patientNic: Might be pre-set from a search or previous step
  // - setPatient: Action to update the global patient state after successful creation
  const { patientNic, setPatient } = usePatientStore((state) => state);

  // Auth token needed for protected API calls
  const token = useAuthStore((state) => state.token);

  // Frontend component state to control navigation behavior
  const { navigateOutPatientPage, IsNAvigateToOutPatientPage } =
    useFrontendComponentsStore((state) => state);

  // ----------------------------------------------------------------------
  // Form Initialization
  // ----------------------------------------------------------------------
  // We initialize useForm with the Zod resolver to connect our schema.
  // defaultValues are set to empty strings or potentially pre-filled data like 'patientNic'.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nic: patientNic?.trim() || "", // Autofill NIC if available in store
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

  // ----------------------------------------------------------------------
  // Form Submission Handler
  // ----------------------------------------------------------------------
  // This function is called only if the Zod validation passes.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true); // Start loading state

      // Send POST request to create a new patient record
      const createPatient = await apiClient.post("/patient", values, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach JWT for authentication
        },
      });

      // Handle Success
      if (createPatient.status === 200) {
        // Update global store with the newly created patient data
        setPatient(createPatient.data.newPatient);

        toast.success("Patient created successfully");

        // Delay navigation slightly to let the user see the success toast
        setTimeout(() => {
          navigateOutPatientPage(true); // Flag that we are moving to outpatient page

          // Conditional Navigation:
          // If the flow directs to the Outpatient Register Page, go there with the NIC
          if (IsNAvigateToOutPatientPage) {
            navigate(
              `/admission-outpatient-register-page/${createPatient.data.newPatient.nic}`,
            );
          } else {
            // Otherwise, go to the generic Admission Sheet Register Page
            navigate("/admission-sheet-register-page");
          }
        }, 2500); // 2.5 second delay
      } else if (createPatient.status === 400) {
        // Handle specific API error for duplicate user
        toast.error("User already exists");
      }

      setIsLoading(false); // Stop loading state
    } catch (error: any) {
      // Extensive Error Handling
      if (error.response?.status === 400) {
        toast.error("Patient already exists");
      } else {
        toast.error("Error creating patient");
        console.log(error); // Log unexpected errors for debugging
      }
      setIsLoading(false);
    }
  }

  // ----------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------
  return (
    <>
      <ToastContainer />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full mx-auto  py-1"
        >
          {/* 
            Grid Layout: 
            Splits the form into a 2-column layout on medium screens (md:grid-cols-2) 
            and a single column on smaller screens.
          */}
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

          {/* Address Section */}
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

          {/* Submit Button */}
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
