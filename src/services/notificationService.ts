import { supabase } from "@/integrations/supabase/client";

export const getNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const createNotification = async (notificationData: {
  user_id: string;
  title: string;
  message: string;
  read?: boolean;
}) => {
  const { data, error } = await supabase
    .from("notifications")
    .insert([notificationData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
