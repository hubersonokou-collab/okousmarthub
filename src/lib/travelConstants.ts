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
export type TravelProjectType = 'tourism' | 'business' | 'studies' | 'immigration' | 'family_reunion';
export type TravelCurrentSituation = 'student' | 'employee' | 'unemployed' | 'entrepreneur';
export type TravelRequestStatus = keyof typeof TRAVEL_REQUEST_STATUS;
export type TravelDocumentType = keyof typeof TRAVEL_DOCUMENT_TYPES;
export type PaymentStage = keyof typeof PAYMENT_STAGES;

// =============================================
// STATUTS D'ÉVALUATION
// =============================================

export const EVALUATION_STATUS = {
    pending: {
        value: 'pending',
        label: 'En attente d\'évaluation',
        color: 'bg-yellow-500',
        icon: '⏳',
        description: 'Votre dossier est en cours d\'analyse',
    },
    approved: {
        value: 'approved',
        label: 'Éligible',
        color: 'bg-green-500',
        icon: '✅',
        description: 'Votre dossier a été approuvé',
    },
    rejected: {
        value: 'rejected',
        label: 'Non éligible',
        color: 'bg-red-500',
        icon: '❌',
        description: 'Votre dossier n\'a pas été retenu',
    },
} as const;

export type EvaluationStatus = keyof typeof EVALUATION_STATUS;

export const PAYMENT_STAGE_NEW = {
    evaluation: {
        value: 'evaluation',
        label: 'Évaluation',
        amount: 10000,
        description: 'Paiement de l\'évaluation du dossier',
    },
    tranche1: {
        value: 'tranche1',
        label: '1ère tranche',
        amount: 1000000,
        description: 'Démarrage du processus',
    },
    tranche2: {
        value: 'tranche2',
        label: '2ème tranche',
        amount: 1500000,
        description: 'Visa disponible',
    },
    completed: {
        value: 'completed',
        label: 'Terminé',
        amount: 0,
        description: 'Paiement complet effectué',
    },
} as const;

export type PaymentStageNew = keyof typeof PAYMENT_STAGE_NEW;

// =============================================
// NOUVEAUX: TYPES DE PROJETS AVEC ÉVALUATION
// =============================================

export const TRAVEL_PROJECT_TYPES = {
    tourism: {
        value: 'tourism',
        label: 'Voyage Touristique',
        icon: '✈️',
        description: 'Voyage touristique et vacances',
        evaluationFee: 10000, // Évaluation obligatoire
        serviceFee: 2500000,  // Service complet après éligibilité
        tranche1: 1000000,    // 1ère tranche
        tranche2: 1500000,    // 2ème tranche (visa disponible)
    },
    business: {
        value: 'business',
        label: 'Voyage d\'Affaires',
        icon: '💼',
        description: 'Opportunités professionnelles à l\'étranger',
        evaluationFee: 10000,
        serviceFee: 2500000,
        tranche1: 1000000,
        tranche2: 1500000,
    },
    studies: {
        value: 'studies',
        label: 'Voyage d\'Études',
        icon: '🎓',
        description: 'Poursuivre des études à l\'étranger',
        evaluationFee: 10000,
        serviceFee: 2500000,
        tranche1: 1000000,
        tranche2: 1500000,
    },
    immigration: {
        value: 'immigration',
        label: 'Immigration / Installation',
        icon: '🏠',
        description: 'S\'installer définitivement à l\'étranger',
        evaluationFee: 10000,
        serviceFee: 2500000,
        tranche1: 1000000,
        tranche2: 1500000,
    },
    family_reunion: {
        value: 'family_reunion',
        label: 'Regroupement Familial',
        icon: '👨‍👩‍👧',
        description: 'Rejoindre un membre de la famille',
        evaluationFee: 10000,
        serviceFee: 2500000,
        tranche1: 1000000,
        tranche2: 1500000,
    },
} as const;

// =============================================
// DOCUMENTS REQUIS PAR TYPE DE PROJET
// =============================================

export const REQUIRED_DOCUMENTS_BY_PROJECT = {
    tourism: [
        { type: 'passport', label: 'Passeport (page d\'identité)', required: true },
        { type: 'photo', label: 'Photo d\'identité (fond blanc)', required: true },
        { type: 'bank_statements', label: 'Relevés bancaires (3 mois)', required: true },
        { type: 'hotel_booking', label: 'Réservation d\'hôtel', required: false },
        { type: 'return_ticket', label: 'Billet retour (si disponible)', required: false },
    ],
    business: [
        { type: 'passport', label: 'Passeport (page d\'identité)', required: true },
        { type: 'photo', label: 'Photo d\'identité (fond blanc)', required: true },
        { type: 'cv', label: 'Curriculum Vitae professionnel', required: true },
        { type: 'work_certificates', label: 'Certificats de travail', required: true },
        { type: 'company_docs', label: 'Documents entreprise', required: false },
        { type: 'bank_statements', label: 'Relevés bancaires (3 mois)', required: true },
        { type: 'invitation_letter', label: 'Lettre d\'invitation', required: false },
    ],
    studies: [
        { type: 'passport', label: 'Passeport (page d\'identité)', required: true },
        { type: 'photo', label: 'Photo d\'identité (fond blanc)', required: true },
        { type: 'diplomas', label: 'Derniers diplômes obtenus', required: true },
        { type: 'transcripts', label: 'Relevés de notes (3 dernières années)', required: true },
        { type: 'cv', label: 'Curriculum Vitae détaillé', required: true },
        { type: 'bank_statements', label: 'Relevés bancaires (3 mois)', required: true },
        { type: 'admission_letter', label: 'Lettre d\'admission (si disponible)', required: false },
    ],
    immigration: [
        { type: 'passport', label: 'Passeport (page d\'identité)', required: true },
        { type: 'photo', label: 'Photo d\'identité (fond blanc)', required: true },
        { type: 'birth_certificate', label: 'Acte de naissance', required: true },
        { type: 'cv', label: 'Curriculum Vitae complet', required: true },
        { type: 'diplomas', label: 'Diplômes et certifications', required: true },
        { type: 'work_certificates', label: 'Certificats de travail', required: true },
        { type: 'bank_statements', label: 'Relevés bancaires (6 mois)', required: true },
        { type: 'proof_of_funds', label: 'Preuve de ressources financières', required: true },
    ],
    family_reunion: [
        { type: 'passport', label: 'Passeport (page d\'identité)', required: true },
        { type: 'photo', label: 'Photo d\'identité (fond blanc)', required: true },
        { type: 'birth_certificate', label: 'Acte de naissance', required: true },
        { type: 'family_proof', label: 'Preuve de lien familial', required: true },
        { type: 'sponsor_documents', label: 'Documents du sponsor/garant', required: true },
        { type: 'bank_statements', label: 'Relevés bancaires', required: true },
    ],
} as const;

// =============================================
// PAYS POPULAIRES PAR PROJET
// =============================================

export const POPULAR_DESTINATIONS = {
    tourism: ['France', 'Espagne', 'Italie', 'Maroc', 'Sénégal', 'Dubai'],
    business: ['Canada', 'France', 'Allemagne', 'USA', 'UK', 'Dubai'],
    studies: ['Canada', 'France', 'USA', 'UK', 'Allemagne', 'Belgique'],
    immigration: ['Canada', 'Australie', 'Nouvelle-Zélande', 'UK', 'Portugal', 'Espagne'],
    family_reunion: ['France', 'Canada', 'USA', 'UK', 'Belgique'],
} as const;

// =============================================
// SITUATIONS ACTUELLES
// =============================================

export const CURRENT_SITUATIONS = {
    student: { label: 'Étudiant', icon: '📚' },
    employee: { label: 'Salarié', icon: '💼' },
    unemployed: { label: 'Sans emploi', icon: '🔍' },
    entrepreneur: { label: 'Entrepreneur', icon: '🚀' },
} as const;
