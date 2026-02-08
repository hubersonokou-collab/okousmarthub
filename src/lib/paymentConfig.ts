// =============================================
// CONFIGURATION PAIEMENTS - Multi-méthodes
// =============================================

export const PAYMENT_METHODS = {
    orange_money: {
        id: 'orange_money',
        name: 'Orange Money',
        icon: '🟠',
        available: true,
        countries: ['CI'], // Côte d'Ivoire
        fees: 0, // Pas de frais supplémentaires
    },
    wave: {
        id: 'wave',
        name: 'Wave',
        icon: '🌊',
        available: true,
        countries: ['CI', 'SN'],
        fees: 0,
    },
    mtn_momo: {
        id: 'mtn_momo',
        name: 'MTN Mobile Money',
        icon: '📱',
        available: false, // À activer plus tard
        countries: ['CI', 'GH'],
        fees: 0,
    },
    stripe: {
        id: 'stripe',
        name: 'Carte Bancaire',
        icon: '💳',
        available: true,
        countries: ['ALL'], // International
        fees: 0.029, // 2.9% + 0.30€
    },
    paypal: {
        id: 'paypal',
        name: 'PayPal',
        icon: '🅿️',
        available: true,
        countries: ['ALL'],
        fees: 0.034, // 3.4% + frais fixes
    },
    bank_transfer: {
        id: 'bank_transfer',
        name: 'Virement Bancaire',
        icon: '🏦',
        available: true,
        countries: ['ALL'],
        fees: 0,
        requiresProof: true, // Nécessite upload preuve
    },
} as const;

// Configuration Orange Money CI
export const ORANGE_MONEY_CONFIG = {
    apiUrl: process.env.VITE_ORANGE_MONEY_API_URL || 'https://api.orange.com/orange-money-webpay/ci/v1',
    merchantKey: process.env.VITE_ORANGE_MONEY_MERCHANT_KEY || '',
    returnUrl: `${window.location.origin}/payment/callback`,
    cancelUrl: `${window.location.origin}/payment/cancel`,
    notifUrl: `${window.location.origin}/api/payment/notify`,
};

// Configuration Wave
export const WAVE_CONFIG = {
    apiUrl: process.env.VITE_WAVE_API_URL || 'https://api.wave.com/v1',
    apiKey: process.env.VITE_WAVE_API_KEY || '',
    businessId: process.env.VITE_WAVE_BUSINESS_ID || '',
    currency: 'XOF', // Franc CFA
};

// Configuration Stripe
export const STRIPE_CONFIG = {
    publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    currency: 'xof', // Franc CFA pour Stripe
};

// Configuration PayPal
export const PAYPAL_CONFIG = {
    clientId: process.env.VITE_PAYPAL_CLIENT_ID || '',
    currency: 'USD', // PayPal ne supporte pas XOF directement
};

// Taux de conversion (informationnel, à mettre à jour)
export const EXCHANGE_RATES = {
    XOF_TO_USD: 0.0016, // 1 FCFA ≈ 0.0016 USD
    XOF_TO_EUR: 0.0015, // 1 FCFA ≈ 0.0015 EUR
    USD_TO_XOF: 625,
    EUR_TO_XOF: 656,
};

// Utilitaires conversion
export const convertCurrency = (amount: number, from: string, to: string): number => {
    const rate = EXCHANGE_RATES[`${from}_TO_${to}` as keyof typeof EXCHANGE_RATES];
    return rate ? Math.round(amount * rate) : amount;
};

export const formatCurrency = (amount: number, currency: string = 'XOF'): string => {
    switch (currency) {
        case 'XOF':
            return `${amount.toLocaleString('fr-FR')} FCFA`;
        case 'USD':
            return `$${amount.toFixed(2)}`;
        case 'EUR':
            return `€${amount.toFixed(2)}`;
        default:
            return `${amount} ${currency}`;
    }
};

// Types TypeScript
export type PaymentMethodId = keyof typeof PAYMENT_METHODS;

export interface PaymentIntent {
    id: string;
    requestId: string;
    amount: number;
    currency: string;
    method: PaymentMethodId;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    reference?: string;
    proofUrl?: string;
    createdAt: string;
}
