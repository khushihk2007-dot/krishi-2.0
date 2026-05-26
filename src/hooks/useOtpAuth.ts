import { useState, useEffect, useCallback, useRef } from "react";
import { sendOTP, verifyOTP } from "@/services/authService";
import { toast } from "sonner";

export type Role = "farmer" | "buyer" | "labourer";

interface SignupMeta {
  full_name?: string;
  district?: string;
  language?: string;
}

const RESEND_COOLDOWN_SECONDS = 60;

export function useOtpAuth(role: Role) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [busy, setBusy] = useState(false);
  const [pendingMeta, setPendingMeta] = useState<SignupMeta | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resendTimer]);

  const sendOtp = useCallback(async (meta: SignupMeta | null = null) => {
    if (phone.length !== 10) {
      toast.error("Enter a valid 10-digit phone number");
      return false;
    }
    if (resendTimer > 0) {
      toast.error(`Please wait ${resendTimer}s before requesting another OTP.`);
      return false;
    }
    setBusy(true);
    setPendingMeta(meta);
    try {
      await sendOTP(phone, role, meta || {});
      setBusy(false);
      toast.success("OTP sent! Check your SMS messages.");
      setStep("otp");
      setResendTimer(RESEND_COOLDOWN_SECONDS);
      return true;
    } catch (error: any) {
      setBusy(false);
      toast.error(error.message || "Failed to send OTP. Please try again.");
      return false;
    }
  }, [phone, role, resendTimer]);

  const verify = useCallback(async (): Promise<{ ok: boolean; userId?: string }> => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return { ok: false };
    }
    setBusy(true);
    try {
      const data = await verifyOTP(phone, otp);
      setBusy(false);
      if (!data.user) {
        toast.error("Invalid OTP. Please try again.");
        return { ok: false };
      }
      return { ok: true, userId: data.user.id };
    } catch (error: any) {
      setBusy(false);
      toast.error(error.message || "Invalid OTP. Please try again.");
      return { ok: false };
    }
  }, [phone, otp]);

  const resendOtp = useCallback(async () => {
    if (resendTimer > 0) {
      toast.error(`Please wait ${resendTimer}s before requesting another OTP.`);
      return false;
    }
    return sendOtp(pendingMeta);
  }, [resendTimer, sendOtp, pendingMeta]);

  return {
    phone, setPhone,
    otp, setOtp,
    step, setStep,
    busy, sendOtp, verify, pendingMeta,
    resendTimer, resendOtp,
  };
}
