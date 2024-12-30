import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Button } from "../ui/button";
import axios from "axios";

export function InputNicForm({ onClose }: { onClose: () => void }) {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //   const handleKeyDown = (e: React.KeyboardEvent) => {
  //     if (e.key === "Enter") {
  //       e.preventDefault(); // Prevent the default Enter behavior
  //       console.log("NIC Submitted");
  //       onClose(); // Close the form after submission
  //     }
  //   };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Input Patient NIC
      </h2>

      <InputOTP
        maxLength={14}
        value={value}
        onChange={(value) => setValue(value)}
      >
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
