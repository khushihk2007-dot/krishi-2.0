import { supabase } from "@/integrations/supabase/client";

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
  workers_needed: number;
  location?: string;
  date: string;
  status?: string;
}) => {
  const { data, error } = await supabase
    .from("labour_jobs")
    .insert([jobData])
    .select()
    .single();

  if (error) throw error;
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
  return data;
};
