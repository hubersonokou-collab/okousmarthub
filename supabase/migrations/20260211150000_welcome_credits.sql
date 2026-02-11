-- Migration: Welcome Credits System
-- Created: 2026-02-11
-- Description: Add automatic welcome credits for new users

-- ========================================
-- Update add_credits function to track welcome bonus
-- ========================================

-- Add welcome_bonus_given column to user_credits
ALTER TABLE user_credits ADD COLUMN IF NOT EXISTS welcome_bonus_given BOOLEAN DEFAULT false;

-- ========================================
-- Function: Give welcome credits to new users
-- ========================================
CREATE OR REPLACE FUNCTION give_welcome_credits()
RETURNS TRIGGER AS $$
DECLARE
  v_welcome_credits INTEGER := 8; -- 2 CV/lettres (2x2) + 1 photo (3) + 1 bonus
BEGIN
  -- Insert initial credits record with welcome bonus
  INSERT INTO user_credits (
    user_id,
    credits_balance,
    total_purchased,
    total_used,
    welcome_bonus_given
  ) VALUES (
    NEW.id,
    v_welcome_credits,
    v_welcome_credits,
    0,
    true
  );

  -- Log the welcome credits transaction
  INSERT INTO credit_transactions (
    user_id,
    transaction_type,
    credits,
    description,
    payment_reference
  ) VALUES (
    NEW.id,
    'purchase',
    v_welcome_credits,
    'Crédits de bienvenue - Offre de démarrage',
    'WELCOME_BONUS'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- Trigger: Auto-give welcome credits on user signup
-- ========================================
DROP TRIGGER IF EXISTS on_user_created_give_welcome_credits ON auth.users;

CREATE TRIGGER on_user_created_give_welcome_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION give_welcome_credits();

-- ========================================
-- Update existing users without credits (optional)
-- ========================================
-- Uncomment the following to give welcome credits to existing users without credits

/*
INSERT INTO user_credits (user_id, credits_balance, total_purchased, total_used, welcome_bonus_given)
SELECT 
  au.id,
  8 as credits_balance,
  8 as total_purchased,
  0 as total_used,
  true as welcome_bonus_given
FROM auth.users au
LEFT JOIN user_credits uc ON au.id = uc.user_id
WHERE uc.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO credit_transactions (user_id, transaction_type, credits, description, payment_reference)
SELECT 
  au.id,
  'purchase' as transaction_type,
  8 as credits,
  'Crédits de bienvenue - Offre de démarrage' as description,
  'WELCOME_BONUS' as payment_reference
FROM auth.users au
LEFT JOIN credit_transactions ct ON au.id = ct.user_id AND ct.payment_reference = 'WELCOME_BONUS'
WHERE ct.id IS NULL;
*/
