import { useAdmissionSheetByBHT } from "@/stores/useAdmissionSheet";
import { useAuthStore } from "@/stores/useAuth";
import { usePatientStore } from "@/stores/usePatientStore";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

export function InputBHTFormFrAdmissionSheet() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [bht, setBht] = useState<string>("");
  const { setPatientBHT } = usePatientStore((state) => state);

  const { setAdmissionSheetByBHT } = useAdmissionSheetByBHT((state) => state);
  const token = useAuthStore((state) => state.token);

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!bht) {
      toast.error("BHT is required");
      setIsLoading(false);
      return;
    } else {
      setPatientBHT(bht);
    }

    try {
      const isAdmissionSheetExisting = await axios.get(
        `/api/admissionSheet/bht?bht=${bht}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!isAdmissionSheetExisting.data.admissionSheet) {
        toast.error("BHT does not exist");
        setIsLoading(false);
        navigate("/inpatient-department/admission-sheet");
        return;
      }
      const response = await axios.get(`/api/admissionSheet/bht?bht=${bht}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAdmissionSheetByBHT(response.data.admissionSheet);

      navigate("/inpatient-department/admission-sheet");
      setIsLoading(false);
    } catch (err: any) {
      if (err.response?.status === 404) {
        toast.error("Patient not found");
      } else {
        console.error("Error fetching patient", err);
        toast.error(err.message || "Error fetching patient");
      }
      setIsLoading(false);
    }
  };
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Input Patient BHT
      </h2>

      <InputOTP maxLength={3} value={bht} onChange={(value) => setBht(value)}>
        <InputOTPGroup className="border border-gray-300 mx-auto">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
      </InputOTP>
      <div className="flex justify-center p-3">
        <Button
          onClick={handleSubmit}
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </div>
      {/* <div className="text-center text-md">
        {value === "" ? <>Enter Patient NIC.</> : <>You entered: {value}</>}
      </div> */}
    </div>
  );
}

export default InputBHTFormFrAdmissionSheet;
