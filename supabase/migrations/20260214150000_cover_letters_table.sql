-- Create cover_letters table
CREATE TABLE IF NOT EXISTS public.cover_letters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL DEFAULT 'Ma Lettre de Motivation',
    content TEXT, -- Stockera le contenu HTML ou Markdown de la lettre
    target_company TEXT,
    job_title TEXT,
    job_description TEXT, -- Pour donner du contexte à l'IA si besoin de regénérer
    tone TEXT DEFAULT 'professional', -- 'professional', 'creative', 'enthusiastic'
    status TEXT DEFAULT 'draft', -- 'draft', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own cover letters"
    ON public.cover_letters FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cover letters"
    ON public.cover_letters FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cover letters"
    ON public.cover_letters FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cover letters"
    ON public.cover_letters FOR DELETE
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_cover_letters_updated_at
    BEFORE UPDATE ON public.cover_letters
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();
