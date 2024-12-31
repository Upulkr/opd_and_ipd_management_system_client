import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "@/stores/usePatientStore";

export function InputNicForm({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [nic, setNic] = useState<string>("");
  const { setPatient } = usePatientStore();
  // const [isLoadingButton, setIsLoadingButton] = useState(false);
  //   const handleKeyDown = (e: React.KeyboardEvent) => {
  //     if (e.key === "Enter") {
  //       e.preventDefault(); // Prevent the default Enter behavior
  //       console.log("NIC Submitted");
  //       onClose(); // Close the form after submission
  //     }
  //   };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["patient"],
    queryFn: () =>
      fetch(`http://localhost:8000/patient/${nic}`).then((res) => res.json()),
    enabled: false,
  });

  const handleSubmit = async () => {
    console.log("clicking");
    console.log("NIC:", nic);
    if (!nic) {
      toast.error("NIC is required");
      return;
    }

    try {
      await refetch(); // Trigger the query
      if (error) {
        throw new Error("Error fetching patient");
      }
      setPatient(data.Patient);
      console.log("patient", data.Patient);
      if (data.status === 404) {
        navigate("/patient-register-page");
      }

      // toast.success("Patient data fetched successfully!");
      navigate("/admission-sheet-register-page");
    } catch (err: any) {
      toast.error(err.message || "Error fetching patient");
    }
  };
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Input Patient NIC
      </h2>

      <InputOTP maxLength={14} value={nic} onChange={(value) => setNic(value)}>
        <InputOTPGroup className="border border-gray-300">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={6} />
          <InputOTPSlot index={7} />
          <InputOTPSlot index={8} />
          <InputOTPSlot index={9} />
          <InputOTPSlot index={10} />
          <InputOTPSlot index={11} />
          <InputOTPSlot index={12} />
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

export default InputNicForm;
