// =============================================
// CONFIGURATION PAIEMENTS - SYSTÈME ÉVALUATION
// =============================================

export const PAYMENT_CONFIG = {
    // Étape 1: Évaluation
    evaluation: {
        amount: 10000, // 10 000 FCFA
        label: 'Évaluation du dossier',
        description: 'Analyse de votre éligibilité',
        requiredFor: 'evaluation',
        nextStep: 'tranche1',
    },
    // Étape 2: 1ère Tranche (après approbation)
    tranche1: {
        amount: 1000000, // 1 000 000 FCFA
        label: '1ère tranche - Démarrage',
        description: 'Lancement du processus de visa',
        requiredFor: 'service_start',
        nextStep: 'tranche2',
    },
    // Étape 3: 2ème Tranche (visa disponible)
    tranche2: {
        amount: 1500000, // 1 500 000 FCFA
        label: '2ème tranche - Finalisation',
        description: 'Paiement à la réception du visa',
        requiredFor: 'visa_delivery',
        nextStep: 'completed',
    },
} as const;

export type PaymentStageType = keyof typeof PAYMENT_CONFIG;

// Paystack Configuration
export const PAYSTACK_CONFIG = {
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxx',
    secretKey: import.meta.env.VITE_PAYSTACK_SECRET_KEY || 'sk_test_xxxx',
    currency: 'XOF', // Franc CFA
    channels: ['card', 'mobile_money', 'bank_transfer'],
};

// Callback URLs
export const PAYMENT_CALLBACKS = {
    success: '/dashboard/client',
    cancel: '/voyage',
    webhook: '/api/paystack/webhook',
};

// Helper pour formater le montant Paystack (en kobo pour XOF)
export const formatAmountForPaystack = (amount: number): number => {
    // Paystack XOF utilise la plus petite unité (pas de conversion nécessaire pour FCFA)
    return amount;
};

// Helper pour obtenir la config selon le payment_stage
export const getPaymentConfig = (stage: PaymentStageType) => {
    return PAYMENT_CONFIG[stage];
};

// Helper pour calculer le montant total du service
export const getTotalServiceFee = (): number => {
    return PAYMENT_CONFIG.tranche1.amount + PAYMENT_CONFIG.tranche2.amount;
};
