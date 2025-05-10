import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFrontendComponentsStore } from "@/stores/useFrontendComponentsStore";
import { usePatientStore } from "@/stores/usePatientStore";
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

interface AlertDialogDemoProps {
  info: string;
  savePopUp: boolean;
}

export function AlertDialogBox({ info, savePopUp }: AlertDialogDemoProps) {
  const [nic, setNic] = useState<string>("");
  const { setPatientNic } = usePatientStore((state) => state);
  const { setIsSavePredictionButonClick, IssavePredictionButonClick } =
    useFrontendComponentsStore();
  const handleSave = () => {
    if (nic.length > 8 && nic !== "") {
      setPatientNic(nic);
      setIsSavePredictionButonClick(true);
    }
  };
  return (
    <AlertDialog open={savePopUp}>
      <AlertDialogTrigger asChild={false}></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{info}</AlertDialogTitle>
          <InputOTP
            maxLength={14}
            value={nic}
            onChange={(value) => setNic(value)}
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
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setIsSavePredictionButonClick(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSave}
            disabled={IssavePredictionButonClick}
          >
            {IssavePredictionButonClick ? "Saving..." : "Save"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
