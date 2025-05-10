"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useDrugsStore } from "@/stores/useDrugsStore";
const formSchema = z.object({
  drugName: z.string().min(2, {
    message: "Drug name must be at least 2 characters.",
  }),
  unit: z.enum(
    [
      "ml",
      "L",
      "mg",
      "g",
      "kg",
      "mcg",
      "tablet",
      "capsule",
      "ampule",
      "vial",
      "suppository",
      "patch",
      "drop",
      "spray",
      "unit",
      "iu",
    ],
    {
      required_error: "Please select a unit.",
    }
  ),
  totalQuantity: z.number().int().positive().optional(),
  usedQuantity: z.number().int().nonnegative().optional(),
  remainingQuantity: z.number().int().nonnegative().optional(),
  expiryDate: z
    .date({
      required_error: "Expiry date is required.",
    })
    .optional(),
});

export function AddNewDrugFormpage() {
  const [isLoading, setIsLoading] = useState(false);
  const { drugs, setDrugs } = useDrugsStore((state) => state);
  const { drugId } = useParams();
  console.log("drugId", typeof drugId);
  const navigate = useNavigate();

  const drugTobeUpdate = drugs.filter(
    (drug) => drug.drugId.toString() === drugId
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugName: drugTobeUpdate[0]?.drugName || "",
      unit: drugTobeUpdate[0]?.unit as
        | z.infer<typeof formSchema>["unit"]
        | undefined,
      totalQuantity: drugTobeUpdate[0]?.totalQuantity || undefined,
      usedQuantity: drugTobeUpdate[0]?.usedQuantity || 0,
      remainingQuantity: drugTobeUpdate[0]?.remainingQuantity || 0,
      expiryDate: drugTobeUpdate[0]?.expiryDate || undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      setIsLoading(true);
      if (drugTobeUpdate[0]?.drugId) {
        const response = await axios.put(
          `/api/drugs/${drugTobeUpdate[0].drugId}`,
          values
        );
        if (response.status === 200) {
          setDrugs([]);
          setTimeout(() => {
            setIsLoading(false);

            toast.success(`Successfully updated ${values.drugName}`);
            form.reset();
          }, 5000);

          navigate("/pharmacy");
        } else {
          toast.error(`Failed to update ${values.drugName}`);
        }
      } else {
        const response = await axios("/api/drugs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify(values),
        });
        if (response.status === 200) {
          setTimeout(() => {
            setIsLoading(false);

            toast.success(`Successfully added ${values.drugName}`);
            form.reset();
          }, 5000);

          navigate("/pharmacy");
        }
      }
    } catch (error: any) {
      setIsLoading(false);

      if (error.status === 400) {
        toast.error(`Failed to add ${values.drugName} already exists`);
        return;
      } else if (error.status === 500) {
        toast.error(`Failed to add ${values.drugName}`);
        return;
      }
      console.log(error.message);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <ToastContainer />
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add Drug Details</CardTitle>
          <CardDescription>
            Enter the details of the new drug to add to the inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="drugName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drug Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter drug name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the drug to be added.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ml">ml (Milliliter)</SelectItem>
                        <SelectItem value="L">L (Liter)</SelectItem>
                        <SelectItem value="mg">mg (Milligram)</SelectItem>
                        <SelectItem value="g">g (Gram)</SelectItem>
                        <SelectItem value="kg">kg (Kilogram)</SelectItem>
                        <SelectItem value="mcg">mcg (Microgram)</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="capsule">Capsule</SelectItem>
                        <SelectItem value="ampule">Ampule</SelectItem>
                        <SelectItem value="vial">Vial</SelectItem>
                        <SelectItem value="suppository">Suppository</SelectItem>
                        <SelectItem value="patch">Patch</SelectItem>
                        <SelectItem value="drop">Drop</SelectItem>
                        <SelectItem value="spray">Spray</SelectItem>
                        <SelectItem value="unit">Unit</SelectItem>
                        <SelectItem value="iu">
                          IU (International Unit)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the unit of measurement for the drug.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter total quantity"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      The total quantity of the drug (optional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4  " />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-slate-300"
                        align="end"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date > new Date("2100-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The expiry date of the drug.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? drugTobeUpdate[0]
                    ? "Updating..."
                    : "Adding..."
                  : drugTobeUpdate[0]
                  ? "Update Drug"
                  : "Add Drug"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
