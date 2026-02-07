-- Add image_url column to services table
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image_url column to formations table
ALTER TABLE public.formations ADD COLUMN IF NOT EXISTS image_url TEXT;