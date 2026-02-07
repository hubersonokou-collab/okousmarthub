-- Extension du profil pour WhatsApp et informations complètes
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Côte d''Ivoire';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Table des traductions vocales
CREATE TABLE IF NOT EXISTS public.vocals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  original_language VARCHAR(10),
  translated_text TEXT NOT NULL,
  target_language VARCHAR(10) NOT NULL,
  audio_url TEXT,
  voice_used VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on vocals
ALTER TABLE public.vocals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vocals
CREATE POLICY "Users can view their own vocals" ON public.vocals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vocals" ON public.vocals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vocals" ON public.vocals
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all vocals" ON public.vocals
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Extension de transactions pour Paystack
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS paystack_reference TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS paystack_access_code TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Table des documents requis par service
CREATE TABLE IF NOT EXISTS public.service_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  document_name TEXT NOT NULL,
  is_required BOOLEAN DEFAULT true,
  description TEXT,
  display_order INT DEFAULT 0
);

-- Enable RLS on service_requirements
ALTER TABLE public.service_requirements ENABLE ROW LEVEL SECURITY;

-- Anyone can view service requirements
CREATE POLICY "Anyone can view service requirements" ON public.service_requirements
  FOR SELECT USING (true);

-- Admins can manage service requirements
CREATE POLICY "Admins can manage service requirements" ON public.service_requirements
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage bucket for vocals
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vocals', 'vocals', true)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for vocals bucket
CREATE POLICY "Anyone can view vocals files" ON storage.objects
  FOR SELECT USING (bucket_id = 'vocals');

CREATE POLICY "Authenticated users can upload vocals" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'vocals' AND auth.role() = 'authenticated');

-- Storage policies for avatars bucket
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for documents bucket
CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);