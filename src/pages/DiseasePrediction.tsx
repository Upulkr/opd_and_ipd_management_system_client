import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Heart, Stethoscope } from "lucide-react";

const testTypes = [
  {
    id: "diabetes",
    title: "Diabetes Prediction",
    description: "Check diabetes risk factors",
    icon: Activity,
    color: "bg-blue-500",
    schema: z.object({
      glucose: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
      bloodPressure: z
        .string()
        .min(1, "Required")
        .regex(/^\d+$/, "Must be a number"),
      insulin: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
      bmi: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      age: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
    }),
  },
  {
    id: "heart",
    title: "Heart Disease Prediction",
    description: "Analyze cardiac health indicators",
    icon: Heart,
    color: "bg-red-500",
    schema: z.object({
      age: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
      bp: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
      cholesterol: z
        .string()
        .min(1, "Required")
        .regex(/^\d+$/, "Must be a number"),
      maxHr: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
      fastingBS: z
        .string()
        .min(1, "Required")
        .regex(/^\d+$/, "Must be a number"),
    }),
  },
  {
    id: "breastCancer",
    title: "Breast Cancer Prediction",
    description: "Evaluate breast cancer indicators",
    icon: Stethoscope,
    color: "bg-purple-500",
    schema: z.object({
      radius: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      texture: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      perimeter: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      area: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      smoothness: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
    }),
  },
];

const testFields = {
  diabetes: [
    {
      name: "glucose",
      label: "Glucose Level (mg/dL)",
      description: "Fasting blood glucose level",
    },
    {
      name: "bloodPressure",
      label: "Blood Pressure (mm Hg)",
      description: "Resting blood pressure",
    },
    {
      name: "insulin",
      label: "Insulin (mu U/ml)",
      description: "2-Hour serum insulin",
    },
    { name: "bmi", label: "BMI", description: "Body mass index" },
    { name: "age", label: "Age", description: "Patient's age" },
  ],
  heart: [
    { name: "age", label: "Age", description: "Patient's age" },
    {
      name: "bp",
      label: "Blood Pressure (mm Hg)",
      description: "Resting blood pressure",
    },
    {
      name: "cholesterol",
      label: "Cholesterol (mg/dL)",
      description: "Serum cholesterol",
    },
    {
      name: "maxHr",
      label: "Maximum Heart Rate",
      description: "Maximum heart rate achieved",
    },
    {
      name: "fastingBS",
      label: "Fasting Blood Sugar",
      description: "Fasting blood sugar level",
    },
  ],
  breastCancer: [
    {
      name: "radius",
      label: "Mean Radius",
      description: "Mean of distances from center to points on the perimeter",
    },
    {
      name: "texture",
      label: "Mean Texture",
      description: "Standard deviation of gray-scale values",
    },
    {
      name: "perimeter",
      label: "Mean Perimeter",
      description: "Mean size of the core tumor",
    },
    { name: "area", label: "Mean Area", description: "Mean area of the tumor" },
    {
      name: "smoothness",
      label: "Smoothness",
      description: "Local variation in radius lengths",
    },
  ],
};

export default function DiseasePrediction() {
  const [selectedTest, setSelectedTest] = useState<
    keyof typeof testFields | ""
  >("");
  const [showResult, setShowResult] = useState(false);
  const [prediction, setPrediction] = useState({ result: "", message: "" });

  const form = useForm({
    resolver: zodResolver(
      testTypes.find((t) => t.id === selectedTest)?.schema || z.object({})
    ),
  });

  const onSubmit = (data) => {
    const isPositive = Math.random() > 0.5;
    const results = {
      diabetes: {
        positive: {
          result: "High Risk Detected",
          message:
            "The analysis indicates a high risk of diabetes. Please consult a healthcare provider immediately for a complete evaluation.",
        },
        negative: {
          result: "Low Risk",
          message:
            "The analysis suggests a low risk of diabetes. Continue maintaining a healthy lifestyle and regular check-ups.",
        },
      },
      heart: {
        positive: {
          result: "Risk Factors Present",
          message:
            "Several heart disease risk factors have been detected. We recommend immediate consultation with a cardiologist.",
        },
        negative: {
          result: "Normal Results",
          message:
            "No significant heart disease risk factors detected. Maintain heart-healthy habits and regular check-ups.",
        },
      },
      breastCancer: {
        positive: {
          result: "Abnormal Findings",
          message:
            "The analysis has detected potential abnormal indicators. Please seek immediate medical consultation for further evaluation.",
        },
        negative: {
          result: "Normal Findings",
          message:
            "No concerning indicators detected in the analysis. Continue with regular screening as recommended.",
        },
      },
    };
    console.log(results.diabetes.positive);
    if (selectedTest) {
      setPrediction(
        isPositive
          ? results[selectedTest].positive
          : results[selectedTest].negative
      );
    }
    setShowResult(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Medical Prediction System</h1>
          <p className="text-gray-500">
            Select a test type to begin the analysis
          </p>
        </div>

        {!selectedTest ? (
          <div className="grid md:grid-cols-3 gap-6">
            {testTypes.map((test) => (
              <Card
                key={test.id}
                className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() =>
                  setSelectedTest(test.id as keyof typeof testFields)
                }
              >
                <div
                  className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-20 ${test.color}`}
                />
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg ${test.color} flex items-center justify-center`}
                  >
                    <test.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="mt-4">{test.title}</CardTitle>
                  <CardDescription>{test.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto scale-90">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                className="absolute right-4 top-4"
                onClick={() => {
                  setSelectedTest("");
                  form.reset();
                }}
              >
                Change Test
              </Button>
              <CardTitle>
                {testTypes.find((t) => t.id === selectedTest)?.title}
              </CardTitle>
              <CardDescription>
                Enter patient information for analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 "
                >
                  <div className=" pr-4 ">
                    <div className="space-y-4 ">
                      {selectedTest &&
                        testFields[selectedTest].map((field) => (
                          <FormField
                            key={field.name}
                            control={form.control}
                            name={field.name}
                            render={({ field: inputField }) => (
                              <FormItem>
                                <FormLabel>{field.label}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter value"
                                    {...inputField}
                                  />
                                </FormControl>
                                <FormDescription>
                                  {field.description}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Generate Prediction
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle
              className={
                prediction.result.includes("High") ||
                prediction.result.includes("Risk") ||
                prediction.result.includes("Abnormal")
                  ? "text-red-500"
                  : "text-green-500"
              }
            >
              {prediction.result}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {prediction.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowResult(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
