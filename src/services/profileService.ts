import { supabase } from "@/integrations/supabase/client";

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, profileData: any) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(profileData)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getFarmerDetails = async (userId: string) => {
  const { data, error } = await supabase
    .from("farmer_details")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getBuyerDetails = async (userId: string) => {
  const { data, error } = await supabase
    .from("buyer_details")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getLabourerSkills = async (userId: string) => {
  const { data, error } = await supabase
    .from("labourer_skills")
    .select("skill")
    .eq("user_id", userId);

  if (error) throw error;
  return data?.map((r) => r.skill) || [];
};
