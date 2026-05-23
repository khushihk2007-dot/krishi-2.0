import { supabase } from "@/integrations/supabase/client";

export const getBuyerOrders = async (buyerId: string) => {
  const { data, error } = await supabase
    .from("buyer_orders")
    .select("*, crop_listings(*)")
    .eq("buyer_id", buyerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const placeOrder = async (orderData: {
  buyer_id: string;
  listing_id: string;
  quantity: number;
  total_price: number;
  order_status?: string;
}) => {
  const { data, error } = await supabase
    .from("buyer_orders")
    .insert([orderData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getVehicleBookings = async (userId: string) => {
  const { data, error } = await supabase
    .from("vehicle_bookings")
    .select("*, crop_listings(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const bookVehicle = async (bookingData: {
  user_id: string;
  distance_km: number;
  drop_mandi: "bandipalya_apmc" | "maddur_coconut" | "ramanagara_silk" | "chamarajanagar_turmeric";
  estimated_cost: number;
  listing_id?: string;
  pickup_label?: string;
  pickup_lat?: number;
  pickup_lng?: number;
  scheduled_at?: string;
  share_load: boolean;
  vehicle: "tata_ace" | "mahindra_bolero" | "eicher_14ft" | "tractor_trailer";
}) => {
  const { data, error } = await supabase
    .from("vehicle_bookings")
    .insert([bookingData])
    .select()
    .single();

  if (error) throw error;
  return data;
};
