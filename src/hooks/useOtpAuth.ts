import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
    const { error } = await supabase.auth.signInWithOtp({
      phone: `+91${phone}`,
      options: {
        data: meta ? { ...meta, role, phone: `+91${phone}` } : { role, phone: `+91${phone}` },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success("OTP sent");
    setStep("otp");
    return true;
  };

  const verify = async (): Promise<{ ok: boolean; userId?: string }> => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return { ok: false };
    }
    setBusy(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token: otp,
      type: "sms",
    });
    setBusy(false);
    if (error || !data.user) {
      toast.error(error?.message ?? "Invalid OTP");
      return { ok: false };
    }
    return { ok: true, userId: data.user.id };
  };

  return {
    phone, setPhone,
    otp, setOtp,
    step, setStep,
    busy, sendOtp, verify, pendingMeta,
  };
}
