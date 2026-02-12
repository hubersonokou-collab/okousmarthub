// PDF Template Types and Interfaces
import type { CVFormData } from '@/types/aiCVService';

export interface PDFTemplateProps {
    cvData: CVFormData;
    templateConfig: {
        colorScheme: {
            primary: string;
            secondary: string;
            accent: string;
        };
        fontFamily: string;
        layout: 'single_column' | 'two_column_sidebar' | 'single_column_creative';
    };
}

export interface ExperienceData {
    company: string;
    position: string;
    startDate: string;
    endDate: string | null;
    current: boolean;
    description: string;
}

export interface EducationData {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description?: string;
}

export interface LanguageData {
    language: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'native';
}

// Extended CVFormData with photo
export interface CVFormDataWithPhoto extends CVFormData {
    photoUrl?: string;
    photoDataUrl?: string; // Base64 encoded photo for PDF
}
