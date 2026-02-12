-- Script pour accorder des crédits manuellement à un utilisateur
-- Service: IA CV & Lettres
-- Date: 2026-02-11

-- Fonction pour accorder des crédits à un utilisateur par email
CREATE OR REPLACE FUNCTION grant_credits_to_user(
    user_email TEXT,
    credits_amount INTEGER,
    grant_description TEXT DEFAULT 'Crédits accordés manuellement'
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    user_id UUID,
    new_balance INTEGER
) AS $$
DECLARE
    v_user_id UUID;
    v_current_balance INTEGER;
    v_new_balance INTEGER;
BEGIN
    -- Trouver l'utilisateur par email
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = user_email;

    -- Vérifier si l'utilisateur existe
    IF v_user_id IS NULL THEN
        RETURN QUERY SELECT 
            FALSE,
            'Utilisateur non trouvé avec cet email: ' || user_email,
            NULL::UUID,
            NULL::INTEGER;
        RETURN;
    END IF;

    -- Vérifier si l'utilisateur a déjà un enregistrement de crédits
    SELECT credits_balance INTO v_current_balance
    FROM user_credits
    WHERE user_credits.user_id = v_user_id;

    -- Si pas d'enregistrement, créer un nouveau
    IF v_current_balance IS NULL THEN
        INSERT INTO user_credits (user_id, credits_balance, total_purchased, total_used)
        VALUES (v_user_id, credits_amount, 0, 0);
        
        v_new_balance := credits_amount;
    ELSE
        -- Mettre à jour le solde existant
        UPDATE user_credits
        SET credits_balance = credits_balance + credits_amount,
            updated_at = NOW()
        WHERE user_credits.user_id = v_user_id;
        
        v_new_balance := v_current_balance + credits_amount;
    END IF;

    -- Créer une transaction pour enregistrer l'ajout de crédits
    INSERT INTO credit_transactions (
        user_id,
        transaction_type,
        credits_amount,
        description,
        metadata
    ) VALUES (
        v_user_id,
        'bonus',
        credits_amount,
        grant_description,
        jsonb_build_object(
            'granted_at', NOW(),
            'granted_by', 'admin',
            'reason', grant_description
        )
    );

    -- Retourner le résultat
    RETURN QUERY SELECT 
        TRUE,
        'Crédits accordés avec succès. Solde: ' || v_current_balance::TEXT || ' → ' || v_new_balance::TEXT,
        v_user_id,
        v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- EXÉCUTION: Accorder 100 crédits à client1@gmail.com
-- ============================================

SELECT * FROM grant_credits_to_user(
    'client1@gmail.com',
    100,
    'Crédits de test accordés pour le service IA CV & Lettres'
);

-- Vérification du solde de crédits
SELECT 
    u.email,
    uc.credits_balance,
    uc.total_purchased,
    uc.total_used,
    uc.created_at,
    uc.updated_at
FROM auth.users u
LEFT JOIN user_credits uc ON u.id = uc.user_id
WHERE u.email = 'client1@gmail.com';

-- Vérification des transactions
SELECT 
    ct.created_at,
    ct.transaction_type,
    ct.credits_amount,
    ct.description,
    ct.metadata
FROM credit_transactions ct
JOIN auth.users u ON ct.user_id = u.id
WHERE u.email = 'client1@gmail.com'
ORDER BY ct.created_at DESC
LIMIT 10;
