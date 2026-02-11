-- Migration: AI CV & Cover Letter Service
-- Created: 2026-02-11
-- Description: Create tables for credit system, templates, and document generation

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- Table: credit_packs
-- Description: Define available credit packages
-- ========================================
CREATE TABLE IF NOT EXISTS credit_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL, -- Price in FCFA
  credits INTEGER NOT NULL,
  description TEXT,
  features JSONB, -- Array of features for this pack
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default credit packs
INSERT INTO credit_packs (name, price, credits, description, features, display_order) VALUES
('Starter', 2000, 10, 'Pack parfait pour débuter', '["1 CV complet", "1 lettre de motivation", "Support basique"]', 1),
('Pro', 5000, 30, 'Pour les chercheurs d''emploi actifs', '["3+ CV personnalisés", "3+ lettres adaptées", "2 traductions", "Support prioritaire"]', 2),
('Premium', 10000, 75, 'Solution complète illimitée', '["CV illimités du mois", "Lettres illimitées", "Traductions illimitées", "Analyse d''offres", "Support VIP 24/7"]', 3);

-- ========================================
-- Table: user_credits
-- Description: Track user credit balances
-- ========================================
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  credits_balance INTEGER DEFAULT 0 CHECK (credits_balance >= 0),
  total_purchased INTEGER DEFAULT 0,
  total_used INTEGER DEFAULT 0,
  last_purchase_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);

-- ========================================
-- Table: credit_transactions
-- Description: Log all credit movements
-- ========================================
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'usage', 'refund', 'bonus')),
  credits_amount INTEGER NOT NULL,
  action_type TEXT, -- 'cv_generation', 'letter_generation', 'translation', 'job_analysis', 'ats_optimization'
  pack_id UUID REFERENCES credit_packs(id),
  payment_reference TEXT,
  payment_status TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for queries
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(transaction_type);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);

-- ========================================
-- Table: cv_templates
-- Description: Store CV template configurations
-- ========================================
CREATE TABLE IF NOT EXISTS cv_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT NOT NULL CHECK (country IN ('canada', 'france', 'australia', 'usa')),
  template_type TEXT NOT NULL CHECK (template_type IN ('modern', 'classic', 'creative', 'executive', 'simple')),
  description TEXT,
  layout_config JSONB NOT NULL, -- Template structure and styling
  sections_config JSONB, -- Which sections to include and their order
  is_active BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  preview_image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for filtering
CREATE INDEX idx_cv_templates_country ON cv_templates(country);
CREATE INDEX idx_cv_templates_active ON cv_templates(is_active) WHERE is_active = true;

-- Insert default templates
INSERT INTO cv_templates (name, country, template_type, description, layout_config, sections_config, tags) VALUES
('Canadian Professional', 'canada', 'modern', 'Format nord-américain moderne avec focus sur accomplissements', '{"columns": 1, "fontSize": 11, "lineHeight": 1.4}', '["summary", "experience", "education", "skills", "certifications"]', ARRAY['professional', 'tech', 'business']),
('French Europass', 'france', 'classic', 'Format français standard Europass', '{"columns": 1, "fontSize": 10, "lineHeight": 1.3}', '["etat_civil", "experience", "formation", "competences", "langues", "loisirs"]', ARRAY['traditional', 'administration', 'education']),
('Australian Standard', 'australia', 'modern', 'CV australien avec références', '{"columns": 1, "fontSize": 11, "lineHeight": 1.4}', '["overview", "skills", "experience", "education", "referees"]', ARRAY['standard', 'corporate']),
('US Resume', 'usa', 'simple', 'Resume américain concis 1 page', '{"columns": 1, "fontSize": 11, "lineHeight": 1.2}', '["summary", "experience", "education", "skills"]', ARRAY['concise', 'ats-friendly']);

-- ========================================
-- Table: generated_documents
-- Description: Store all generated CVs and cover letters
-- ========================================
CREATE TABLE IF NOT EXISTS generated_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('cv', 'cover_letter')),
  template_id UUID REFERENCES cv_templates(id),
  country_standard TEXT,
  language TEXT NOT NULL DEFAULT 'fr',
  title TEXT, -- e.g., "CV Software Engineer - Google"
  content JSONB NOT NULL, -- Structured document data
  formatted_content TEXT, -- HTML or markdown formatted version
  job_offer_url TEXT,
  job_offer_analysis JSONB, -- AI analysis of job posting
  credits_used INTEGER NOT NULL DEFAULT 0,
  file_pdf_url TEXT, -- URL to generated PDF in Supabase Storage
  file_docx_url TEXT, -- URL to generated DOCX in Supabase Storage
  is_favorite BOOLEAN DEFAULT false,
  was_ats_optimized BOOLEAN DEFAULT false,
  ai_model_used TEXT, -- e.g., "gpt-4-turbo"
  generation_metadata JSONB, -- Additional info about generation
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_generated_documents_user_id ON generated_documents(user_id);
CREATE INDEX idx_generated_documents_type ON generated_documents(document_type);
CREATE INDEX idx_generated_documents_created_at ON generated_documents(created_at DESC);
CREATE INDEX idx_generated_documents_favorites ON generated_documents(user_id, is_favorite) WHERE is_favorite = true;

-- ========================================
-- Table: credit_costs
-- Description: Define credit costs for different actions
-- ========================================
CREATE TABLE IF NOT EXISTS credit_costs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_type TEXT NOT NULL UNIQUE,
  credits_required INTEGER NOT NULL CHECK (credits_required > 0),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default costs
INSERT INTO credit_costs (action_type, credits_required, description) VALUES
('cv_generation_basic', 2, 'Génération CV standard'),
('cover_letter_generation', 2, 'Génération lettre de motivation'),
('job_offer_analysis', 3, 'Analyse offre d''emploi + adaptation'),
('translation', 1, 'Traduction vers autre langue'),
('ats_optimization', 1, 'Optimisation ATS avancée'),
('template_premium', 1, 'Utilisation template premium');

-- ========================================
-- Functions
-- ========================================

-- Function: Get user credit balance
CREATE OR REPLACE FUNCTION get_user_credits(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  SELECT credits_balance INTO v_balance
  FROM user_credits
  WHERE user_id = p_user_id;
  
  IF v_balance IS NULL THEN
    -- Create record if doesn't exist
    INSERT INTO user_credits (user_id, credits_balance)
    VALUES (p_user_id, 0)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN 0;
  END IF;
  
  RETURN v_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Deduct credits (atomic operation)
CREATE OR REPLACE FUNCTION deduct_credits(
  p_user_id UUID,
  p_credits INTEGER,
  p_action_type TEXT,
  p_description TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_balance INTEGER;
BEGIN
  -- Lock the row for update
  SELECT credits_balance INTO v_current_balance
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  -- Check if user has enough credits
  IF v_current_balance IS NULL OR v_current_balance < p_credits THEN
    RETURN FALSE;
  END IF;
  
  -- Deduct credits
  UPDATE user_credits
  SET 
    credits_balance = credits_balance - p_credits,
    total_used = total_used + p_credits,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Log transaction
  INSERT INTO credit_transactions (
    user_id,
    transaction_type,
    credits_amount,
    action_type,
    description
  ) VALUES (
    p_user_id,
    'usage',
    -p_credits,
    p_action_type,
    p_description
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Add credits (for purchases)
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_credits INTEGER,
  p_pack_id UUID DEFAULT NULL,
  p_payment_reference TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Ensure user_credits record exists
  INSERT INTO user_credits (user_id, credits_balance, total_purchased)
  VALUES (p_user_id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Add credits
  UPDATE user_credits
  SET 
    credits_balance = credits_balance + p_credits,
    total_purchased = total_purchased + p_credits,
    last_purchase_at = NOW(),
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Log transaction
  INSERT INTO credit_transactions (
    user_id,
    transaction_type,
    credits_amount,
    pack_id,
    payment_reference
  ) VALUES (
    p_user_id,
    'purchase',
    p_credits,
    p_pack_id,
    p_payment_reference
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- Row Level Security (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE credit_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_costs ENABLE ROW LEVEL SECURITY;

-- Policies for credit_packs (public read)
CREATE POLICY "Anyone can view active credit packs"
  ON credit_packs FOR SELECT
  USING (is_active = true);

-- Policies for user_credits (users can only see their own)
CREATE POLICY "Users can view own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

-- Policies for credit_transactions (users can only see their own)
CREATE POLICY "Users can view own transactions"
  ON credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Policies for cv_templates (public read for active templates)
CREATE POLICY "Anyone can view active templates"
  ON cv_templates FOR SELECT
  USING (is_active = true);

-- Policies for generated_documents
CREATE POLICY "Users can view own documents"
  ON generated_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own documents"
  ON generated_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON generated_documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON generated_documents FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for credit_costs (public read)
CREATE POLICY "Anyone can view credit costs"
  ON credit_costs FOR SELECT
  USING (is_active = true);

-- ========================================
-- Triggers
-- ========================================

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_credit_packs_updated_at BEFORE UPDATE ON credit_packs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_credits_updated_at BEFORE UPDATE ON user_credits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cv_templates_updated_at BEFORE UPDATE ON cv_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_documents_updated_at BEFORE UPDATE ON generated_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_costs_updated_at BEFORE UPDATE ON credit_costs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Storage Buckets (to be created in Supabase dashboard or via API)
-- ========================================

-- Bucket: cv-documents (for generated PDFs and DOCX files)
-- Settings:
--   - Public: false
--   - File size limit: 10MB
--   - Allowed MIME types: application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document

-- Storage policy will be:
-- CREATE POLICY "Users can upload own documents" ON storage.objects
--   FOR INSERT TO authenticated
--   WITH CHECK (bucket_id = 'cv-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
--
-- CREATE POLICY "Users can view own documents" ON storage.objects
--   FOR SELECT TO authenticated
--   USING (bucket_id = 'cv-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
