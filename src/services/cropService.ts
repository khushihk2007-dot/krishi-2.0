import { supabase } from "@/integrations/supabase/client";

export const getCrops = async () => {
  const { data, error } = await supabase
    .from("crop_listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const createCrop = async (cropData: {
  user_id: string;
  farmer_id?: string;
  crop: string;
  crop_name?: string;
  quantity: number;
  unit?: string;
  price_per_unit?: number;
  price_per_kg?: number;
  description?: string;
  notes?: string;
  images?: string[];
  location?: string;
  status?: string;
}) => {
  const dataToInsert = {
    ...cropData,
    farmer_id: cropData.farmer_id || cropData.user_id,
    crop_name: cropData.crop_name || cropData.crop,
    price_per_kg: cropData.price_per_kg || cropData.price_per_unit,
    description: cropData.description || cropData.notes,
  };

  const { data, error } = await supabase
    .from("crop_listings")
    .insert([dataToInsert])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCropStatus = async (cropId: string, status: string) => {
  const { data, error } = await supabase
    .from("crop_listings")
    .update({ status })
    .eq("id", cropId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
