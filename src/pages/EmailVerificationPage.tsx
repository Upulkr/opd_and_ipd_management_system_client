"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import apiClient from "@/lib/apiClient";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// MODULE: EmailVerificationPage
// PURPOSE: This component handles the final step of the user registration process.
//          It validates the verification token sent to the user's email address
//          via a backend API call.
// --------------------------------------------------------------------------

// Importing UI components from 'shadcn/ui' (Card, Button) for a consistent design system.
// 'framer-motion' is used for enhancing user experience with smooth animations.
// 'lucide-react' provides vector icons for visual feedback (success/error/loading).
// 'react-router-dom' manages navigation and parameter extraction.

export default function EmailVerificationPage() {
  // HOOK: useParams
  // Extracts the 'token' parameter from the URL route (e.g., /verify-email/:token).
  const { token } = useParams();

  // STATE MANAGEMENT
  // 'isLoading': Boolean flag to track the status of the asynchronous API call.
  // 'isVerified': Boolean flag to confirm if the email verification was successful.
  // 'message': String to store feedback messages (success or error) from the server.
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");

  // --------------------------------------------------------------------------
  // FUNCTION: verifyEmail
  // PURPOSE: Performs the actual verification logic.
  //          1. Sends a GET request to the backend with the token.
  //          2. Updates the UI state based on the response (Success/Failure).
  // ASYNC/AWAIT: Used to handle the Promise-based API request cleanly.
  // --------------------------------------------------------------------------
  const verifyEmail = async () => {
    try {
      // API Call: GET /auth/verify-email/:token
      const response = await apiClient.get(`/auth/verify-email/${token}`);

      // Condition: HTTP 200 OK indicates the token was valid and account is verified.
      if (response.status === 200) {
        setMessage(response.data.message);
        setIsVerified(true);
        toast.success("Email verified successfully!");
      }
    } catch (error: any) {
      // Error Handling: Capture response errors (e.g., 400 Bad Request, 404 Not Found).
      // If the backend sends a specific error message, we display it; otherwise, a generic fallback.
      setMessage(error.response?.data?.message || "Invalid or expired link.");
      setIsVerified(false);
      toast.error("Verification failed.");
    } finally {
      // Cleanup: Always turn off the loading spinner, regardless of success or failure.
      // This ensures the user is not stuck looking at a loading screen.
      setIsLoading(false);
    }
  };

  // REFERENCE: called
  // 'useRef' creates a mutable object which persists for the full lifetime of the component.
  // Here, we use it as a flag to prevent the 'useEffect' from running 'verifyEmail' twice,
  // which can happen in React.StrictMode during development (double invocation).
  const called = useRef(false);

  // EFFECT HOOK: Component Mounting
  // This hook runs automatically when the component mounts.
  // Logic:
  // 1. Check if 'verifyEmail' has already been called (using the ref).
  // 2. Check if a 'token' exists in the URL.
  // 3. If valid, mark as called and trigger the verification function.
  // 4. If invalid (no token), show an error immediately.
  useEffect(() => {
    if (!called.current && token) {
      called.current = true;
      verifyEmail();
    } else {
      // Edge Case: Logic handling for missing token scenarios (unlikely via route, but possible).
      setIsLoading(false);
      toast.error("Invalid or expired link.");
    }
  }, []);

  // --------------------------------------------------------------------------
  // RENDER LOGIC
  // Returns the JSX structure for the verification page.
  // Uses 'Conditional Rendering' (ternary operators) to switch between 3 states:
  // 1. LOADING: Shows a spinner icon.
  // 2. VERIFIED: Shows a success animation and message.
  // 3. ERROR: Shows an error icon and message.
  // --------------------------------------------------------------------------
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 w-full">
      <Card className="w-full max-w-md overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Email Verification
          </CardTitle>
          <CardDescription>Confirming your email address</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-8">
          {/* STATE 1: LOADING */}
          {isLoading && !isVerified ? (
            <div className="flex flex-col items-center space-y-4">
              {/* Loader2 is a standard spinner icon from Lucide React */}
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-muted-foreground">Verifying your email...</p>
            </div>
          ) : isVerified && isLoading === false ? (
            /* STATE 2: SUCCESS (Verified) */
            /* Using Framer Motion for entrance animations */
            <motion.div
              className="flex flex-col items-center space-y-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.6,
              }}
            >
              {/* Animated Inner Div for the Checkmark bounce effect */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0], // Keyframes for wiggle
                  scale: [1, 1.2, 1], // Keyframes for pulse
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CheckCircle className="h-20 w-20 text-green-500" />
              </motion.div>
              <p className="text-center font-medium text-xl">
                {message || "Email verified successfully!"}
              </p>
              <p className="text-center text-muted-foreground">
                You can now log in to your account
              </p>
            </motion.div>
          ) : (
            /* STATE 3: ERROR (Not Verified) */
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="text-center font-medium">{message}</p>
              <p className="text-center text-muted-foreground">
                The link may be invalid or expired
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t bg-muted/20 p-6">
          <Link to="/log-in">
            {" "}
            {/* Dynamic Button Text based on verification state */}
            <Button className="w-full" disabled={isLoading}>
              {isVerified ? "Go to Login" : "Back to Login"}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
