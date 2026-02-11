-- Migration: AI Professional Photo Generation
-- Created: 2026-02-11
-- Description: Add AI photo generation feature for professional CV photos

-- ========================================
-- Table: ai_photos
-- Description: Store AI-generated professional photos
-- ========================================
CREATE TABLE IF NOT EXISTS ai_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_photo_url TEXT NOT NULL,
  generated_photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  style TEXT NOT NULL CHECK (style IN ('corporate', 'casual_professional', 'creative', 'executive')),
  gender TEXT CHECK (gender IN ('male', 'female', 'neutral')),
  background_color TEXT DEFAULT '#FFFFFF',
  facial_features JSONB,
  generation_params JSONB,
  credits_used INTEGER DEFAULT 3,
  ai_model TEXT DEFAULT 'stable-diffusion-xl',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_ai_photos_user_id ON ai_photos(user_id);
CREATE INDEX idx_ai_photos_created_at ON ai_photos(created_at DESC);
CREATE INDEX idx_ai_photos_favorites ON ai_photos(user_id, is_favorite) WHERE is_favorite = true;

-- ========================================
-- Update credit_costs table
-- ========================================
INSERT INTO credit_costs (action_type, credits_required, description) VALUES
('ai_photo_generation', 3, 'Génération photo professionnelle IA'),
('ai_photo_regeneration', 2, 'Régénération avec même photo source')
ON CONFLICT (action_type) DO NOTHING;

-- ========================================
-- Row Level Security
-- ========================================
ALTER TABLE ai_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI photos"
  ON ai_photos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own AI photos"
  ON ai_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI photos"
  ON ai_photos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own AI photos"
  ON ai_photos FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- Triggers
-- ========================================
CREATE TRIGGER update_ai_photos_updated_at BEFORE UPDATE ON ai_photos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Helper Function: Get user's AI photos count
-- ========================================
CREATE OR REPLACE FUNCTION get_user_ai_photos_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM ai_photos
  WHERE user_id = p_user_id;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- Helper Function: Get photo generation stats
-- ========================================
CREATE OR REPLACE FUNCTION get_photo_generation_stats(p_user_id UUID)
RETURNS TABLE (
  total_generated INTEGER,
  total_credits_used INTEGER,
  favorite_count INTEGER,
  most_used_style TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_generated,
    SUM(credits_used)::INTEGER as total_credits_used,
    COUNT(*) FILTER (WHERE is_favorite = true)::INTEGER as favorite_count,
    (
      SELECT style 
      FROM ai_photos 
      WHERE user_id = p_user_id 
      GROUP BY style 
      ORDER BY COUNT(*) DESC 
      LIMIT 1
    ) as most_used_style
  FROM ai_photos
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- Storage Bucket Setup Instructions
-- ========================================
-- Note: This bucket must be created manually in Supabase Dashboard
-- Bucket name: profile-photos
-- Settings:
--   - Public: false
--   - File size limit: 10MB
--   - Allowed MIME types: image/jpeg, image/png, image/webp

-- Storage Policies (to be applied after bucket creation):
/*
CREATE POLICY "Users can upload own profile photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'profile-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own profile photos" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'profile-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own profile photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'profile-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
*/
