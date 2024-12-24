import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toast } from "../ui/toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const formSchema = z.object({
  bht: z.number().int().positive(),
  nic: z.number().int().positive(),
  name: z.string().min(2).max(100),
  age: z.number().int().positive().max(150),
  gender: z.enum(["Male", "Female", "Other"]),
  streetAddress: z.string().min(5).max(100),
  city: z.string().min(2).max(50),
  stateProvince: z.string().min(2).max(50),
  postalCode: z.string().min(2).max(20),
  country: z.string().min(2).max(50),
  phone: z.number().int().positive(),
  wardNo: z.number().int().positive(),
  reason: z.string().min(5).max(500),
  pressure: z.number().int().positive(),
  weight: z.number().positive(),
});

export const AdmissionSheetForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bht: 0,
      nic: 0,
      name: "",
      age: 0,
      gender: "Male",
      streetAddress: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      country: "",
      phone: 0,
      wardNo: 0,
      reason: "",
      pressure: 0,
      weight: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Here you would typically send the data to your backend
    // For demonstration, we'll just simulate an API call
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    Toast({
      title: "Admission Registered",
      // description: "The patient has been successfully admitted.",
    });

    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="bht"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-700 font-bold">
                  BHT Number
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="BHT Number"
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
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
                <FormLabel className="text-blue-700 font-bold">NIC</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="NIC"
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
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
                <FormLabel className="text-blue-700 font-bold">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
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
                <FormLabel className="text-blue-700 font-bold">Age</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Age"
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
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
                <FormLabel className="text-blue-700 font-bold">
                  Gender
                </FormLabel>
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
                <FormLabel className="text-blue-700 font-bold">Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
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
                  <FormLabel className="text-blue-700 font-bold">
                    Street Address
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Street Address" {...field} />
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
                  <FormLabel className="text-blue-700 font-bold">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
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
                  <FormLabel className="text-blue-700 font-bold">
                    State/Province
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="State/Province" {...field} />
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
                  <FormLabel className="text-blue-700 font-bold">
                    Postal Code
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Postal Code" {...field} />
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
                  <FormLabel className="text-blue-700 font-bold">
                    Country
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Country" {...field} />
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
                <FormLabel className="text-blue-700 font-bold">
                  Ward Number
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ward Number"
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
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
                <FormLabel className="text-blue-700 font-bold">
                  Blood Pressure
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Blood Pressure"
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
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
                <FormLabel className="text-blue-700 font-bold">
                  Weight (kg)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Weight in kg"
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
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
              <FormLabel className="text-blue-700 font-bold">
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
  );
};

export default AdmissionSheetForm;
