-- Migration: Bulk bonus credits to all users
-- Created: 2026-02-26
-- Description: Grant +100 credits to all existing users (CV, cover letters, etc.)

-- Ensure every auth user has a user_credits row
INSERT INTO user_credits (
  user_id,
  user_email,
  credits_used,
  credits_remaining,
  total_credits_purchased,
  created_at,
  updated_at
)
SELECT
  au.id,
  au.email,
  0 as credits_used,
  0 as credits_remaining,
  0 as total_credits_purchased,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users au
LEFT JOIN user_credits uc ON au.id = uc.user_id
WHERE uc.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

WITH eligible_users AS (
  SELECT au.id AS user_id
  FROM auth.users au
  WHERE NOT EXISTS (
    SELECT 1
    FROM credit_transactions ct
    WHERE ct.user_id = au.id
      AND ct.payment_reference = 'BULK_BONUS_20260226_100'
  )
), updated_users AS (
  -- Apply bulk bonus only to eligible users (idempotent)
  UPDATE user_credits uc
  SET
    credits_remaining = uc.credits_remaining + 100,
    updated_at = NOW()
  WHERE uc.user_id IN (SELECT user_id FROM eligible_users)
  RETURNING uc.user_id
)
-- Log the bonus transaction only for users actually updated
INSERT INTO credit_transactions (
  user_id,
  transaction_type,
  credits_amount,
  action_type,
  description,
  payment_reference
)
SELECT
  uu.user_id,
  'bonus' as transaction_type,
  100 as credits_amount,
  NULL as action_type,
  'Bonus: +100 crédits (campagne globale)' as description,
  'BULK_BONUS_20260226_100' as payment_reference
FROM updated_users uu;
