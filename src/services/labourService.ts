import { supabase } from "@/integrations/supabase/client";
import { createNotification } from "@/services/notificationService";

export const getLabourJobs = async () => {
  const { data, error } = await supabase
    .from("labour_jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const postLabourJob = async (jobData: {
  farmer_id: string;
  title: string;
  description?: string;
  wage: number;
  workers_needed?: number;
  location?: string;
  date?: string;
  status?: string;
}) => {
  const { data, error } = await supabase
    .from("labour_jobs")
    .insert([jobData])
    .select()
    .single();

  if (error) throw error;

  // Notify the farmer that their job posting is live
  await createNotification({
    user_id: jobData.farmer_id,
    title: "Job Posted 📋",
    message: `Your job "${jobData.title}" is now live on the Labour Marketplace.`,
  }).catch(console.error);

  return data;
};

export const getLabourApplications = async (labourerId: string) => {
  const { data, error } = await supabase
    .from("labour_applications")
    .select("*, labour_jobs(*)")
    .eq("labourer_id", labourerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const applyForLabourJob = async (applicationData: {
  job_id: string;
  labourer_id: string;
  status?: string;
}) => {
  const { data, error } = await supabase
    .from("labour_applications")
    .insert([applicationData])
    .select()
    .single();

  if (error) throw error;

  // Notify the labourer that their application was submitted
  await createNotification({
    user_id: applicationData.labourer_id,
    title: "Application Submitted 👷",
    message: "Your job application has been submitted successfully.",
  }).catch(console.error);

  return data;
};

export const getJobsByFarmer = async (farmerId: string) => {
  const { data, error } = await supabase
    .from("labour_jobs")
    .select("*")
    .eq("farmer_id", farmerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
