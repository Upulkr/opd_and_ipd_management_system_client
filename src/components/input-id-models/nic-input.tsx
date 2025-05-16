import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

export function InputNicForm() {
  const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();
  const [nic, setNic] = useState<string>("");
  // const { setPatient, setPatientNic } = usePatientStore((state) => state);
  // const token = useAuthStore((state) => state.token);
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
  //     fetch(`/patient/${nic}`).then((res) => res.json()),
  //   enabled: false,
  // });

  // const handleSubmit = async () => {
  //   setIsLoading(true);
  //   console.log("clicking");
  //   console.log("NIC:", nic);
  //   if (!nic) {
  //     setPatientNic(nic);
  //     toast.error("NIC is required");
  //     setIsLoading(false);
  //     return;
  //   } else {
  //     setPatientNic(nic);
  //   }
  //   console.log("token", token);
  //   try {
  //     const response = await apiClient.get(`/patient/${nic}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     console.log("response", response);
  //     setPatient(response.data.Patient);
  //     navigate("/admission-sheet-register-page");
  //     setIsLoading(false);
  //   } catch (err: any) {
  //     if (err.response?.status === 404) {
  //       toast.error("Patient not found, please register the patient");
  //       navigate("/patient-register-form");
  //     } else if (err.response?.status === 403) {
  //       toast.error("You are not authorized to access this page");
  //     } else {
  //       console.error("Error fetching patient", err);
  //       toast.error(err.message || "Error fetching patient");
  //     }
  //     setIsLoading(false);
  //   }
  // };
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
        <Link to={`/admission-sheet-register-page/${null}/${false}/${nic}`}>
          <Button
            onClick={() => setIsLoading(true)}
            type="button"
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

export default InputNicForm;
