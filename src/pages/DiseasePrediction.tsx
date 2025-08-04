import { AlertDialogBox } from "@/components/Alert/AlertDialogBox";
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
import apiClient from "@/lib/apiClient";
import { useFrontendComponentsStore } from "@/stores/useFrontendComponentsStore";
import { usePatientStore } from "@/stores/usePatientStore";
import { zodResolver } from "@hookform/resolvers/zod";

import { Activity, Heart, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import * as z from "zod";
import axios from "axios";

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
    id: "heart_disease",
    title: "Heart Disease Prediction",
    description: "Analyze cardiac health indicators",
    icon: Heart,
    color: "bg-red-500",
    schema: z.object({
      age: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
      sex: z.string().min(1, "Required").regex(/^\d+$/, "Must be a 0 or 1"),
      cp: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
      trestbps: z
        .string()
        .min(1, "Required")
        .regex(/^\d+$/, "Must be a number"),
      chol: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
      fbs: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
      restecg: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
      thalach: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
      exang: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
      oldpeak: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      slope: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
      ca: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
      thal: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
    }),
  },
  {
    id: "breast_cancer",
    title: "Breast Cancer Prediction ",
    title2:
      "Features should be computed from a digitized image of a fine needle aspirate (FNA) of a breast mass",
    description: "Evaluate breast cancer indicators",

    icon: Stethoscope,
    color: "bg-purple-500",
    schema: z.object({
      meanradius: z
        .string()
        .min(1, "Required")
        .regex(/^\d+$/, "Must be a number"),
      meantexture: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      meanperimeter: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      meanarea: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      meansmoothness: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      meancompactness: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      meanconcavity: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      meanconcavepoints: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      meansymmetry: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      meanfractaldimension: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      radiuserror: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      textureerror: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      perimetererror: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      areaerror: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      smoothnesserror: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      compactnesserror: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      concavityerror: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      concavepointserror: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      symmetryerror: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      fractaldimensionerror: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      worstradius: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      worsttexture: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      worstperimeter: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      worstarea: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      worstsmoothness: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      worstcompactness: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      worstconcavity: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      worstconcavepoints: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      worstsymmetry: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      worstfractaldimension: z
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
  heart_disease: [
    { name: "age", label: "Age", description: "Patient's age" },
    {
      name: "sex",
      label: "Sex",
      description: "The gender of the patient. (1 = male, 0 = female).",
    },
    {
      name: "cp",
      label: "Chest Pain",
      description:
        " 1 = typical angina, 2 = atypical angina, 3 = non — anginal pain, 4 = asymptotic",
    },
    {
      name: "trestbps",
      label: "Resting Blood Pressure",
      description: "Resting blood pressure in mmHg",
    },
    {
      name: "chol",
      label: "Cholesterol",
      description: "Serum Cholestero in mg/dl",
    },
    {
      name: "fbs",
      label: "Fasting Blood Sugar",
      description:
        "1 = fasting blood sugar is more than 120mg/dl, 0 = otherwise",
    },
    {
      name: "restecg",
      label: "Resting Electrocardiogram",
      description:
        "0 = normal, 1 = ST-T wave abnormality, 2 = left ventricular hyperthrophy",
    },
    {
      name: "thalach",
      label: "Maximum Heart Rate",
      description: "Max heart rate achieved",
    },
    {
      name: "exang",
      label: "Exercise Induced Angina",
      description: "Exercise induced angina (1 = yes, 0 = no)",
    },
    {
      name: "oldpeak",
      label: "ST Depression",
      description: " ST depression induced by exercise relative to rest",
    },
    {
      name: "slope",
      label: "Slope",
      description:
        "Peak exercise ST segment (1 = upsloping, 2 = flat, 3 = downsloping)",
    },
    {
      name: "ca",
      label: "Number of Major Vessels",
      description: "Number of major vessels (0–3) colored by flourosopy",
    },
    {
      name: "thal",
      label: "Thalassemia",
      description:
        "Thalassemia (3 = normal, 6 = fixed defect, 7 = reversible defect)",
    },
  ],
  breast_cancer: [
    {
      name: "meanradius",
      label: "Mean Radius",
      description: "Mean of distances from center to points on the perimeter",
    },
    {
      name: "meantexture",
      label: "Mean Texture",
      description: "Standard deviation of gray-scale values",
    },
    {
      name: "meanperimeter",
      label: "Mean Perimeter",
      description: "Mean perimeter of the cell nucleus",
    },
    {
      name: "meanarea",
      label: "Mean Area",
      description: "Mean area of the cell nucleus",
    },
    {
      name: "meansmoothness",
      label: "Mean Smoothness",
      description: "Local variation in radius lengths",
    },
    {
      name: "meancompactness",
      label: "Mean Compactness",
      description: "Compactness, calculated as (perimeter² / area - 1.0)",
    },
    {
      name: "meanconcavity",
      label: "Mean Concavity",
      description: "Severity of concave portions of the contour",
    },
    {
      name: "meanconcavepoints",
      label: "Mean Concave Points",
      description: "Number of concave portions of the contour",
    },
    {
      name: "meansymmetry",
      label: "Mean Symmetry",
      description: "Symmetry of the cell nucleus",
    },
    {
      name: "meanfractaldimension",
      label: "Mean Fractal Dimension",
      description: "Fractal dimension, 'coastline approximation' - 1",
    },
    {
      name: "radiuserror",
      label: "Radius Error",
      description: "Standard error of radius measurement",
    },
    {
      name: "textureerror",
      label: "Texture Error",
      description: "Standard error of texture measurement",
    },
    {
      name: "perimetererror",
      label: "Perimeter Error",
      description: "Standard error of perimeter measurement",
    },
    {
      name: "areaerror",
      label: "Area Error",
      description: "Standard error of area measurement",
    },
    {
      name: "smoothnesserror",
      label: "Smoothness Error",
      description: "Standard error of smoothness measurement",
    },
    {
      name: "compactnesserror",
      label: "Compactness Error",
      description: "Standard error of compactness measurement",
    },
    {
      name: "concavityerror",
      label: "Concavity Error",
      description: "Standard error of concavity measurement",
    },
    {
      name: "concavepointserror",
      label: "Concave Points Error",
      description: "Standard error of concave points measurement",
    },
    {
      name: "symmetryerror",
      label: "Symmetry Error",
      description: "Standard error of symmetry measurement",
    },
    {
      name: "fractaldimensionerror",
      label: "Fractal Dimension Error",
      description: "Standard error of fractal dimension measurement",
    },
    {
      name: "worstradius",
      label: "Worst Radius",
      description: "Largest mean value for radius",
    },
    {
      name: "worsttexture",
      label: "Worst Texture",
      description: "Largest mean value for texture",
    },
    {
      name: "worstperimeter",
      label: "Worst Perimeter",
      description: "Largest mean value for perimeter",
    },
    {
      name: "worstarea",
      label: "Worst Area",
      description: "Largest mean value for area",
    },
    {
      name: "worstsmoothness",
      label: "Worst Smoothness",
      description: "Largest mean value for smoothness",
    },
    {
      name: "worstcompactness",
      label: "Worst Compactness",
      description: "Largest mean value for compactness",
    },
    {
      name: "worstconcavity",
      label: "Worst Concavity",
      description: "Largest mean value for concavity",
    },
    {
      name: "worstconcavepoints",
      label: "Worst Concave Points",
      description: "Largest mean value for concave points",
    },
    {
      name: "worstsymmetry",
      label: "Worst Symmetry",
      description: "Largest mean value for symmetry",
    },
    {
      name: "worstfractaldimension",
      label: "Worst Fractal Dimension",
      description: "Largest mean value for fractal dimension",
    },
  ],
};
const api_url_prediction ='https://4opu38skdl.execute-api.ap-south-1.amazonaws.com'
export default function DiseasePrediction() {
  const { setIsSavePredictionButonClick, IssavePredictionButonClick } =
    useFrontendComponentsStore((state) => state);
  const { patientNic, setPatientNic } = usePatientStore((state) => state);
  const [selectedTest, setSelectedTest] = useState<
    keyof typeof testFields | ""
  >("");
  const [showResult, setShowResult] = useState(false);
  const [prediction, setPrediction] = useState({ result: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [savePopup, setSavePopup] = useState(false);

  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(
      testTypes.find((t) => t.id === selectedTest)?.schema || z.object({})
    ),
  });

  //savePrediction relavant user
  const savePrediction = async () => {
    if (patientNic === "") return;
    try {
      const isPatientExist = await apiClient.get(
        `/patient/isPatientexist/${patientNic}`
      );

      if (isPatientExist.data.patientExist === false) {
        setIsSavePredictionButonClick(false);
        toast.error("Patient not found, please register the patient");
        navigate("/patient-register-form");
      }
      const response = await apiClient.post("/diseaseprediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          nic: patientNic,
          disease: selectedTest,
          prediction: prediction.message,
        },
      });

      if (response.status === 200) {
        setIsSavePredictionButonClick(false);
        setSavePopup(false);
        toast.success("Prediction saved successfully");
        setPatientNic("");
      }
    } catch (error: any) {
      setSavePopup(false);
      setIsSavePredictionButonClick(false);
      toast.error(
        error.response?.status === 500
          ? "Error saving prediction"
          : "Unexpected error occurred"
      );
    }
  };

  // Run only when `isSavePredictionButtonClick` is true
  useEffect(() => {
    if (!IssavePredictionButonClick) return; // Exit if false
    savePrediction();
  }, [IssavePredictionButonClick]);

  const onSubmit = async (data: any) => {
    if (data.length === 0) {
      toast.error("Please fill in all the fields.");
    }

    if (!selectedTest) {
      toast.error("Please select a test type.");
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${api_url_prediction}/predict/${selectedTest}`,
        data
      );
      if (response.status === 200) {
        setPrediction({
          result:
            response.data.disease === "breast_cancer"
              ? response.data.message ===
                  "No signs of breast cancer detected." &&
                response.data.prediction === 1
                ? 0
                : 1
              : response.data.prediction,

          message: response.data.message,
        });
        setShowResult(true);
      }
      setLoading(false);
      setSavePopup(true);
    } catch (error: any) {
      setLoading(false);
      if (error.status === 400) {
        console.log(error.data.message);
        toast.error("Unable to fetch prediction. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Title Section */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Medical Prediction System
          </h1>
          <p className="text-gray-600 text-lg">
            Select a test type to begin the analysis
          </p>
        </div>

        <ToastContainer />
        {savePopup && showResult === false && (
          <AlertDialogBox savePopUp={savePopup} info={"Save Prediction"} setSavePopUp={setSavePopup}/>
        )}
        {/* Test Selection or Form */}
        {!selectedTest ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {testTypes.map((test) => (
              <Card
                key={test.id}
                className="relative overflow-hidden hover:shadow-xl transition-all cursor-pointer rounded-lg border border-gray-200"
                onClick={() =>
                  setSelectedTest(test.id as keyof typeof testFields)
                }
              >
                <div
                  className={`absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 rounded-full opacity-20 ${test.color}`}
                />
                <CardHeader className="p-6 space-y-4">
                  <div
                    className={`w-14 h-14 rounded-lg ${test.color} flex items-center justify-center`}
                  >
                    <test.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{test.title}</CardTitle>
                  <CardDescription className="text-gray-500">
                    {test.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="max-w-3xl mx-auto scale-95">
            <CardHeader className="relative p-6">
              <Button
                variant="ghost"
                className="absolute right-6 top-6 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setSelectedTest("");
                  form.reset();
                }}
              >
                Change Test
              </Button>
              <CardTitle className="lg:text-2xl">
                {testTypes.find((t) => t.id === selectedTest)?.title}
              </CardTitle>
              <CardTitle className="lg:text-2xl text-center">
                {
                  testTypes.find(
                    (t) => t.id === selectedTest && t.title2 && t.title2
                  )?.title2
                }
              </CardTitle>
              <CardDescription className="text-gray-500">
                Enter patient information for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div
                    className={`
                        grid grid-cols-1 sm:grid-cols-2 gap-6  `}
                  >
                    {selectedTest &&
                      testFields[selectedTest]?.map((field) => (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={field.name}
                          render={({ field: inputField }) => (
                            <FormItem className="flex flex-col space-y-2">
                              <FormLabel className="text-lg font-medium">
                                {field.label}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full p-3 text-base border border-gray-300 rounded-lg"
                                  placeholder="Enter value"
                                  {...inputField}
                                />
                              </FormControl>
                              <FormDescription className="text-sm text-gray-500">
                                {field.description}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                  </div>
                  <Button
                    disabled={loading}
                    type="submit"
                    className="w-full py-3 text-lg font-semibold transition-all duration-200 rounded-lg text-white"
                    style={{ backgroundColor: loading ? "#A0AEC0" : "#3182CE" }}
                  >
                    {loading
                      ? "Generating Prediction..."
                      : "Generate Prediction"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Prediction Result Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle
              className={`${
                prediction.result === "1" ? "text-red-500" : "text-green-500"
              } text-2xl`}
            >
              {prediction.result === "1"
                ? `${selectedTest} Prediction: Positive`
                : `${selectedTest} Prediction: Negative`}
            </DialogTitle>
            <DialogDescription className="pt-3 text-gray-600">
              <p className="text-lg">
                {prediction.result === "1"
                  ? `The model has detected a positive indication for ${selectedTest}. Please consult with a healthcare professional for further analysis.`
                  : `The model has detected no indication of ${selectedTest}. However, maintaining a healthy lifestyle is always recommended.`}
              </p>
              <p
                className={`text-lg ${
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
