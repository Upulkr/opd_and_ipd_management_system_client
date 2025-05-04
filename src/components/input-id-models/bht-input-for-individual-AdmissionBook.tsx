import { usePatientStore } from "@/stores/usePatientStore";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { useAdmissionSheetByBHT } from "@/stores/useAdmissionSheet";
import { useAdmissionBookByBHT } from "@/stores/useAdmissionBook";
import { useFrontendComponentsStore } from "@/stores/useFrontendComponentsStore";
import { useAuthStore } from "@/stores/useAuth";

export function InputBHTFormForAdmissionBookSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [bht, setBht] = useState<string>("");
  const { setPatientBHT } = usePatientStore((state) => state);
  const { enableUpdate } = useFrontendComponentsStore((state) => state);
  const { setAdmissionBook } = useAdmissionBookByBHT((state) => state);
  const { setAdmissionSheetByBHT } = useAdmissionSheetByBHT((state) => state);
  const token = useAuthStore((state) => state.token);
  // const [isLoadingButton, setIsLoadingButton] = useState(false);
  //   const handleKeyDown = (e: React.KeyboardEvent) => {
  //     if (e.key === "Enter") {
  //       e.preventDefault(); // Prevent the default Enter behavior
  //       console.log("NIC Submitted");
  //       onClose(); // Close the form after submission
  //     }
  //   };

  // const { data, error, isLoading, refetch } = useQuery({
  //   queryKey: ["patient"],
  //   queryFn: () =>
  //     fetch(`/api/patient/${nic}`).then((res) => res.json()),
  //   enabled: false,
  // });

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
      if (!token) {
        toast.error("No token found in localStorage");
        return;
      }
      const isAdmissionBookExisting = await axios.get(
        `/api/admissionBook/bht?bht=${bht}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!isAdmissionBookExisting.data.admissionBook) {
        toast.error("BHT does not exist");
        setIsLoading(false);
        navigate("/inpatient-department");
        return;
      }

      const response = await axios.get(
        enableUpdate === true
          ? `/api/admissionbook/bht?bht=${bht}`
          : `/api/admissionsheet/bht?bht=${bht}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (enableUpdate === true) {
        setAdmissionBook(response.data.admissionBook);
      } else {
        setAdmissionSheetByBHT(response.data.admissionSheet);
      }

      navigate("/admission-book-page");
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
        <Link to={`/admission-book-page/${bht}`}>
          <Button
            // onClick={handleSubmit}
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </Link>
      </div>
      {/* <div className="text-center text-md">
        {value === "" ? <>Enter Patient NIC.</> : <>You entered: {value}</>}
      </div> */}
    </div>
  );
}

export default InputBHTFormForAdmissionBookSearch;
