-- Migration: Admin Dashboard Tables
-- Created: 2026-02-15
-- Tables: vap_vae_requests, user_credits, ai_usage_logs
-- Version: 3 (simplified - safe for first run)

-- =====================================================
-- CLEANUP: Drop existing tables if they exist
-- This will automatically drop all dependent objects (policies, triggers, etc.)
-- =====================================================

DROP TABLE IF EXISTS public.ai_usage_logs CASCADE;
DROP TABLE IF EXISTS public.user_credits CASCADE;
DROP TABLE IF EXISTS public.vap_vae_requests CASCADE;

-- Drop the helper function if it exists
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- =====================================================
-- 1. TABLE: vap_vae_requests
-- Purpose: Store VAP/VAE service requests
-- =====================================================
CREATE TABLE public.vap_vae_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Service Information
    service_type TEXT NOT NULL CHECK (service_type IN ('VAP', 'VAE')),
    
    -- Client Information
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    
    -- Request Details
    current_situation TEXT,
    target_diploma TEXT,
    experience_years INTEGER,
    
    -- Status Management
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'validated', 'rejected')),
    admin_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- 2. TABLE: user_credits
-- Purpose: Track user AI credits balance and usage
-- =====================================================
CREATE TABLE public.user_credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    
    -- User Information
    user_email TEXT,
    
    -- Credit Balance
    credits_used INTEGER DEFAULT 0 NOT NULL,
    credits_remaining INTEGER DEFAULT 0 NOT NULL,
    total_credits_purchased INTEGER DEFAULT 0 NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- 3. TABLE: ai_usage_logs
-- Purpose: Log all AI service usage for analytics
-- =====================================================
CREATE TABLE public.ai_usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- User Information
    user_email TEXT,
    
    -- Action Details
    action_type TEXT NOT NULL CHECK (action_type IN ('cv_generation', 'letter_generation', 'photo_generation', 'skill_suggestion', 'summary_enhancement')),
    credits_used INTEGER DEFAULT 1 NOT NULL,
    
    -- Additional Context (JSON for flexibility)
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

-- VAP/VAE Requests indexes
CREATE INDEX idx_vap_vae_requests_user_id ON public.vap_vae_requests(user_id);
CREATE INDEX idx_vap_vae_requests_status ON public.vap_vae_requests(status);
CREATE INDEX idx_vap_vae_requests_created_at ON public.vap_vae_requests(created_at DESC);

-- User Credits indexes
CREATE INDEX idx_user_credits_user_id ON public.user_credits(user_id);

-- AI Usage Logs indexes
CREATE INDEX idx_ai_usage_logs_user_id ON public.ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_action_type ON public.ai_usage_logs(action_type);
CREATE INDEX idx_ai_usage_logs_created_at ON public.ai_usage_logs(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.vap_vae_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: vap_vae_requests
-- =====================================================

-- Users can create their own requests
CREATE POLICY "Users can insert own VAP/VAE requests" 
ON public.vap_vae_requests 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Users can view their own requests
CREATE POLICY "Users can view own VAP/VAE requests" 
ON public.vap_vae_requests 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Service role can manage all requests
CREATE POLICY "Service role can manage all VAP/VAE requests" 
ON public.vap_vae_requests 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- =====================================================
-- RLS POLICIES: user_credits
-- =====================================================

-- Users can view their own credits
CREATE POLICY "Users can view own credits" 
ON public.user_credits 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Service role can manage all credits
CREATE POLICY "Service role can manage all credits" 
ON public.user_credits 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- =====================================================
-- RLS POLICIES: ai_usage_logs
-- =====================================================

-- Users can view their own usage logs
CREATE POLICY "Users can view own usage logs" 
ON public.ai_usage_logs 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Service role can manage all logs
CREATE POLICY "Service role can manage all usage logs" 
ON public.ai_usage_logs 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
CREATE TRIGGER set_updated_at_vap_vae_requests
    BEFORE UPDATE ON public.vap_vae_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_user_credits
    BEFORE UPDATE ON public.user_credits
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migration completed successfully!';
    RAISE NOTICE '📊 Created tables: vap_vae_requests, user_credits, ai_usage_logs';
    RAISE NOTICE '🔒 RLS policies enabled and configured';
    RAISE NOTICE '⚡ Indexes created for performance';
END $$;
