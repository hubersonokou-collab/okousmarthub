// =============================================
// CONSTANTES VAP/VAE
// =============================================

export const VAP_VAE_LEVELS = {
    DUT: {
        value: 'DUT',
        label: 'DUT',
        description: 'Diplôme Universitaire de Technologie',
        price: 200000,
        advance: 150000,
    },
    LICENCE: {
        value: 'LICENCE',
        label: 'Licence',
        description: 'Licence Professionnelle',
        price: 500000,
        advance: 400000,
    },
    MASTER: {
        value: 'MASTER',
        label: 'Master',
        description: 'Master Professionnel',
        price: 1000000,
        advance: 600000,
    },
} as const;

export const SUPPORT_TYPES = {
    standard: {
        value: 'standard',
        label: 'Suivi Standard',
        description: 'Traitement normal de votre dossier',
    },
    priority: {
        value: 'priority',
        label: 'Suivi Prioritaire',
        description: 'Traitement accéléré avec notifications fréquentes',
    },
    personalized: {
        value: 'personalized',
        label: 'Accompagnement Personnalisé',
        description: 'Aide individuelle avec accompagnateur dédié',
    },
} as const;

export const VAP_VAE_REQUEST_STATUS = {
    pending: {
        label: 'En attente',
        description: 'Dossier reçu, en attente de traitement',
        color: 'bg-yellow-500',
        icon: 'Clock',
    },
    processing: {
        label: 'En traitement',
        description: 'Dossier en cours de préparation',
        color: 'bg-blue-500',
        icon: 'FileText',
    },
    document_review: {
        label: 'Révision documents',
        description: 'Vérification et contrôle des pièces',
        color: 'bg-indigo-500',
        icon: 'Search',
    },
    validation_pending: {
        label: 'En validation',
        description: 'Dossier soumis pour validation officielle',
        color: 'bg-purple-500',
        icon: 'CheckCircle',
    },
    completed: {
        label: 'Terminé',
        description: 'Validation obtenue avec succès',
        color: 'bg-green-500',
        icon: 'CheckCircle2',
    },
    rejected: {
        label: 'Rejeté',
        description: 'Dossier non validé',
        color: 'bg-red-500',
        icon: 'XCircle',
    },
    cancelled: {
        label: 'Annulé',
        description: 'Demande annulée',
        color: 'bg-gray-500',
        icon: 'Ban',
    },
} as const;

export const PAYMENT_TYPES = {
    advance: 'Avance',
    balance: 'Solde',
} as const;

export const NOTIFICATION_MESSAGES = {
    REQUEST_SUBMITTED: 'Votre demande VAP/VAE a été enregistrée avec succès !',
    REQUEST_SUBMITTED_DESC: 'Vous allez recevoir un email de confirmation avec votre numéro de dossier.',
    PAYMENT_REQUIRED: 'Paiement requis pour finaliser votre inscription',
    PAYMENT_SUCCESS: 'Paiement effectué avec succès !',
    PAYMENT_FAILED: 'Le paiement a échoué. Veuillez réessayer.',
    STATUS_UPDATED: 'Le statut de votre dossier a été mis à jour',
} as const;

export const VAP_VAE_PROCESS_STEPS = [
    {
        number: 1,
        title: 'Analyse du profil',
        description: 'Étude du parcours professionnel et vérification de l\'éligibilité',
        icon: 'UserSearch',
    },
    {
        number: 2,
        title: 'Constitution du dossier',
        description: 'Préparation des CV, attestations et justificatifs',
        icon: 'FolderOpen',
    },
    {
        number: 3,
        title: 'Rédaction académique',
        description: 'Structuration conforme aux normes universitaires',
        icon: 'PenTool',
    },
    {
        number: 4,
        title: 'Dépôt et validation',
        description: 'Dépôt officiel et suivi administratif complet',
        icon: 'Award',
    },
] as const;

export const WHATSAPP_CONFIG = {
    phone: '+2250708080808',
    baseUrl: 'https://wa.me/',
    getUrl: (phone: string, message?: string) => {
        const url = `${WHATSAPP_CONFIG.baseUrl}${phone.replace(/[^0-9]/g, '')}`;
        return message ? `${url}?text=${encodeURIComponent(message)}` : url;
    },
    getDefaultMessage: (requestNumber: string) =>
        `Bonjour, je souhaite avoir des informations sur ma demande VAP/VAE. Numéro de dossier: ${requestNumber}`,
} as const;

// Utility functions
export const formatPrice = (amount: number): string => {
    return `${amount.toLocaleString('fr-FR')} FCFA`;
};

export const calculateBalance = (total: number, advance: number): number => {
    return total - advance;
};

export const getLevelByValue = (value: string) => {
    return Object.values(VAP_VAE_LEVELS).find((level) => level.value === value);
};

export const getSupportTypeByValue = (value: string) => {
    return Object.values(SUPPORT_TYPES).find((type) => type.value === value);
};

// Types TypeScript
export type VAPVAELevel = keyof typeof VAP_VAE_LEVELS;
export type VAPVAEStatus = keyof typeof VAP_VAE_REQUEST_STATUS;
export type SupportType = keyof typeof SUPPORT_TYPES;
export type PaymentType = keyof typeof PAYMENT_TYPES;
