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
import { usePatientStore } from "@/stores/usePatientStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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

const formSchema = z.object({
  bht: z.string(),
  nic: z.string(),
  name: z.string(),
  age: z.string(),
  gender: z.enum(["Male", "Female", "Other"]),
  streetAddress: z.string(),
  city: z.string(),
  stateProvince: z.string(),
  postalCode: z.string(),
  country: z.string(),
  phone: z.string(),
  wardNo: z.string(),
  reason: z.string(),
  pressure: z.string(),
  weight: z.string(),
  address: z.string(),
});

export const AdmissionSheetForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { patient } = usePatientStore((state) => state);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bht: "",
      nic: patient.nic || " ",
      name: patient.name || " ",
      age: "",
      gender: (["Male", "Female", "Other"].includes(patient.gender)
        ? patient.gender
        : "Male") as "Male" | "Female" | "Other",
      streetAddress: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      country: "",
      phone: patient.phone || " ",
      wardNo: "",
      reason: "",
      pressure: "",
      weight: "",
      address: patient.address || " ",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await axios(`http://localhost:8000/admissionSheet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(values),
      });
      if (response.status === 201) {
        setIsLoading(false);
        toast.success("Admission Sheet Created");
        // form.reset();
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (error) {
        toast.error("Error creating admission sheet");
        console.log(error);
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full mx-auto px-32 py-10"
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
                      className="border border-gray-500"
                      placeholder="BHT Number"
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
                    <FormLabel className=" font-bold">State/Province</FormLabel>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="wardNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" font-bold">Ward Number</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-gray-500"
                      placeholder="Ward Number"
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
                      className="border border-gray-500"
                      placeholder="Blood Pressure"
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
                      className="border border-gray-500"
                      placeholder="Weight in kg"
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
                  <Textarea placeholder="Reason for admission" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

export default AdmissionSheetForm;
