import { supabase } from "@/integrations/supabase/client";

/**
 * Send an OTP via Supabase Phone Auth (Twilio backend).
 * Validates the phone number format before sending.
 */
export const sendOTP = async (phone: string, role: "farmer" | "buyer" | "labourer", meta?: any) => {
  const cleanPhone = phone.startsWith("+") ? phone : `+91${phone}`;

  // Basic phone validation
  const digits = cleanPhone.replace(/\D/g, "");
  if (digits.length < 12) {
    throw new Error("Please enter a valid 10-digit Indian mobile number.");
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    phone: cleanPhone,
    options: {
      data: {
        ...meta,
        role,
        phone: cleanPhone,
      },
    },
  });

  if (error) {
    // Map common Supabase/Twilio error messages to user-friendly text
    if (error.message?.includes("rate limit") || error.message?.includes("too many")) {
      throw new Error("Too many OTP requests. Please wait a minute before trying again.");
    }
    if (error.message?.includes("invalid") && error.message?.includes("phone")) {
      throw new Error("Invalid phone number format. Please check and try again.");
    }
    throw error;
  }
  return data;
};

/**
 * Verify the OTP entered by the user.
 */
export const verifyOTP = async (phone: string, token: string) => {
  const cleanPhone = phone.startsWith("+") ? phone : `+91${phone}`;

  if (!token || token.length !== 6) {
    throw new Error("Please enter the complete 6-digit OTP.");
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone: cleanPhone,
    token,
    type: "sms",
  });

  if (error) {
    if (error.message?.includes("expired") || error.message?.includes("Token has expired")) {
      throw new Error("OTP has expired. Please request a new one.");
    }
    if (error.message?.includes("invalid")) {
      throw new Error("Invalid OTP. Please check and try again.");
    }
    throw error;
  }
  return data;
};

/**
 * Sign in with email and password.
 */
export const loginWithEmail = async (email: string, pass: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });
  if (error) throw error;
  return data;
};

/**
 * Sign up with email and password.
 */
export const signupWithEmail = async (email: string, pass: string, role: "farmer" | "buyer" | "labourer", meta?: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
    options: {
      data: {
        ...meta,
        role,
        email,
      },
    },
  });
  if (error) throw error;
  return data;
};

/**
 * Sign out the current user.
 */
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
