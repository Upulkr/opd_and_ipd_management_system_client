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
import { useAuthStore } from "@/stores/useAuth";

import { AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useUserProfileData } from "@/stores/useUserProfileData";
import apiClient from "@/lib/apiClient";

// --------------------------------------------------------------------------
// Schema Definition (Zod)
// --------------------------------------------------------------------------
// We define a strict schema for the login form.
// This ensures that we don't even bother sending a request to the server if the email is invalid.
const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

// Infer the Typescript type from the Zod Schema so our form values are strongly typed.
type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  // --------------------------------------------------------------------------
  // State & Hooks
  // --------------------------------------------------------------------------
  // Local state for UI feedback (loading spinner, error messages)
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Zustand Stores: These are our Global State managers.
  // unlike useState which is local to this component, these stores allow us to save data
  // that is accessible throughout the entire app (like the user's auth token or profile).
  const { setToken } = useAuthStore((state) => state);
  const { setUserProfileData } = useUserProfileData((state) => state);

  const navigate = useNavigate();

  // Initialize the form hook
  // We explicitly tell it to use our Zod schema for validation via the resolver.
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // --------------------------------------------------------------------------
  // Event Handlers
  // --------------------------------------------------------------------------
  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError("");

    try {
      // API call to the backend login endpoint
      const response = await apiClient.post("/auth/login", values);

      if (response.status === 200) {
        // Success!
        // 1. Save the token and role to our global Auth Store so we can make authenticated requests later.
        setToken(response.data.token, response.data.user.role);

        // 2. Save the user's profile details to our Data Store.
        setUserProfileData(response.data.user);

        console.log("token", response.data.token); // Debugging log
        toast.success("Login successful");

        form.reset();

        // 3. Navigate to the dashboard/home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error: any) {
      // Error Handling
      // 401 Unauthorized usually means wrong password/email combination.
      if (error.status === 401) {
        toast.error("Invalid email or password. Please try again.");
      }
      // Set a generic error message for the UI alert box
      setError("Invalid email or password. Please try again.");
    } finally {
      // Always turn off loading state, success or fail.
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
        Displays the company branding image. 
        Responsive layout: Stacked on mobile, side-by-side on desktop.
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
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Show an error alert if the login failed */}
            {error && (
              <Alert
                variant="destructive"
                className="mb-4 flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field with 'Forgot Password' Link */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link
                          to="/forgot-password"
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
