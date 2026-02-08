// =============================================
// CONSTANTES ASSISTANCE VOYAGE
// =============================================

export const TRAVEL_PROGRAM_TYPES = {
    general: {
        value: 'general',
        label: 'Voyage Général',
        description: 'Étude de dossier et préparation complète',
    },
    decreto_flussi: {
        value: 'decreto_flussi',
        label: 'Decreto Flussi (Italie)',
        description: 'Programme officiel de migration de travail',
        totalAmount: 1500000,
        installments: [
            { stage: 'stage_1', amount: 500000, label: 'Avant contrat' },
            { stage: 'stage_2', amount: 500000, label: 'Avant visa' },
            { stage: 'stage_3', amount: 500000, label: 'Après visa' },
        ],
    },
} as const;

export const TRAVEL_REQUEST_STATUS = {
    registration: {
        label: 'Inscription candidat',
        description: 'Création du profil et téléversement des documents',
        color: 'bg-blue-500',
        step: 1,
    },
    document_review: {
        label: 'Étude et validation',
        description: 'Analyse approfondie de votre dossier',
        color: 'bg-purple-500',
        step: 2,
    },
    application_submitted: {
        label: 'Soumission Decreto',
        description: 'Dépôt officiel de votre demande',
        color: 'bg-indigo-500',
        step: 3,
    },
    contract_obtained: {
        label: 'Obtention contrat',
        description: 'Réception de votre contrat de travail',
        color: 'bg-green-500',
        step: 4,
    },
    visa_application: {
        label: 'Demande de visa',
        description: 'Dépôt et traitement de votre demande',
        color: 'bg-yellow-500',
        step: 5,
    },
    visa_obtained: {
        label: 'Obtention visa',
        description: 'Réception de votre visa de travail',
        color: 'bg-teal-500',
        step: 6,
    },
    completed: {
        label: 'Départ & intégration',
        description: 'Accompagnement pour votre installation',
        color: 'bg-green-600',
        step: 7,
    },
    rejected: {
        label: 'Rejeté',
        description: 'Dossier non validé',
        color: 'bg-red-500',
        step: 0,
    },
    cancelled: {
        label: 'Annulé',
        description: 'Demande annulée',
        color: 'bg-gray-500',
        step: 0,
    },
} as const;

export const TRAVEL_DOCUMENT_TYPES = {
    passport: 'Passeport',
    photo: "Photo d'identité",
    birth_certificate: 'Acte de naissance',
    work_certificate: 'Attestation de travail',
    bank_statement: 'Relevés bancaires',
    motivation_letter: 'Lettre de motivation',
    other: 'Autre document',
} as const;

export const PAYMENT_STAGES = {
    stage_1: {
        label: '1ère tranche',
        description: 'Avant obtention du contrat',
        requiredStatus: 'contract_obtained',
    },
    stage_2: {
        label: '2ème tranche',
        description: 'Avant obtention du visa',
        requiredStatus: 'visa_obtained',
    },
    stage_3: {
        label: '3ème tranche',
        description: 'Après obtention du visa',
        requiredStatus: 'completed',
    },
} as const;

export const WHATSAPP_CONTACT = {
    phone: '+2250708080808',
    baseUrl: 'https://wa.me/',
    getUrl: (phone: string, message?: string) => {
        const url = `${WHATSAPP_CONTACT.baseUrl}${phone.replace(/[^0-9]/g, '')}`;
        return message ? `${url}?text=${encodeURIComponent(message)}` : url;
    },
    getDefaultMessage: (requestNumber: string) =>
        `Bonjour, je souhaite avoir des informations sur ma demande d'assistance voyage. Numéro de dossier: ${requestNumber}`,
} as const;

// Utility functions
export const formatPrice = (amount: number): string => {
    return `${amount.toLocaleString('fr-FR')} FCFA`;
};

export const getProgramByValue = (value: string) => {
    return Object.values(TRAVEL_PROGRAM_TYPES).find((prog) => prog.value === value);
};

export const getStatusByValue = (value: string) => {
    return TRAVEL_REQUEST_STATUS[value as keyof typeof TRAVEL_REQUEST_STATUS];
};

export const getPaymentStageByValue = (value: string) => {
    return PAYMENT_STAGES[value as keyof typeof PAYMENT_STAGES];
};

// Types TypeScript
export type TravelProgramType = 'general' | 'decreto_flussi';
export type TravelRequestStatus = keyof typeof TRAVEL_REQUEST_STATUS;
export type TravelDocumentType = keyof typeof TRAVEL_DOCUMENT_TYPES;
export type PaymentStage = keyof typeof PAYMENT_STAGES;
