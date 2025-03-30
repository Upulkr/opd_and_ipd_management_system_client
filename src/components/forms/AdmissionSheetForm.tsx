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
import { useAuthStore } from "@/stores/useAuth";
import { useAdmissionSheetByBHT } from "@/stores/useAdmissionSheet";
import { usePatientStore } from "@/stores/usePatientStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
  livingStatus: z.string(),
});

export const AdmissionSheetForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { patient } = usePatientStore((state) => state);

  const { admissionSheetByBHT } = useAdmissionSheetByBHT((state) => state);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bht:
        String(
          admissionSheetByBHT?.bht !== undefined ? admissionSheetByBHT?.bht : ""
        ) ||
        patient.bht ||
        "",
      nic: patient.nic || admissionSheetByBHT?.nic || " ",
      name: patient.name || admissionSheetByBHT?.name || " ",
      age: patient.age || admissionSheetByBHT?.age || " ",
      gender:
        (patient.gender as "Male" | "Female" | "Other") ||
        admissionSheetByBHT?.gender ||
        "Male",
      streetAddress:
        patient.streetAddress || admissionSheetByBHT?.streetAddress || " ",
      city: patient.city || admissionSheetByBHT?.city || " ",
      stateProvince:
        patient.stateProvince || admissionSheetByBHT?.stateProvince || " ",
      postalCode: patient.postalCode,
      country: patient.country || admissionSheetByBHT?.country || " ",
      phone: patient.phone || admissionSheetByBHT?.phone || " ",
      wardNo: patient.wardNo || admissionSheetByBHT?.wardNo || "",
      reason: patient.reason || admissionSheetByBHT?.reason || "",
      pressure: patient.pressure || admissionSheetByBHT?.pressure || "",
      weight: patient.weight || admissionSheetByBHT?.weight || "",
      livingStatus:
        patient.livingStatus || admissionSheetByBHT?.livingStatus || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await axios(`/api/admissionSheet`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify(values),
      });
      if (response.status === 201) {
        setIsLoading(false);
        toast.success("Admission Sheet Created");
        // form.reset();
        setIsLoading(false);
        await axios.put(`/api/wardBedsController/${values.wardNo}`);

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
                      disabled={admissionSheetByBHT?.bht}
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
                      disabled={admissionSheetByBHT?.nic}
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
                      disabled={admissionSheetByBHT?.name}
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
                      disabled={admissionSheetByBHT?.age}
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
                    disabled={admissionSheetByBHT?.gender}
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
                      disabled={admissionSheetByBHT?.phone}
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
                        disabled={admissionSheetByBHT?.streetAddress}
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
                        disabled={admissionSheetByBHT?.city}
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
                        disabled={admissionSheetByBHT?.stateProvince}
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
                        disabled={admissionSheetByBHT?.postalCode}
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
                        disabled={admissionSheetByBHT?.country}
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
                      placeholder="Ward Number"
                      disabled={admissionSheetByBHT?.wardNo}
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
                      disabled={admissionSheetByBHT?.pressure}
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
                      disabled={admissionSheetByBHT?.weight}
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
                    disabled={admissionSheetByBHT?.reason}
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
                isLoading || Object.keys(admissionSheetByBHT).length > 0
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
