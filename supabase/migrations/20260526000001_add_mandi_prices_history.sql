-- Create mandi_prices_history table to cache and log market rates over time
CREATE TABLE IF NOT EXISTS public.mandi_prices_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  market TEXT NOT NULL,
  commodity TEXT NOT NULL,
  variety TEXT NOT NULL,
  grade TEXT NOT NULL,
  arrival_date DATE NOT NULL,
  min_price NUMERIC NOT NULL,
  max_price NUMERIC NOT NULL,
  modal_price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_mandi_price_record UNIQUE (market, commodity, variety, arrival_date)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.mandi_prices_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public / anonymous) to query price history
CREATE POLICY "Allow public read access to mandi price history"
  ON public.mandi_prices_history FOR SELECT
  USING (true);

-- Allow anyone to insert historical price entries
CREATE POLICY "Allow public inserts of mandi price records"
  ON public.mandi_prices_history FOR INSERT
  WITH CHECK (true);
