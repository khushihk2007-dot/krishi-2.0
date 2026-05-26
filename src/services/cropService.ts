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
  crop: string;
  quantity: number;
  unit?: string;
  price_per_unit?: number;
  notes?: string;
  transport_needed?: boolean;
}) => {
  const { data, error } = await supabase
    .from("crop_listings")
    .insert([{
      user_id: cropData.user_id,
      crop: cropData.crop,
      quantity: cropData.quantity,
      unit: cropData.unit ?? "kg",
      price_per_unit: cropData.price_per_unit ?? null,
      notes: cropData.notes ?? null,
      transport_needed: cropData.transport_needed ?? false,
      status: "available",
    }])
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

export const getMyListings = async (userId: string) => {
  const { data, error } = await supabase
    .from("crop_listings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteCropListing = async (cropId: string) => {
  const { error } = await supabase
    .from("crop_listings")
    .delete()
    .eq("id", cropId);

  if (error) throw error;
};
