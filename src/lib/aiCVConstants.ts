// AI CV Service - Constants
// Configuration and reference data

import { CountryCode, LanguageCode, ActionType } from '@/types/aiCVService';

// ===== Credit Costs =====

export const CREDIT_COSTS: Record<ActionType, number> = {
    cv_generation_basic: 2,
    cover_letter_generation: 2,
    job_offer_analysis: 3,
    translation: 1,
    ats_optimization: 1,
    template_premium: 1,
};

// ===== Country Standards =====

export const COUNTRY_STANDARDS: Record<CountryCode, {
    name: string;
    flag: string;
    cvLength: string;
    photoRequired: boolean;
    personalInfoRequired: string[];
    culturalNotes: string;
}> = {
    canada: {
        name: 'Canada',
        flag: '🇨🇦',
        cvLength: '1-2 pages',
        photoRequired: false,
        personalInfoRequired: ['name', 'email', 'phone'],
        culturalNotes: 'Focus on quantifiable achievements and action verbs. No personal information like age, marital status, or photo.',
    },
    france: {
        name: 'France',
        flag: '🇫🇷',
        cvLength: '1 page strict',
        photoRequired: true,
        personalInfoRequired: ['name', 'email', 'phone', 'address', 'dateOfBirth', 'nationality'],
        culturalNotes: 'Include État civil section. Photo professionnel required. Emphasis on education and soft skills.',
    },
    australia: {
        name: 'Australie',
        flag: '🇦🇺',
        cvLength: '2-3 pages',
        photoRequired: false,
        personalInfoRequired: ['name', 'email', 'phone'],
        culturalNotes: 'Detailed achievements and references section. Focus on results and impact.',
    },
    usa: {
        name: 'États-Unis',
        flag: '🇺🇸',
        cvLength: '1 page',
        photoRequired: false,
        personalInfoRequired: ['name', 'email', 'phone'],
        culturalNotes: 'Concise resume format. NO photo, age, marital status. Strong focus on measurable achievements.',
    },
};

// ===== Language Support =====

export const SUPPORTED_LANGUAGES: Record<LanguageCode, {
    name: string;
    nativeName: string;
    flag: string;
}> = {
    fr: {
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
    },
    en: {
        name: 'English',
        nativeName: 'English',
        flag: '🇬🇧',
    },
    de: {
        name: 'German',
        nativeName: 'Deutsch',
        flag: '🇩🇪',
    },
    es: {
        name: 'Spanish',
        nativeName: 'Español',
        flag: '🇪🇸',
    },
};

// ===== Template Categories =====

export const TEMPLATE_TAGS = {
    professional: { label: 'Professionnel', color: 'blue' },
    modern: { label: 'Moderne', color: 'purple' },
    creative: { label: 'Créatif', color: 'pink' },
    traditional: { label: 'Traditionnel', color: 'gray' },
    tech: { label: 'Tech', color: 'indigo' },
    business: { label: 'Business', color: 'emerald' },
    'ats-friendly': { label: 'ATS Optimisé', color: 'green' },
    executive: { label: 'Cadre', color: 'amber' },
    simple: { label: 'Simple', color: 'slate' },
};

// ===== Proficiency Levels =====

export const LANGUAGE_PROFICIENCY_LEVELS = {
    native: { label: 'Langue maternelle', level: 5 },
    fluent: { label: 'Courant', level: 4 },
    advanced: { label: 'Avancé', level: 3 },
    intermediate: { label: 'Intermédiaire', level: 2 },
    basic: { label: 'Débutant', level: 1 },
};

// ===== CV Sections by Country =====

export const CV_SECTIONS_BY_COUNTRY: Record<CountryCode, {
    required: string[];
    optional: string[];
    order: string[];
}> = {
    canada: {
        required: ['summary', 'experience', 'education', 'skills'],
        optional: ['certifications', 'languages', 'volunteer'],
        order: ['summary', 'experience', 'education', 'skills', 'certifications', 'languages'],
    },
    france: {
        required: ['etat_civil', 'experience', 'formation', 'competences'],
        optional: ['langues', 'loisirs', 'references'],
        order: ['etat_civil', 'formation', 'experience', 'competences', 'langues', 'loisirs'],
    },
    australia: {
        required: ['overview', 'skills', 'experience', 'education'],
        optional: ['certifications', 'references', 'publications'],
        order: ['overview', 'skills', 'experience', 'education', 'certifications', 'references'],
    },
    usa: {
        required: ['summary', 'experience', 'education'],
        optional: ['skills', 'certifications', 'awards'],
        order: ['summary', 'experience', 'education', 'skills', 'certifications'],
    },
};

// ===== ATS Keywords Database (sample) =====

export const COMMON_ATS_KEYWORDS = {
    tech: [
        'JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker',
        'Kubernetes', 'CI/CD', 'Agile', 'Scrum', 'Git', 'REST API', 'GraphQL',
    ],
    business: [
        'Leadership', 'Management', 'Strategy', 'Budget', 'P&L', 'KPI',
        'Stakeholder', 'ROI', 'Analytics', 'Planning', 'Operations',
    ],
    softSkills: [
        'Communication', 'Problem-solving', 'Team player', 'Critical thinking',
        'Adaptability', 'Time management', 'Collaboration', 'Initiative',
    ],
};

// ===== Action Verbs for CV =====

export const ACTION_VERBS = {
    leadership: [
        'Directed', 'Led', 'Managed', 'Coordinated', 'Supervised', 'Mentored',
        'Orchestrated', 'Spearheaded', 'Championed', 'Pioneered',
    ],
    achievement: [
        'Achieved', 'Delivered', 'Exceeded', 'Improved', 'Increased', 'Reduced',
        'Optimized', 'Streamlined', 'Enhanced', 'Maximized',
    ],
    technical: [
        'Developed', 'Implemented', 'Designed', 'Built', 'Engineered', 'Created',
        'Programmed', 'Automated', 'Integrated', 'Deployed',
    ],
    analysis: [
        'Analyzed', 'Assessed', 'Evaluated', 'Investigated', 'Researched',
        'Identified', 'Diagnosed', 'Audited', 'Measured', 'Quantified',
    ],
};

// ===== Cover Letter Templates =====

export const COVER_LETTER_TONES = {
    formal: {
        label: 'Formel',
        description: 'Ton très formel et professionnel',
        salutation: 'Madame, Monsieur',
        closing: 'Je vous prie d\'agréer, Madame, Monsieur, l\'expression de mes salutations distinguées.',
    },
    professional: {
        label: 'Professionnel',
        description: 'Ton professionnel équilibré',
        salutation: 'Chère équipe de recrutement',
        closing: 'Cordialement',
    },
    friendly: {
        label: 'Cordial',
        description: 'Ton professionnel mais accessible',
        salutation: 'Bonjour',
        closing: 'Bien cordialement',
    },
};

// ===== Error Messages =====

export const ERROR_MESSAGES = {
    INSUFFICIENT_CREDITS: 'Crédits insuffisants. Veuillez acheter des crédits pour continuer.',
    INVALID_TEMPLATE: 'Template invalide ou non disponible.',
    GENERATION_FAILED: 'Échec de la génération. Veuillez réessayer.',
    TRANSLATION_FAILED: 'Échec de la traduction. Veuillez réessayer.',
    JOB_ANALYSIS_FAILED: 'Impossible d\'analyser l\'offre d\'emploi.',
    INVALID_INPUT: 'Données invalides. Veuillez vérifier vos informations.',
    STORAGE_ERROR: 'Erreur de stockage du document.',
    NETWORK_ERROR: 'Erreur réseau. Vérifiez votre connexion.',
    UNKNOWN_ERROR: 'Une erreur inattendue s\'est produite.',
};

// ===== Success Messages =====

export const SUCCESS_MESSAGES = {
    CV_GENERATED: 'CV généré avec succès !',
    LETTER_GENERATED: 'Lettre de motivation générée avec succès !',
    DOCUMENT_TRANSLATED: 'Document traduit avec succès !',
    CREDITS_PURCHASED: 'Crédits achetés avec succès !',
    DOCUMENT_SAVED: 'Document sauvegardé !',
    DOCUMENT_DELETED: 'Document supprimé !',
};

// ===== File Export Settings =====

export const FILE_EXPORT_CONFIG = {
    pdf: {
        maxSizeMB: 10,
        mimeType: 'application/pdf',
        extension: '.pdf',
    },
    docx: {
        maxSizeMB: 10,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        extension: '.docx',
    },
};

// ===== Storage Bucket =====

export const STORAGE_BUCKET = 'cv-documents';

// ===== AI Model Configuration =====

export const AI_CONFIG = {
    model: 'gpt-4-turbo',
    defaultTemperature: 0.7,
    maxTokens: 2000,
};
