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

// --------------------------------------------------------------------------
// Enums & Constants
// --------------------------------------------------------------------------
// Define the Role enum to match your Prisma model.
// Using an enum specifically ensures we only ever send valid database values.
enum Role {
  NURSE = "NURSE",
  DOCTOR = "DOCTOR",
  ADMIN = "ADMIN",
  PHARMACIST = "PHARMACIST",
}

// --------------------------------------------------------------------------
// Schema Definition (Zod)
// --------------------------------------------------------------------------
// Zod allows us to create a "schema" - a blueprint of what our data MUST look like.
// This handles all the nitty-gritty validation logic (regex, min length, email format) separately from the UI.
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
    // Regex explanation: ^\+? means optional +, [0-9]\d{1,14}$ means 1-15 digits.
    phoneNumber: z.string().regex(/^\+?[0-9]\d{1,14}$/, {
      message: "Please enter a valid phone number",
    }),
    role: z.nativeEnum(Role), // Forces value to be one of our Role enum options
    nic: z.string().min(1, { message: "NIC is required" }),
    registrationNumber: z
      .string()
      .min(1, { message: "Registration number is required" }),
    department: z.string().optional(),
  })
  // .refine() lets us add custom cross-field validation logic (like password matching)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This points the error message to the confirmPassword field
  });

// Infer the TypeScript type directly from the Zod schema.
// This is magic! It means if we change the schema above, our Type definitions automatically update.
type SignupFormValues = z.infer<typeof signupFormSchema>;

export default function SignupPage() {
  // --------------------------------------------------------------------------
  // State & Hooks
  // --------------------------------------------------------------------------
  // useState hooks for managing local UI state
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // useNavigate hook allows us to programmatically change routes (URL)
  const navigate = useNavigate();

  // Initialize the form with react-hook-form and connect it to Zod using zodResolver.
  // This bridges the gap: React Hook Form handles the inputs, Zod handles the validation rules.
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

  // --------------------------------------------------------------------------
  // Event Handlers
  // --------------------------------------------------------------------------
  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true); // Disable the button so they can't spam click
    setError("");

    try {
      // Send the data to our backend API
      const response = await apiClient.post("/auth/signup", values);

      if (response.status === 200) {
        setIsLoading(false);

        // Success UX: Show a toast notification and redirect after a delay
        toast.success("Sign up Successful! Check your email to verify.");

        form.reset(); // Clear the form inputs

        // Redirect to login page after 1.5 seconds so they can read the toast message
        const timeOut = setTimeout(() => {
          navigate("/log-in");
        }, 15000); // 15 seconds seems long, might want to check if 1500 (1.5s) was intended?
        return () => clearTimeout(timeOut);
      }
    } catch (error: any) {
      setIsLoading(false);
      // Backend usually sends 400 Bad Request for validation errors
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Error in Sign Up");
      }

      setError("Failed to create account. Please try again.");
    } finally {
      // Ensure loading state is turned off even if something crashes
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // Rendering
  // --------------------------------------------------------------------------
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* 
        Image container 
        Using flexbox to center the image. 
        Hidden or stacked on smaller screens (flex-col), side-by-side on md+ screens.
      */}
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
            {/* Conditional Rendering: Only show the Alert component if there is an error string */}
            {error && (
              <Alert
                variant="destructive"
                className="mb-4 flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* 
               The Form component wraps everything to provide context to nested FormFields.
               We pass the 'form' object we created with useForm() earlier.
            */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Grid layout: 1 column on mobile (grid-cols-1), 2 columns on tablet+ (sm:grid-cols-2) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* --- EMAIL FIELD --- */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          {/* {...field} spreads all necessary handlers (onChange, onBlur, value) */}
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* --- USERNAME FIELD --- */}
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

                  {/* --- PASSWORD FIELD --- */}
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

                  {/* --- CONFIRM PASSWORD FIELD --- */}
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

                  {/* --- PHONE NUMBER FIELD --- */}
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

                  {/* --- ROLE SELECTOR --- */}
                  {/* Using shadcn/ui Select component wrapped in form control */}
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
                            <SelectItem value={Role.PHARMACIST}>
                              Pharmacist
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* --- NIC FIELD --- */}
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

                  {/* --- REGISTRATION NUMBER FIELD --- */}
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

                  {/* --- DEPARTMENT FIELD (OPTIONAL) --- */}
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

                {/* Submit Button */}
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
