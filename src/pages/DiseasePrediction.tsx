import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import axios from "axios";
import { Activity, Heart, Stethoscope } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import * as z from "zod";

const testTypes = [
  {
    id: "diabetes",
    title: "Diabetes Prediction",
    description: "Check diabetes risk factors",
    icon: Activity,
    color: "bg-blue-500",
    schema: z.object({
      pregnencies: z.string().regex(/^\d+$/, "Must be a number").optional(),
      glucose: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
      bloodPressure: z
        .string()
        .min(1, "Required")
        .regex(/^\d+$/, "Must be a number"),
      skinThickness: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      insulin: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      bmi: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      diabetesPedigreeFunction: z
        .string()
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      age: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
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
      name: "pregnencies",
      label: "Number of Pregnancies",
      description: "Number of pregnancies",
    },
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
      name: "skinThickness",
      label: "Skin Thickness (mm)",
      description: "Triceps skin fold thickness",
    },
    {
      name: "insulin",
      label: "Insulin (mu U/ml)",
      description: "2-Hour serum insulin",
    },
    { name: "bmi", label: "BMI", description: "Body mass index" },
    {
      name: "diabetesPedigreeFunction",
      label: "Diabetes Pedigree",
      description: "Diabetes pedigree function",
    },
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
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(
      testTypes.find((t) => t.id === selectedTest)?.schema || z.object({})
    ),
  });

  const onSubmit = async (data: any) => {
    console.log("Data:", data);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/predict/diabetes",
        data
      );
      if (response.status === 200) {
        setPrediction({
          result: response.data.prediction,
          message: response.data.message,
        });
        setShowResult(true);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.status === 400) {
        console.log(error.data.message);
        toast.error("Unable to fetch prediction. Please try again.");
      }
    }
  };
  console.log("prediction", prediction);
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Medical Prediction System</h1>
          <p className="text-gray-500">
            Select a test type to begin the analysis
          </p>
        </div>
        <ToastContainer />
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
                  <Button
                    disabled={loading}
                    type="submit"
                    className={`w-full ${
                      loading ? "bg-gray-400" : "bg-blue-500"
                    }`}
                  >
                    {loading ? " Generating Prediction" : "Generate Prediction"}
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
              className={` ${
                prediction.result === "1" ? "text-red-500" : "text-green-500"
              }`}
            >
              {prediction.result === "1"
                ? "Diabetes Prediction: Positive"
                : "Diabetes Prediction: Negative"}
            </DialogTitle>
            <DialogDescription className="pt-2">
              <p className="text-md xl:text-lg">
                {prediction.result === "1"
                  ? "The model has detected a positive indication for diabetes. Please consult with a healthcare professional for further analysis and diagnosis."
                  : "The model has detected no indication of diabetes based on the provided information. However, maintaining a healthy lifestyle is always recommended."}
              </p>
              {/* Apply the color to the message based on the result */}
              <p
                className={`text-md xl:text-lg ${
                  prediction.result === "1" ? "text-red-500" : "text-green-500"
                }`}
              >
                {prediction.message}
              </p>
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
