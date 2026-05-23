import { supabase } from "@/integrations/supabase/client";

export const sendOTP = async (phone: string, role: "farmer" | "buyer" | "labourer", meta?: any) => {
  const cleanPhone = phone.startsWith("+") ? phone : `+91${phone}`;
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

  if (error) throw error;
  return data;
};

export const verifyOTP = async (phone: string, token: string) => {
  const cleanPhone = phone.startsWith("+") ? phone : `+91${phone}`;
  const { data, error } = await supabase.auth.verifyOtp({
    phone: cleanPhone,
    token,
    type: "sms",
  });

  if (error) throw error;
  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
