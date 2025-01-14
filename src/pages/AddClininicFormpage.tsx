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
import {
  Form,
  FormControl,
  FormDescription,
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
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Clinic name is required"),
  doctorName: z.string().min(1, "Doctor name is required"),
  location: z.enum(
    ["Room101", "Room102", "Room103", "Room104", "Room105", "Room106"],
    {
      required_error: "Please select a room.",
    }
  ),
  sheduledAt: z.string().min(1, "Scheduled date and time is required"),
});

export default function NewClinicForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      doctorName: "",
      location: undefined,
      sheduledAt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await axios("http://localhost:8000/clinic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(values),
      });
      if (response.status === 200) {
        setIsLoading(false);
        toast.success("New clinic created successfully");
        form.reset();
        setTimeout(() => {
          navigate("/clinic");
          toast.dismiss();
        }, 5000);
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error.response?.status === 400) {
        toast.error("Error creating clinic");
      }
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <ToastContainer />
      <CardHeader>
        <CardTitle>Create New Clinic</CardTitle>
        <CardDescription>Enter the details for the new clinic</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clinic Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter clinic name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doctorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter doctor name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Room101">Room 101</SelectItem>
                      <SelectItem value="Room102">Room 102</SelectItem>
                      <SelectItem value="Room103">Room 103</SelectItem>
                      <SelectItem value="Room104">Room 104</SelectItem>
                      <SelectItem value="Room105">Room 105</SelectItem>
                      <SelectItem value="Room106">Room 106</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sheduledAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduled Date and Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormDescription>
                    Select the date and time for the clinic
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Clinic"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
