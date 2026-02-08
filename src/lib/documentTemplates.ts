// =============================================
// TEMPLATES DE DOCUMENTS PAR PROJET
// =============================================

export interface DocumentTemplate {
    type: string;
    label: string;
    required: boolean;
    description?: string;
    maxSize?: number; // en MB
    acceptedFormats?: string[];
    example?: string;
}

// Templates documents communs
const COMMON_DOCUMENTS: DocumentTemplate[] = [
    {
        type: 'passport',
        label: 'Passeport',
        required: true,
        description: 'Page d\'identité lisible, minimum 6 mois de validité',
        maxSize: 5,
        acceptedFormats: ['PDF', 'JPG', 'PNG'],
        example: 'Scan haute qualité de la page avec photo',
    },
    {
        type: 'photo',
        label: 'Photo d\'identité',
        required: true,
        description: 'Format visa - Fond blanc, 5x5cm',
        maxSize: 2,
        acceptedFormats: ['JPG', 'PNG'],
        example: 'Photo récente datant de moins de 6 mois',
    },
];

// Documents spécifiques par projet
export const DOCUMENT_TEMPLATES_BY_PROJECT = {
    studies: [
        ...COMMON_DOCUMENTS,
        {
            type: 'diplomas',
            label: 'Diplômes',
            required: true,
            description: 'Tous les diplômes obtenus (BAC, Licence, etc.)',
            maxSize: 10,
            acceptedFormats: ['PDF'],
        },
        {
            type: 'transcripts',
            label: 'Relevés de notes',
            required: true,
            description: 'Relevés des 3 dernières années académiques',
            maxSize: 10,
            acceptedFormats: ['PDF'],
        },
        {
            type: 'cv',
            label: 'Curriculum Vitae',
            required: true,
            description: 'CV académique détaillant votre parcours',
            maxSize: 2,
            acceptedFormats: ['PDF'],
        },
        {
            type: 'bank_statements',
            label: 'Relevés bancaires',
            required: true,
            description: 'Les 3 derniers mois de relevés',
            maxSize: 10,
            acceptedFormats: ['PDF'],
        },
        {
            type: 'admission_letter',
            label: 'Lettre d\'admission',
            required: false,
            description: 'Lettre d\'acceptation de l\'université (si disponible)',
            maxSize: 5,
            acceptedFormats: ['PDF'],
        },
    ],

    work: [
        ...COMMON_DOCUMENTS,
        {
            type: 'cv',
            label: 'Curriculum Vitae',
            required: true,
            description: 'CV professionnel complet',
            maxSize: 2,
            acceptedFormats: ['PDF'],
        },
        {
            type: 'work_certificates',
            label: 'Certificats de travail',
            required: true,
            description: 'Attestations de tous vos employeurs précédents',
            maxSize: 10,
            acceptedFormats: ['PDF'],
        },
        {
            type: 'diplomas',
            label: 'Diplômes et certifications',
            required: true,
            description: 'Diplômes académiques et certifications professionnelles',
            maxSize: 10,
            acceptedFormats: ['PDF'],
        },
        {
            type: 'bank_statements',
            label: 'Relevés bancaires',
            required: true,
            description: 'Les 3 derniers mois de relevés',
            maxSize: 10,
            acceptedFormats: ['PDF'],
        },
        {
            type: 'job_offer',
            label: 'Offre d\'emploi',
            required: false,
            description: 'Lettre d\'offre d\'emploi à l\'étranger (si disponible)',
            maxSize: 5,
            acceptedFormats: ['PDF'],
        },
    ],

    tourism: [
        ...COMMON_DOCUMENTS,
        {
            type: 'bank_statements',
            label: 'Relevés bancaires',
            required: true,
            description: 'Preuve de capacité financière pour le voyage',
            maxSize: 10,
            acceptedFormats: ['PDF'],
        },
        {
            type: 'hotel_booking',
            label: 'Réservation d\'hôtel',
            required: false,
            description: 'Confirmation de réservation d\'hébergement',
            maxSize: 5,
            acceptedFormats: ['PDF', 'JPG', 'PNG'],
        },
        {
            type: 'return_ticket',
            label: 'Billet retour',
            required: false,
            description: 'Billet d\'avion aller-retour (si déjà réservé)',
            maxSize: 5,
            acceptedFormats: ['PDF', 'JPG', 'PNG'],
        },
    ],

    family_reunion: [
        ...COMMON_DOCUMENTS,
        {
            type: 'birth_certificate',
            label: 'Acte de naissance',
            required: true,
            description: 'Acte de naissance original certifié',
            maxSize: 5,
            acceptedFormats: ['PDF'],
        },
        {
            type: 'family_proof',
            label: 'Preuve de lien familial',
            required: true,
            description: 'Documents prouvant votre relation familiale',
            maxSize: 10,
            acceptedFormats: ['PDF'],
        },
        {
            type: 'sponsor_documents',
            label: 'Documents du sponsor',
            required: true,
            description: 'Carte de séjour, fiches de paie du membre de famille',
            maxSize: 10,
            acceptedFormats: ['PDF'],
        },
        {
            type: 'bank_statements',
            label: 'Relevés bancaires',
            required: true,
            description: 'Relevés bancaires du sponsor',
            maxSize: 10,
            acceptedFormats: ['PDF'],
        },
    ],
} as const;

// Utilitaire pour obtenir les documents requis
export const getDocumentsByProject = (projectType: keyof typeof DOCUMENT_TEMPLATES_BY_PROJECT) => {
    return DOCUMENT_TEMPLATES_BY_PROJECT[projectType] || [];
};

// Utilitaire pour vérifier si un format est accepté
export const isFileFormatAccepted = (fileName: string, acceptedFormats: string[]): boolean => {
    const extension = fileName.split('.').pop()?.toUpperCase();
    return extension ? acceptedFormats.includes(extension) : false;
};

// Utilitaire pour vérifier la taille du fichier
export const isFileSizeValid = (fileSizeBytes: number, maxSizeMB: number): boolean => {
    const fileSizeMB = fileSizeBytes / (1024 * 1024);
    return fileSizeMB <= maxSizeMB;
};

// Messages d'erreur pour validation
export const VALIDATION_MESSAGES = {
    FILE_TOO_LARGE: (maxSize: number) => `Le fichier est trop volumineux. Taille maximum: ${maxSize} MB`,
    FORMAT_NOT_ACCEPTED: (formats: string[]) => `Format non accepté. Formats acceptés: ${formats.join(', ')}`,
    REQUIRED_DOCUMENT: 'Ce document est obligatoire',
    UPLOAD_FAILED: 'Échec du téléversement. Veuillez réessayer.',
} as const;
