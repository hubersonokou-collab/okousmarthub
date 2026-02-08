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
export type TravelProjectType = 'studies' | 'work' | 'tourism' | 'family_reunion';
export type TravelCurrentSituation = 'student' | 'employee' | 'unemployed' | 'entrepreneur';
export type TravelRequestStatus = keyof typeof TRAVEL_REQUEST_STATUS;
export type TravelDocumentType = keyof typeof TRAVEL_DOCUMENT_TYPES;
export type PaymentStage = keyof typeof PAYMENT_STAGES;

// =============================================
// NOUVEAUX: TYPES DE PROJETS
// =============================================

export const TRAVEL_PROJECT_TYPES = {
    studies: {
        value: 'studies',
        label: 'Études',
        icon: '🎓',
        description: 'Poursuivre des études à l\'étranger',
        baseFee: 50000, // FCFA
    },
    work: {
        value: 'work',
        label: 'Travail',
        icon: '💼',
        description: 'Opportunités professionnelles à l\'étranger',
        baseFee: 75000,
    },
    tourism: {
        value: 'tourism',
        label: 'Tourisme',
        icon: '✈️',
        description: 'Voyage touristique et vacances',
        baseFee: 30000,
    },
    family_reunion: {
        value: 'family_reunion',
        label: 'Regroupement Familial',
        icon: '👨‍👩‍👧',
        description: 'Rejoindre un membre de la famille',
        baseFee: 60000,
    },
} as const;

// =============================================
// DOCUMENTS REQUIS PAR TYPE DE PROJET
// =============================================

export const REQUIRED_DOCUMENTS_BY_PROJECT = {
    studies: [
        { type: 'passport', label: 'Passeport (page d\'identité)', required: true },
        { type: 'photo', label: 'Photo d\'identité (fond blanc)', required: true },
        { type: 'diplomas', label: 'Derniers diplômes obtenus', required: true },
        { type: 'transcripts', label: 'Relevés de notes (3 dernières années)', required: true },
        { type: 'cv', label: 'Curriculum Vitae détaillé', required: true },
        { type: 'bank_statements', label: 'Relevés bancaires (3 mois)', required: true },
        { type: 'admission_letter', label: 'Lettre d\'admission (si disponible)', required: false },
    ],
    work: [
        { type: 'passport', label: 'Passeport (page d\'identité)', required: true },
        { type: 'photo', label: 'Photo d\'identité (fond blanc)', required: true },
        { type: 'cv', label: 'Curriculum Vitae professionnel', required: true },
        { type: 'work_certificates', label: 'Certificats de travail', required: true },
        { type: 'diplomas', label: 'Diplômes et certifications', required: true },
        { type: 'bank_statements', label: 'Relevés bancaires (3 mois)', required: true },
        { type: 'job_offer', label: 'Offre d\'emploi (si disponible)', required: false },
    ],
    tourism: [
        { type: 'passport', label: 'Passeport (page d\'identité)', required: true },
        { type: 'photo', label: 'Photo d\'identité (fond blanc)', required: true },
        { type: 'bank_statements', label: 'Relevés bancaires (3 mois)', required: true },
        { type: 'hotel_booking', label: 'Réservation d\'hôtel', required: false },
        { type: 'return_ticket', label: 'Billet retour (si disponible)', required: false },
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
    studies: ['Canada', 'France', 'USA', 'UK', 'Allemagne', 'Belgique'],
    work: ['Canada', 'Italie', 'Allemagne', 'France', 'Espagne', 'Portugal'],
    tourism: ['France', 'Espagne', 'Italie', 'Maroc', 'Sénégal', 'Dubai'],
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
