-- Update profiles with missing columns
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS village TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS profile_image TEXT;

-- Update crop_listings with compatibility columns
ALTER TABLE public.crop_listings
  ADD COLUMN IF NOT EXISTS farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS crop_name TEXT,
  ADD COLUMN IF NOT EXISTS price_per_kg NUMERIC,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS images TEXT[],
  ADD COLUMN IF NOT EXISTS location TEXT;

-- Set farmer_id to user_id for existing records
UPDATE public.crop_listings 
SET farmer_id = user_id 
WHERE farmer_id IS NULL AND user_id IS NOT NULL;

-- Create buyer_orders table
CREATE TABLE IF NOT EXISTS public.buyer_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.crop_listings(id) ON DELETE CASCADE,
  quantity NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  order_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for buyer_orders
ALTER TABLE public.buyer_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow buyers to view their own orders" 
  ON public.buyer_orders FOR SELECT 
  USING (auth.uid() = buyer_id);

CREATE POLICY "Allow farmers to view orders on their listings" 
  ON public.buyer_orders FOR SELECT 
  USING (auth.uid() IN (SELECT user_id FROM public.crop_listings WHERE id = listing_id));

CREATE POLICY "Allow buyers to place orders" 
  ON public.buyer_orders FOR INSERT 
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Allow farmers to update order status" 
  ON public.buyer_orders FOR UPDATE 
  USING (auth.uid() IN (SELECT user_id FROM public.crop_listings WHERE id = listing_id));

-- Create labour_jobs table
CREATE TABLE IF NOT EXISTS public.labour_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  wage NUMERIC NOT NULL,
  workers_needed INTEGER DEFAULT 1,
  location TEXT,
  date DATE NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for labour_jobs
ALTER TABLE public.labour_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to view open jobs" 
  ON public.labour_jobs FOR SELECT 
  USING (true);

CREATE POLICY "Allow farmers to post jobs" 
  ON public.labour_jobs FOR INSERT 
  WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Allow farmers to update their own jobs" 
  ON public.labour_jobs FOR UPDATE 
  USING (auth.uid() = farmer_id);

-- Create labour_applications table
CREATE TABLE IF NOT EXISTS public.labour_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.labour_jobs(id) ON DELETE CASCADE,
  labourer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (job_id, labourer_id)
);

-- Enable RLS for labour_applications
ALTER TABLE public.labour_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow labourers to view their applications" 
  ON public.labour_applications FOR SELECT 
  USING (auth.uid() = labourer_id);

CREATE POLICY "Allow farmers to view applications for their jobs" 
  ON public.labour_applications FOR SELECT 
  USING (auth.uid() IN (SELECT farmer_id FROM public.labour_jobs WHERE id = job_id));

CREATE POLICY "Allow labourers to apply for jobs" 
  ON public.labour_applications FOR INSERT 
  WITH CHECK (auth.uid() = labourer_id);

CREATE POLICY "Allow farmers or labourers to update application status" 
  ON public.labour_applications FOR UPDATE 
  USING (
    auth.uid() = labourer_id OR 
    auth.uid() IN (SELECT farmer_id FROM public.labour_jobs WHERE id = job_id)
  );

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own notifications" 
  ON public.notifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update/mark their own notifications as read" 
  ON public.notifications FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow system notifications insertion" 
  ON public.notifications FOR INSERT 
  WITH CHECK (true);

-- Create equipment_rentals table
CREATE TABLE IF NOT EXISTS public.equipment_rentals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  equipment_name TEXT NOT NULL,
  rent_per_day NUMERIC NOT NULL,
  location TEXT,
  availability BOOLEAN DEFAULT true,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for equipment_rentals
ALTER TABLE public.equipment_rentals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to view equipment rentals" 
  ON public.equipment_rentals FOR SELECT 
  USING (true);

CREATE POLICY "Allow owners to list equipment" 
  ON public.equipment_rentals FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Allow owners to update their listings" 
  ON public.equipment_rentals FOR UPDATE 
  USING (auth.uid() = owner_id);

-- Create government_schemes table
CREATE TABLE IF NOT EXISTS public.government_schemes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  eligibility TEXT,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for government_schemes
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to view schemes" 
  ON public.government_schemes FOR SELECT 
  USING (true);
