import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@supabase/supabase-js";
import React, { useState } from "react";

import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/stores/useAuth";
import { Loader2, Upload } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SERVICE_ROLE_KEY!,
);

interface FileUploadPopupProps {
  patientNic?: string;
}

export default function FileUploadPopup({ patientNic }: FileUploadPopupProps) {
  // State management using React's useState hook
  // 'open' controls the visibility of the modal dialog
  const [open, setOpen] = useState(false);
  // 'reportType' stores the selected category of the medical document (defaulted to 'blood-test')
  const [reportType, setReportType] = useState("blood-test");
  // 'file' state holds the actual File object selected by the user
  const [file, setFile] = useState<File | null>(null);
  // 'uploading' helps in managing the UI state (showing loader/disabling buttons) during the async upload process
  const [uploading, setUploading] = useState(false);

  // Retrieve the authentication token from the global store (Zustand)
  // This token is required for making authorized API requests to the backend
  const token = useAuthStore((state) => state.token);

  /**
   * Handler for file input changes.
   * Captures the file object from the event and updates the state.
   * We only take the first file since this is a single-file upload.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  /**
   * Main form submission handler.
   * This function orchestrates the entire upload process:
   * 1. Validates input
   * 2. Generates a unique filename
   * 3. Uploads the file to Supabase Storage (Blob storage)
   * 4. Retrieves the public URL
   * 5. Saves the metadata (link, type, NIC) to our backend SQL database
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent the default form submission behavior which causes a page reload
    e.preventDefault();

    // rigorous validation to ensure file and patient context exist
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    if (!patientNic) {
      toast.error("Patient NIC is required.");
      return;
    }

    try {
      // Set loading state to true to provide visual feedback (spinner)
      setUploading(true);

      // --------------------------------------------------------------------------
      // Step 1: File Preparation
      // --------------------------------------------------------------------------
      // Create a unique file name to prevent collisions in the storage bucket.
      // Format: [reportType]/[NIC]_[Timestamp]_[RandomString].[Extension]
      // This ensures that even if the same user uploads the same file twice, it stores uniquely.
      const fileExt = file.name.split(".").pop();
      const fileName = `${reportType}/${patientNic}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // --------------------------------------------------------------------------
      // Step 2: Supabase Storage Upload
      // --------------------------------------------------------------------------
      // We upload the physical file to the 'medicalreports' bucket.
      const { error: uploadError } = await supabase.storage
        .from("medicalreports") // Make sure this bucket exists in your Supabase project configuration
        .upload(filePath, file, {
          cacheControl: "3600", // Cache the file for 1 hour on the CDN
          upsert: false, // Do not overwrite if file exists (our unique naming prevents this anyway)
        });

      if (uploadError) {
        // Throw an error to be caught by the catch block below
        throw new Error(uploadError.message);
      }

      // --------------------------------------------------------------------------
      // Step 3: Get Public URL
      // --------------------------------------------------------------------------
      // Retrieve the globally accessible URL for the uploaded asset.
      // This URL will be stored in the database for later retrieval.
      const { data: urlData } = supabase.storage
        .from("medicalreports")
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) {
        throw new Error("Failed to get public URL for uploaded file.");
        toast.error("Failed to get URL for uploaded file.");
      }

      // --------------------------------------------------------------------------
      // Step 4: Database Record Creation
      // --------------------------------------------------------------------------
      // Save the file metadata to the backend.
      // We send the Patient NIC, Report Type, and the Storage URL.
      await apiClient.post(
        "/medicalreports",
        {
          PatientNic: patientNic,
          reportType: reportType,
          documentUrl: urlData.publicUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach JWT for protected route access
            "Content-Type": "application/json",
          },
        },
      );

      toast.success("File uploaded successfully!");

      // --------------------------------------------------------------------------
      // Step 5: Cleanup
      // --------------------------------------------------------------------------
      // Reset form state and close the modal upon successful completion
      setFile(null);
      setOpen(false);
    } catch (error: any) {
      // Comprehensive error handling
      console.error("Upload error:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      // Always turn off the loading state, whether success or failure
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Toast container for showing notifications */}
      <ToastContainer />

      {/* Trigger Button: Opens the dialog */}
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="ml-auto flex items-center gap-2"
      >
        <Upload size={16} />
        Upload Document
      </Button>

      {/* Modal Dialog Component */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Medical Document</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {/* Report Type Selector */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reportType" className="text-right">
                Document Type
              </Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blood-tests">Blood Test</SelectItem>
                  <SelectItem value="x-ray">X-Ray Image</SelectItem>
                  <SelectItem value="doctor-notes">Doctor Notes</SelectItem>
                  <SelectItem value="mri">MRI Scan</SelectItem>
                  <SelectItem value="prescription">Prescription</SelectItem>
                  <SelectItem value="others">Other Document</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Input Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                File
              </Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="col-span-3"
              />
            </div>

            {/* File Info Display: Shows selected file name and size */}
            {file && (
              <div className="bg-muted p-2 rounded-md text-sm text-muted-foreground ml-[calc(25%+16px)] mr-4">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </div>
            )}

            {/* Dialog Footer with Action Buttons */}
            <DialogFooter className="sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
              {/* Submit Button: Disables while uploading or if no file is selected */}
              <Button type="submit" disabled={uploading || !file}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
