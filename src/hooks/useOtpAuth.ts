import { useState } from "react";
import { sendOTP, verifyOTP } from "@/services/authService";
import { toast } from "sonner";

export type Role = "farmer" | "buyer" | "labourer";

interface SignupMeta {
  full_name?: string;
  district?: string;
  language?: string;
}

export function useOtpAuth(role: Role) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [busy, setBusy] = useState(false);
  const [pendingMeta, setPendingMeta] = useState<SignupMeta | null>(null);

  const sendOtp = async (meta: SignupMeta | null = null) => {
    if (phone.length !== 10) {
      toast.error("Enter a valid 10-digit phone number");
      return false;
    }
    setBusy(true);
    setPendingMeta(meta);
    try {
      await sendOTP(phone, role, meta || {});
      setBusy(false);
      toast.success("OTP sent");
      setStep("otp");
      return true;
    } catch (error: any) {
      setBusy(false);
      toast.error(error.message || "Failed to send OTP");
      return false;
    }
  };

  const verify = async (): Promise<{ ok: boolean; userId?: string }> => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return { ok: false };
    }
    setBusy(true);
    try {
      const data = await verifyOTP(phone, otp);
      setBusy(false);
      if (!data.user) {
        toast.error("Invalid OTP");
        return { ok: false };
      }
      return { ok: true, userId: data.user.id };
    } catch (error: any) {
      setBusy(false);
      toast.error(error.message || "Invalid OTP");
      return { ok: false };
    }
  };

  return {
    phone, setPhone,
    otp, setOtp,
    step, setStep,
    busy, sendOtp, verify, pendingMeta,
  };
}
