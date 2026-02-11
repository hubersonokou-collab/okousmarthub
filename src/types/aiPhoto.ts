// AI Photo Generation - Type Definitions
import type { GenerationParams as BaseGenerationParams } from './aiCVService';

export type PhotoStyle = 'corporate' | 'casual_professional' | 'creative' | 'executive';
export type Gender = 'male' | 'female' | 'neutral';

// ===== AI Photo =====

export interface AIPhoto {
    id: string;
    user_id: string;
    original_photo_url: string;
    generated_photo_url: string;
    thumbnail_url: string | null;
    style: PhotoStyle;
    gender: Gender | null;
    background_color: string;
    facial_features: FacialFeatures | null;
    generation_params: PhotoGenerationParams | null;
    credits_used: number;
    ai_model: string;
    is_favorite: boolean;
    created_at: string;
    updated_at: string;
}

export interface FacialFeatures {
    faceShape: string;
    skinTone: string;
    hairColor: string;
    eyeColor: string;
    facialHair?: string;
    glasses: boolean;
    ageRange: string;
    ethnicity?: string;
    faceLandmarks?: {
        leftEye: [number, number];
        rightEye: [number, number];
        nose: [number, number];
        mouth: [number, number];
    };
}

export interface PhotoGenerationParams {
    prompt: string;
    negativePrompt: string;
    strength: number; // 0.0 - 1.0 (how much to transform)
    cfgScale: number; // 1 - 20 (prompt adherence)
    steps: number; // 20-50 (quality vs speed)
    seed?: number;
    guidanceScale?: number;
    width: number;
    height: number;
}

// ===== Photo Styles =====

export interface PhotoStyleConfig {
    id: PhotoStyle;
    name: string;
    description: string;
    icon: string;
    attire: string;
    background: string;
    lighting: string;
    useCases: string[];
    exampleImageUrl?: string;
    promptTemplate: string;
}

export const PHOTO_STYLES: Record<PhotoStyle, PhotoStyleConfig> = {
    corporate: {
        id: 'corporate',
        name: 'Corporate',
        description: 'Style classique et formel pour entreprises traditionnelles',
        icon: '👔',
        attire: 'Costume sombre avec cravate',
        background: 'Blanc ou gris clair',
        lighting: 'Studio professionnel symétrique',
        useCases: ['Finance', 'Juridique', 'Conseil', 'Banque'],
        promptTemplate: 'corporate executive professional headshot, dark business suit with tie, white background, professional studio lighting',
    },
    casual_professional: {
        id: 'casual_professional',
        name: 'Professionnel Décontracté',
        description: 'Style moderne et accessible pour startups et tech',
        icon: '👕',
        attire: 'Chemise sans veste',
        background: 'Gris moyen, légèrement flouté',
        lighting: 'Naturel et chaleureux',
        useCases: ['Tech', 'Startups', 'Marketing', 'Design'],
        promptTemplate: 'modern professional headshot, button-down shirt no tie, soft gray gradient background, natural window lighting',
    },
    creative: {
        id: 'creative',
        name: 'Créatif',
        description: 'Style dynamique et moderne pour industries créatives',
        icon: '🎨',
        attire: 'Style personnel mais soigné',
        background: 'Couleur moderne (bleu, violet)',
        lighting: 'Créatif, légèrement asymétrique',
        useCases: ['Design', 'Médias', 'Publicité', 'Arts'],
        promptTemplate: 'creative professional headshot, stylish modern clothing, vibrant colored background, creative asymmetric lighting',
    },
    executive: {
        id: 'executive',
        name: 'Cadre Dirigeant',
        description: 'Style premium et autoritaire pour postes de direction',
        icon: '💼',
        attire: 'Costume haut de gamme',
        background: 'Gris foncé ou noir',
        lighting: 'Dramatique et professionnel',
        useCases: ['C-Level', 'Conseil stratégique', 'Direction'],
        promptTemplate: 'executive portrait, premium business suit, dark gray or black background, dramatic professional lighting',
    },
};

// ===== API Requests/Responses =====

export interface GeneratePhotoRequest {
    originalPhoto: File | string; // File object or base64
    style: PhotoStyle;
    background?: string; // Hex color or 'white', 'gray', 'blue'
    gender?: Gender;
    enhanceFeatures?: boolean;
    removeBlemishes?: boolean;
}

export interface GeneratePhotoResponse {
    photoId: string;
    generatedPhotoUrl: string;
    originalPhotoUrl: string;
    thumbnailUrl: string;
    creditsUsed: number;
    remainingCredits: number;
    facialFeatures?: FacialFeatures;
}

export interface RegeneratePhotoRequest {
    photoId: string; // Regenerate from existing photo
    newStyle?: PhotoStyle;
    newBackground?: string;
}

// ===== Photo Validation =====

export interface PhotoValidation {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    metadata: {
        width: number;
        height: number;
        format: string;
        size: number;
        hasFace: boolean;
        faceCount: number;
        faceQuality: 'high' | 'medium' | 'low';
    };
}

// ===== Photo Gallery =====

export interface PhotoGalleryFilter {
    style?: PhotoStyle;
    isFavorite?: boolean;
    dateFrom?: string;
    dateTo?: string;
}

export interface PhotoStats {
    total_generated: number;
    total_credits_used: number;
    favorite_count: number;
    most_used_style: PhotoStyle | null;
}

// ===== Error Types =====

export interface PhotoGenerationError {
    code: PhotoErrorCode;
    message: string;
    details?: any;
}

export enum PhotoErrorCode {
    NO_FACE_DETECTED = 'no_face_detected',
    MULTIPLE_FACES = 'multiple_faces',
    POOR_QUALITY = 'poor_quality',
    INVALID_FORMAT = 'invalid_format',
    FILE_TOO_LARGE = 'file_too_large',
    NSFW_CONTENT = 'nsfw_content',
    INSUFFICIENT_CREDITS = 'insufficient_credits',
    GENERATION_FAILED = 'generation_failed',
    UPLOAD_FAILED = 'upload_failed',
}

export const PHOTO_ERROR_MESSAGES: Record<PhotoErrorCode, string> = {
    [PhotoErrorCode.NO_FACE_DETECTED]: 'Aucun visage détecté dans la photo',
    [PhotoErrorCode.MULTIPLE_FACES]: 'Plusieurs visages détectés. Veuillez utiliser une photo avec un seul visage',
    [PhotoErrorCode.POOR_QUALITY]: 'Qualité de photo insuffisante. Utilisez une photo plus nette',
    [PhotoErrorCode.INVALID_FORMAT]: 'Format de fichier non supporté. Utilisez JPG, PNG ou WebP',
    [PhotoErrorCode.FILE_TOO_LARGE]: 'Fichier trop volumineux. Maximum 10MB',
    [PhotoErrorCode.NSFW_CONTENT]: 'Contenu inapproprié détecté',
    [PhotoErrorCode.INSUFFICIENT_CREDITS]: 'Crédits insuffisants pour générer une photo',
    [PhotoErrorCode.GENERATION_FAILED]: 'Échec de la génération. Veuillez réessayer',
    [PhotoErrorCode.UPLOAD_FAILED]: 'Échec de l\'upload. Vérifiez votre connexion',
};

// ===== Constants =====

export const PHOTO_CONSTRAINTS = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MIN_WIDTH: 400,
    MIN_HEIGHT: 400,
    RECOMMENDED_WIDTH: 800,
    RECOMMENDED_HEIGHT: 1000,
    ALLOWED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'] as const,
    MIN_FACE_SIZE_RATIO: 0.3, // Face should occupy at least 30% of image
};

export const GENERATION_DEFAULTS = {
    STRENGTH: 0.65,
    CFG_SCALE: 7.5,
    STEPS: 30,
    WIDTH: 800,
    HEIGHT: 1000,
};

export const BACKGROUND_COLORS = {
    white: '#FFFFFF',
    light_gray: '#F5F5F5',
    gray: '#9E9E9E',
    dark_gray: '#424242',
    blue: '#1976D2',
    navy: '#0D47A1',
    purple: '#7B1FA2',
    black: '#000000',
};
