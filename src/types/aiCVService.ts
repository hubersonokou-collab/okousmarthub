// AI CV Service - Type Definitions
// Generated: 2026-02-11

export type CountryCode = 'canada' | 'france' | 'australia' | 'usa';
export type LanguageCode = 'fr' | 'en' | 'de' | 'es';
export type DocumentType = 'cv' | 'cover_letter';
export type TemplateType = 'modern' | 'classic' | 'creative' | 'executive' | 'simple' | 'minimal';
export type TransactionType = 'purchase' | 'usage' | 'refund' | 'bonus';
export type ActionType =
    | 'cv_generation_basic'
    | 'cover_letter_generation'
    | 'job_offer_analysis'
    | 'translation'
    | 'ats_optimization'
    | 'template_premium';

// ===== Credit System =====

export interface CreditPack {
    id: string;
    name: string;
    price: number; // in FCFA
    credits: number;
    description: string;
    features: string[];
    is_active: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface UserCredits {
    id: string;
    user_id: string;
    credits_balance: number;
    total_purchased: number;
    total_used: number;
    last_purchase_at: string | null;
    updated_at: string;
    created_at: string;
}

export interface CreditTransaction {
    id: string;
    user_id: string;
    transaction_type: TransactionType;
    credits_amount: number;
    action_type: ActionType | null;
    pack_id: string | null;
    payment_reference: string | null;
    payment_status: string | null;
    description: string | null;
    metadata: Record<string, any> | null;
    created_at: string;
}

export interface CreditCost {
    id: string;
    action_type: ActionType;
    credits_required: number;
    description: string;
    is_active: boolean;
    updated_at: string;
}

// ===== Templates & Documents =====

export interface CVTemplate {
    id: string;
    name: string;
    country: CountryCode;
    template_type: TemplateType;
    type?: TemplateType; // Alias for template_type (for template gallery convenience)
    description: string;
    layout: string; // Layout type: 'single_column', 'two_column', etc.
    layout_config: LayoutConfig;
    sections: string[]; // Array of section names included in template
    sections_config: string[];
    color_scheme?: {
        primary: string;
        secondary: string;
        accent: string;
    };
    font_family?: string;
    is_active: boolean;
    is_premium: boolean;
    preview_image_url: string | null;
    thumbnail_url?: string; // Thumbnail for gallery display
    preview_url?: string; // PDF preview URL
    popularity_score?: number; // 0-100, for sorting templates
    tags: string[];
    created_at: string;
    updated_at: string;
}

export interface LayoutConfig {
    columns: number;
    fontSize: number;
    lineHeight: number;
    colorScheme?: {
        primary: string;
        secondary: string;
        accent: string;
    };
    margins?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
}

export interface GeneratedDocument {
    id: string;
    user_id: string;
    document_type: DocumentType;
    template_id: string | null;
    country_standard: string | null;
    language: LanguageCode;
    title: string | null;
    content: DocumentContent;
    formatted_content: string | null;
    job_offer_url: string | null;
    job_offer_analysis: JobOfferAnalysis | null;
    credits_used: number;
    file_pdf_url: string | null;
    file_docx_url: string | null;
    is_favorite: boolean;
    was_ats_optimized: boolean;
    ai_model_used: string | null;
    generation_metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

// ===== Document Content Structures =====

export interface DocumentContent {
    personalInfo?: PersonalInfo;
    summary?: string;
    experience?: Experience[];
    education?: Education[];
    skills?: Skills;
    languages?: Language[];
    certifications?: Certification[];
    references?: Reference[];
    customSections?: CustomSection[];
}

export interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    linkedin?: string;
    portfolio?: string;
    photo?: string; // URL
    dateOfBirth?: string;
    nationality?: string;
    maritalStatus?: string;
}

export interface Experience {
    id?: string;
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate: string | null; // null if current position
    isCurrent: boolean;
    description: string;
    achievements: string[];
    technologies?: string[];
}

export interface Education {
    id?: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    location?: string;
    startDate: string;
    endDate: string;
    grade?: string;
    description?: string;
}

export interface Skills {
    technical?: string[];
    soft?: string[];
    tools?: string[];
    languages?: string[];
    custom?: {
        category: string;
        items: string[];
    }[];
}

export interface Language {
    name: string;
    proficiency: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
    certifications?: string[];
}

export interface Certification {
    id?: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
    url?: string;
}

export interface Reference {
    id?: string;
    name: string;
    position: string;
    company: string;
    email: string;
    phone: string;
    relationship: string;
}

export interface CustomSection {
    id: string;
    title: string;
    content: string | any[];
    order: number;
}

export interface JobOfferAnalysis {
    title: string;
    company: string;
    location: string;
    keywords: string[];
    requiredSkills: string[];
    preferredSkills: string[];
    responsibilities: string[];
    qualifications: string[];
    matchScore?: number; // 0-100
    suggestions: string[];
}

// ===== API Request/Response Types =====

export interface GenerateCVRequest {
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: Skills;
    templateId: string;
    country: CountryCode;
    language: LanguageCode;
    jobOfferUrl?: string;
    jobOfferText?: string;
    includeATSOptimization?: boolean;
    additionalSections?: CustomSection[];
}

export interface GenerateCVResponse {
    documentId: string;
    content: DocumentContent;
    filePdfUrl?: string;
    fileDocxUrl?: string;
    creditsUsed: number;
    remainingCredits: number;
    jobOfferAnalysis?: JobOfferAnalysis;
}

export interface GenerateCoverLetterRequest {
    personalInfo: PersonalInfo;
    jobTitle: string;
    company: string;
    jobOfferUrl?: string;
    jobOfferText?: string;
    additionalInfo: string;
    templateId?: string;
    country: CountryCode;
    language: LanguageCode;
    tone?: 'formal' | 'professional' | 'friendly';
}

export interface GenerateCoverLetterResponse {
    documentId: string;
    content: string;
    filePdfUrl?: string;
    fileDocxUrl?: string;
    creditsUsed: number;
    remainingCredits: number;
}

export interface TranslateDocumentRequest {
    documentId: string;
    targetLanguage: LanguageCode;
    maintainFormatting: boolean;
}

export interface TranslateDocumentResponse {
    documentId: string;
    translatedContent: DocumentContent | string;
    filePdfUrl?: string;
    creditsUsed: number;
    remainingCredits: number;
}

export interface PurchaseCreditsRequest {
    packId: string;
    paymentReference: string;
}

export interface PurchaseCreditsResponse {
    success: boolean;
    creditsAdded: number;
    newBalance: number;
    transactionId: string;
}

// ===== Utility Types =====

export interface ATSOptimizationResult {
    score: number; // 0-100
    issues: {
        severity: 'high' | 'medium' | 'low';
        message: string;
        suggestion: string;
    }[];
    optimizations: {
        type: string;
        before: string;
        after: string;
    }[];
}

export interface TemplatePreview {
    templateId: string;
    previewUrl: string;
    samplePdfUrl: string;
}

// ===== Form Types (for frontend state management) =====

export interface CVFormData {
    personalInfo: Partial<PersonalInfo>;
    experience: Experience[];
    education: Education[];
    skills: Skills;
    languages: Language[];
    certifications: Certification[];
    references?: Reference[];
    customSections?: CustomSection[];
}

export interface CoverLetterFormData {
    personalInfo: Partial<PersonalInfo>;
    jobTitle: string;
    company: string;
    jobOfferUrl?: string;
    jobOfferText?: string;
    motivation: string;
    whyCompany: string;
    whyPosition: string;
    closingStatement: string;
}

// ===== Error Types =====

export interface AIServiceError {
    code: string;
    message: string;
    details?: any;
}

export const AI_ERROR_CODES = {
    INSUFFICIENT_CREDITS: 'insufficient_credits',
    INVALID_TEMPLATE: 'invalid_template',
    GENERATION_FAILED: 'generation_failed',
    TRANSLATION_FAILED: 'translation_failed',
    JOB_ANALYSIS_FAILED: 'job_analysis_failed',
    INVALID_INPUT: 'invalid_input',
    STORAGE_ERROR: 'storage_error',
} as const;
