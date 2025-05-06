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

import { useAuthStore } from "@/stores/useAuth";
import axios from "axios";
import { Loader2, Upload } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SERVICE_ROLE_KEY!
);

interface FileUploadPopupProps {
  patientNic?: string;
}

export default function FileUploadPopup({ patientNic }: FileUploadPopupProps) {
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState("blood-test");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const token = useAuthStore((state) => state.token);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    if (!patientNic) {
      toast.error("Patient NIC is required.");
      return;
    }

    try {
      setUploading(true);

      // Create a unique file name to prevent collisions
      const fileExt = file.name.split(".").pop();
      const fileName = `${reportType}/${patientNic}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("medical-files") // Make sure this bucket exists in your Supabase project
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from("medical-files")
        .getPublicUrl(filePath);

      // Save the file URL to your medicalreport model in the database
      await axios.post(
        "/api/medicalreports",
        {
          PatientNic: patientNic,
          reportType: reportType,
          documentUrl: urlData.publicUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("File uploaded successfully!");

      // Reset form and close dialog
      setFile(null);
      setOpen(false);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="ml-auto flex items-center gap-2"
      >
        <Upload size={16} />
        Upload Document
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Medical Document</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
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

            {file && (
              <div className="bg-muted p-2 rounded-md text-sm text-muted-foreground ml-[calc(25%+16px)] mr-4">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </div>
            )}

            <DialogFooter className="sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
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
