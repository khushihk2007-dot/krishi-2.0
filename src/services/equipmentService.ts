import { supabase } from "@/integrations/supabase/client";
import { createNotification } from "@/services/notificationService";

export type VehicleType = "tata_ace" | "mahindra_bolero" | "eicher_14ft" | "tractor_trailer";
export type MandiDestination = "bandipalya_apmc" | "maddur_coconut" | "ramanagara_silk" | "chamarajanagar_turmeric";

export const VEHICLE_LABELS: Record<VehicleType, string> = {
  tata_ace: "Tata Ace (Mini Truck)",
  mahindra_bolero: "Mahindra Bolero Pickup",
  eicher_14ft: "Eicher 14ft Truck",
  tractor_trailer: "Tractor with Trailer",
};

export const MANDI_LABELS: Record<MandiDestination, string> = {
  bandipalya_apmc: "Bandipalya APMC, Mysuru",
  maddur_coconut: "Maddur Coconut Market",
  ramanagara_silk: "Ramanagara Silk Market",
  chamarajanagar_turmeric: "Chamarajanagar Turmeric Market",
};

/** Cost per km per vehicle type (₹) */
export const RATE_PER_KM: Record<VehicleType, number> = {
  tata_ace: 18,
  mahindra_bolero: 22,
  eicher_14ft: 32,
  tractor_trailer: 28,
};

export const estimateCost = (vehicle: VehicleType, distanceKm: number): number =>
  Math.round(RATE_PER_KM[vehicle] * distanceKm);

export const bookEquipment = async (bookingData: {
  user_id: string;
  vehicle: VehicleType;
  drop_mandi: MandiDestination;
  distance_km: number;
  estimated_cost: number;
  listing_id?: string;
  pickup_label?: string;
  pickup_lat?: number;
  pickup_lng?: number;
  scheduled_at?: string;
  share_load?: boolean;
}) => {
  const payload = {
    ...bookingData,
    share_load: bookingData.share_load ?? false,
    status: "booked" as const,
  };

  const { data, error } = await supabase
    .from("vehicle_bookings")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;

  // Notify the farmer
  await createNotification({
    user_id: bookingData.user_id,
    title: "Vehicle Booked 🚛",
    message: `${VEHICLE_LABELS[bookingData.vehicle]} booked to ${MANDI_LABELS[bookingData.drop_mandi]} — ₹${bookingData.estimated_cost} est.`,
  }).catch(console.error);

  return data;
};

export const getMyBookings = async (userId: string) => {
  const { data, error } = await supabase
    .from("vehicle_bookings")
    .select("*, crop_listings(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const updateBookingStatus = async (
  bookingId: string,
  status: "booked" | "out_for_pickup" | "at_mandi" | "sold",
) => {
  const { data, error } = await supabase
    .from("vehicle_bookings")
    .update({ status })
    .eq("id", bookingId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
