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
import { useAuthStore } from "@/stores/useAuth";

// --------------------------------------------------------------------------
// MODULE: DiseasePrediction
// PURPOSE: This module handles the prediction of various diseases (Diabetes,
//          Heart Disease, Breast Cancer) using machine learning models via an API.
// AUTHOR: [Student Name]
// DATE: [Current Date]
// --------------------------------------------------------------------------

// Importing necessary UI components, hooks, and libraries.
// We use 'zod' for schema validation to ensure the user inputs valid numerical data.
// 'react-hook-form' is used for efficient form handling.
// 'axios' and 'apiClient' are used for making HTTP requests to the backend.

// --------------------------------------------------------------------------
// DATA STRUCTURE: testTypes
// DESCRIPTION: An array of objects defining the available disease prediction tests.
//              Each object contains metadata (id, title, icon) and a 'schema'
//              property which uses Zod to define the validation rules for that specific test.
// --------------------------------------------------------------------------
const testTypes = [
  {
    id: "diabetes",
    title: "Diabetes Prediction",
    description: "Check diabetes risk factors",
    icon: Activity, // Icon representing activity/vital signs
    color: "bg-blue-500", // Visual cue for the card
    // Zod Schema: Ensures all inputs are numbers using Regex.
    // We treat inputs as strings initially and validate the format.
    schema: z.object({
      pregnencies: z.string().regex(/^\d+$/, "Must be a number").optional(), // Optional field
      glucose: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
      bloodPressure: z
        .string()
        .min(1, "Required")
        .regex(/^\d+$/, "Must be a number"),
      skinThickness: z
        .string()
        .min(1, "Required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"), // Allows decimals
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
    icon: Heart, // Heart icon for cardiology
    color: "bg-red-500",
    schema: z.object({
      age: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"),
      sex: z.string().min(1, "Required").regex(/^\d+$/, "Must be a 0 or 1"), // Binary classification for sex
      cp: z.string().min(1, "Required").regex(/^\d+$/, "Must be a number"), // Chest pain type
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
      // The breast cancer dataset has many continuous features requiring decimal validation.
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
      // ...all 30 features are required for the model
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
// This variable holds the base URL for the prediction API service.
const api_url_prediction =
  "https://e7rrx80e09.execute-api.ap-south-1.amazonaws.com";

// --------------------------------------------------------------------------
// COMPONENT: DiseasePrediction
// DESCRIPTION: The main React Functional Component that renders the interface.
//              It manages state for the selected test, form data, and API responses.
// --------------------------------------------------------------------------
export default function DiseasePrediction() {
  // ACCESSING GLOBAL STATE STORES
  // We use zustand stores to manage state that needs to be accessed across multiple components.
  // 'useFrontendComponentsStore' manages UI state like button clicks.
  // 'usePatientStore' manages patient-specific data, like the NIC.
  const { setIsSavePredictionButonClick, IssavePredictionButonClick } =
    useFrontendComponentsStore((state) => state);
  const { patientNic, setPatientNic } = usePatientStore((state) => state);

  // LOCAL STATE MANAGEMENT (React hooks)
  // 'selectedTest' tracks which disease test the user has chosen.
  // 'showResult' controls the visibility of the prediction result modal.
  // 'prediction' stores the result returned from the API.
  // 'loading' indicates if an API request is in progress.
  // 'savePopup' controls the visibility of the "Save Prediction" dialog.
  const [selectedTest, setSelectedTest] = useState<
    keyof typeof testFields | ""
  >("");
  const [showResult, setShowResult] = useState(false);
  const [prediction, setPrediction] = useState({ result: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [savePopup, setSavePopup] = useState(false);

  // Retrieve the authentication token for secure API calls.
  const token = useAuthStore((state) => state.token);

  // 'useNavigate' hook for programmatic navigation (e.g., redirecting to register).
  const navigate = useNavigate();

  // FORM HANDLING INITIALIZATION
  // We initialize the form using 'react-hook-form' with 'zodResolver'.
  // This connects the Zod validation schema defined above to our form logic.
  // The schema is dynamically selected based on the 'selectedTest' state.
  const form = useForm({
    resolver: zodResolver(
      testTypes.find((t) => t.id === selectedTest)?.schema || z.object({}),
    ),
  });

  // --------------------------------------------------------------------------
  // FUNCTION: savePrediction
  // DESCRIPTION: An asynchronous function aimed at saving the prediction result
  //              to the backend database. It performs the following steps:
  //              1. Validates if the patient exists in the system.
  //              2. If not, redirects to the registration form.
  //              3. If yes, posts the prediction data to the database.
  // COMPLEXITY: O(1) - dominated by network latency rather than computation.
  // --------------------------------------------------------------------------
  const savePrediction = async () => {
    // Validation: Ensure patient NIC is present before attempting to save
    if (patientNic === "") return;
    try {
      // Step 1: Check if the patient exists in our database
      const isPatientExist = await apiClient.get(
        `/patient/isPatientexist/${patientNic}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach JWT token for security
          },
        },
      );

      // Control Flow: If patient does not exist, alert user and redirect
      if (isPatientExist.data.patientExist === false) {
        setIsSavePredictionButonClick(false);
        toast.error("Patient not found, please register the patient");
        navigate("/patient-register-form");
      }

      // Step 2: Patient exists, proceed to save the prediction data
      const response = await apiClient.post(
        "/diseaseprediction",
        {
          nic: patientNic,
          disease: selectedTest,
          prediction: prediction.message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      // Handle successful save
      if (response.status === 200) {
        setIsSavePredictionButonClick(false); // Reset global state
        setSavePopup(false); // Close the popup
        toast.success("Prediction saved successfully");
        setPatientNic(""); // Clear the NIC from store
      }
    } catch (error: any) {
      // Error Handling: Catch network or server errors and display meaningful messages
      setSavePopup(false);
      setIsSavePredictionButonClick(false);
      toast.error(
        error.response?.status === 500
          ? "Error saving prediction"
          : "Unexpected error occurred",
      );
    }
  };

  // EFFECT HOOK: Trigger Saving
  // This 'useEffect' listens for changes in 'IssavePredictionButonClick'.
  // When the global store indicates the save button was clicked, it triggers 'savePrediction'.
  // This pattern decouples the button UI from the logic here.
  useEffect(() => {
    if (!IssavePredictionButonClick) return; // Exit if the flag is false
    savePrediction();
  }, [IssavePredictionButonClick]);

  // --------------------------------------------------------------------------
  // FUNCTION: onSubmit
  // DESCRIPTION: Handles the form submission event. It aggregates the user input,
  //              sends it to the ML prediction API, and processes the result.
  // PARAMETERS: data - The object containing form field values (validated by Zod).
  // --------------------------------------------------------------------------
  const onSubmit = async (data: any) => {
    // Pre-flight checks (though Zod handles most validation)
    if (data.length === 0) {
      toast.error("Please fill in all the fields.");
    }

    if (!selectedTest) {
      toast.error("Please select a test type.");
    }

    try {
      setLoading(true); // Start loading state (spins the button)

      // API Call: Send data to the Flask/Python based ML service
      const response = await axios.post(
        `${api_url_prediction}/predict/${selectedTest}`,
        data,
      );

      // Process successful response
      if (response.status === 200) {
        // MAPPING LOGIC: The breast cancer model returns 0/1 differently than others.
        // We normalize the result here for consistent specific handling.
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
        setShowResult(true); // Open the result modal
      }
      setLoading(false); // Stop loading state
      setSavePopup(true); // Prompt user to save the result
    } catch (error: any) {
      setLoading(false);
      // HTTP 400 means bad request (invalid data sent to model)
      if (error.status === 400) {
        console.log(error.data.message);
        toast.error("Unable to fetch prediction. Please try again.");
      }
    }
  };

  // --------------------------------------------------------------------------
  // UI RENDERING
  // The component returns a JSX structure that dynamically changes based on state.
  // --------------------------------------------------------------------------
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Title Section: Displays the main heading of the application */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Medical Prediction System
          </h1>
          <p className="text-gray-600 text-lg">
            Select a test type to begin the analysis
          </p>
        </div>

        {/* ToastContainer: Used for displaying non-blocking notifications (success/error messages) */}
        <ToastContainer />

        {/* Conditional Rendering: Show the save popup if the state allows */}
        {savePopup && showResult === false && (
          <AlertDialogBox
            savePopUp={savePopup}
            info={"To Save Prediction ,add patient NIC number"}
            setSavePopUp={setSavePopup}
          />
        )}

        {/* Conditional Rendering: Main Content Switching
            - IF 'selectedTest' is empty: Show the grid of test cards (Selection Menu).
            - ELSE: Show the form for the selected test.
        */}
        {!selectedTest ? (
          /* SECTION: Test Selection Menu */
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
          /* SECTION: Input Form */
          <Card className="max-w-3xl mx-auto scale-95">
            <CardHeader className="relative p-6">
              {/* Back Button to return to test selection */}
              <Button
                variant="ghost"
                className="absolute right-6 top-6 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setSelectedTest("");
                  form.reset(); // Reset form state when switching views
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
                    (t) => t.id === selectedTest && t.title2 && t.title2,
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
                    {/* Dynamic Field Generation: Map through the fields defined for the selected test */}
                    {/* Accesses the field definitions from the 'testFields' object using the selected test ID */}
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

                  {/* Submit Button with Loading State */}
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

      {/* Prediction Result Dialog: Displays the outcome of the ML model */}
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
