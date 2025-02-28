"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

export default function EmailVerificationPage() {
  const { token } = useParams();
  console.log("token", token);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");

  const verifyEmail = async () => {
    try {
      const response = await axios.get(`/api/auth/verify-email/${token}`);
      if (response.status === 200) {
        setMessage(response.data.message);
        setIsVerified(true);
        toast.success("Email verified successfully!");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Invalid or expired link.");
      setIsVerified(false);
      toast.error("Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const called = useRef(false);

  useEffect(() => {
    if (!called.current && token) {
      called.current = true;
      verifyEmail();
    } else {
      setIsLoading(false);
      toast.error("Invalid or expired link.");
    }
  }, []);

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
          {isLoading && !isVerified ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-muted-foreground">Verifying your email...</p>
            </div>
          ) : isVerified && isLoading === false ? (
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
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.2, 1],
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
          <Button
            onClick={() => (window.location.href = "/log-in")}
            className="w-full"
            disabled={isLoading}
          >
            {isVerified ? "Go to Login" : "Back to Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
