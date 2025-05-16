"use client";

import {
  Download,
  Eye,
  FileImage,
  FilePen,
  FileScan,
  FileText,
  Pill,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/stores/useAuth";
import { toast } from "react-toastify";

// Define medical report interface matching the backend model
interface MedicalReport {
  id: number;
  PatientNic: string;
  reportType: string;
  documentUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Interface for the displayed file with computed properties
interface DisplayFile {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
  size: string;
}

const PatientReports = () => {
  const { nic, doctype } = useParams();
  const [files, setFiles] = useState<DisplayFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);
  console.log("doctypes", doctype);
  // Function to fetch medical reports from database
  const fetchFiles = async (nic: string, doctype: string) => {
    try {
      setLoading(true);

      const response = await apiClient.get(
        `/medicalreports/getbynicandtype/${nic}/${doctype}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Handle both single report and array of reports
        const reports = Array.isArray(response.data)
          ? response.data
          : response.data
          ? [response.data]
          : [];

        // Transform the data to match our display requirements
        const displayFiles = reports.map((report: MedicalReport) => {
          // Generate a reasonable file name based on report type
          const fileName = getFileNameFromType(report.reportType);

          return {
            id: report.id.toString(),
            name: fileName,
            type: report.reportType,
            url: report.documentUrl,
            uploadDate: new Date(report.createdAt).toISOString().split("T")[0],
            size: "Unknown", // Assign a default value or calculate the size if available
          };
        });

        setFiles(displayFiles);
      } else {
        setError("Failed to fetch reports.");
      }
    } catch (err: any) {
      if (err.status === 404) {
        toast.error(
          `No reports found for this patient in this ${getFileTypeLabel(
            doctype
          )}.`
        );
      }

      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  // Generate a reasonable file name based on report type
  const getFileNameFromType = (reportType: string) => {
    switch (reportType) {
      case "blood-test":
        return "Blood Test Results";
      case "x-ray":
        return "X-ray Scan";
      case "doctor-notes":
        return "Doctor's Consultation Notes";
      case "mri-scan":
        return "MRI Scan Results";
      case "prescription":
        return "Medication Prescription";
      default:
        return `${
          reportType.charAt(0).toUpperCase() + reportType.slice(1)
        } Report`;
    }
  };

  useEffect(() => {
    if (nic && doctype) {
      fetchFiles(nic, doctype);
    }
  }, [nic, doctype]);

  // Function to get appropriate icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "blood-tests":
        return <FileText className="h-6 w-6 text-red-500" />;
      case "x-ray":
        return <FileImage className="h-6 w-6 text-blue-500" />;
      case "doctor-notes":
        return <FilePen className="h-6 w-6 text-green-500" />;
      case "mri-scan":
        return <FileScan className="h-6 w-6 text-purple-500" />;
      case "prescription":
        return <Pill className="h-6 w-6 text-amber-500" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  // Function to get human-readable file type
  const getFileTypeLabel = (fileType: string) => {
    switch (fileType) {
      case "blood-tests":
        return "Blood Test Results";
      case "x-ray":
        return "X-ray Images";
      case "doctor-notes":
        return "Doctor Notes";
      case "mri-scan":
        return "MRI Scan";
      case "prescription":
        return "Prescription";
      default:
        return (
          fileType.charAt(0).toUpperCase() +
          fileType.slice(1).replace(/-/g, " ")
        );
    }
  };

  // Get file extension from URL
  const getFileExtension = (url: string) => {
    const parts = url.split(".");
    if (parts.length > 1) {
      return parts[parts.length - 1].toUpperCase();
    }
    return "PDF"; // Default assumption
  };

  // Function to handle file view
  const handleViewFile = (file: DisplayFile) => {
    // In a real application, this would open the file in a new tab or viewer
    window.open(file.url, "_blank");
  };

  // Function to handle file download
  const handleDownloadFile = (file: DisplayFile) => {
    // In a real application, this would trigger a download
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Patient Reports</h1>
        <p className="text-muted-foreground">
          NIC: {nic} • Document Type:{" "}
          {doctype === "all"
            ? "All Documents"
            : getFileTypeLabel(doctype || "")}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="bg-destructive/10 p-4 rounded-md text-destructive">
          {error}
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No files found</h2>
          <p className="text-muted-foreground">
            No{" "}
            {doctype === "all"
              ? "medical documents"
              : getFileTypeLabel(doctype || "")}{" "}
            found for this patient.
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
            {files.map((file) => (
              <Card key={file.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getFileIcon(file.type)}
                      {file.name}
                    </CardTitle>
                    <Badge variant="outline">{file.size}</Badge>
                  </div>
                  <CardDescription>
                    Uploaded on {new Date(file.uploadDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-md p-4 flex items-center justify-center h-24">
                    <div className="text-center">
                      <p className="font-medium">
                        {getFileTypeLabel(file.type)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getFileExtension(file.url)} File
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewFile(file)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View file in browser</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleDownloadFile(file)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download to your device</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default PatientReports;
