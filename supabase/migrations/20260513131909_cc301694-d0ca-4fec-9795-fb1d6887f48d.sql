
-- Roles enum
CREATE TYPE public.app_role AS ENUM ('farmer', 'buyer', 'labourer');
CREATE TYPE public.labour_skill AS ENUM ('harvesting','sowing','ploughing','machine_operator','loading');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  role public.app_role NOT NULL,
  district TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Farmer details
CREATE TABLE public.farmer_details (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  primary_crop TEXT,
  farmer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.farmer_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own farmer select" ON public.farmer_details FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own farmer insert" ON public.farmer_details FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own farmer update" ON public.farmer_details FOR UPDATE USING (auth.uid() = user_id);

-- Buyer details
CREATE TABLE public.buyer_details (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.buyer_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own buyer select" ON public.buyer_details FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own buyer insert" ON public.buyer_details FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own buyer update" ON public.buyer_details FOR UPDATE USING (auth.uid() = user_id);

-- Labourer skills
CREATE TABLE public.labourer_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill public.labour_skill NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, skill)
);
ALTER TABLE public.labourer_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own skills select" ON public.labourer_skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own skills insert" ON public.labourer_skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own skills delete" ON public.labourer_skills FOR DELETE USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_farmer_updated BEFORE UPDATE ON public.farmer_details
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_buyer_updated BEFORE UPDATE ON public.buyer_details
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Auto-create profile on signup using metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone, role, district, language)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone'),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'farmer'),
    NEW.raw_user_meta_data->>'district',
    COALESCE(NEW.raw_user_meta_data->>'language', 'en')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
