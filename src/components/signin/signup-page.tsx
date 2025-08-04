import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import apiClient from "@/lib/apiClient";
import { AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

// Define the Role enum to match your Prisma model
enum Role {
  NURSE = "NURSE",
  DOCTOR = "DOCTOR",
  ADMIN = "ADMIN",
  PHARMACIST = "PHARMACIST",
}

// Define the form schema with Zod
const signupFormSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    phoneNumber: z.string().regex(/^\+?[0-9]\d{1,14}$/, {
      message: "Please enter a valid phone number",
    }),
    role: z.nativeEnum(Role),
    nic: z.string().min(1, { message: "NIC is required" }),
    registrationNumber: z
      .string()
      .min(1, { message: "Registration number is required" }),
    department: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Infer the type from the schema
type SignupFormValues = z.infer<typeof signupFormSchema>;

export default function SignupPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // Initialize the form with react-hook-form
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      role: Role.NURSE,
      nic: "",
      registrationNumber: "",
      department: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/auth/signup", values);

      if (response.status === 200) {
        setIsLoading(false);

        toast.success("Sign up Successful! Check your email to verify.");

        form.reset();

        const timeOut = setTimeout(() => {
          navigate("/log-in");
        }, 1000);
        return () => clearTimeout(timeOut); // Give 2 seconds for toast to show
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Error in Sign Up");
      }

      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Image container */}
      <div className="flex justify-center items-center w-full md:w-1/2 mb-8 md:mb-0">
        <img
          className="max-w-full max-h-[60vh] md:max-h-[80vh] object-contain"
          src="./log.png"
          alt="Your Company"
        />
      </div>

      {/* Form container */}
      <div className="flex flex-col justify-center w-full md:w-1/2">
        <ToastContainer />
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Repeat your FormField components as before */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={Role.NURSE}>Nurse</SelectItem>
                            <SelectItem value={Role.DOCTOR}>Doctor</SelectItem>
                            <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                            <SelectItem value={Role.PHARMACIST}>Pharmacist</SelectItem>
                          </SelectContent>
                        </Select>
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
                  <FormField
                    control={form.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/log-in" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
