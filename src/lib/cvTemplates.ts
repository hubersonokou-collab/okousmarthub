// CV Template Gallery Data
import type { CVTemplate } from '@/types/aiCVService';

export const CV_TEMPLATES: CVTemplate[] = [
    // CANADA Templates
    {
        id: 'canada-modern-1',
        name: 'Modern Professional',
        country: 'canada',
        type: 'modern',
        layout: 'single_column',
        description: 'Template moderne et épuré, parfait pour les secteurs tech et créatifs au Canada',
        thumbnail_url: '/templates/thumbnails/canada-modern.jpg',
        preview_url: '/templates/previews/canada-modern-preview.pdf',
        sections: ['personal_info', 'summary', 'experience', 'education', 'skills', 'certifications'],
        color_scheme: { primary: '#2563eb', secondary: '#64748b', accent: '#3b82f6' },
        font_family: 'Inter',
        is_premium: false,
        is_active: true,
        popularity_score: 95,
        tags: ['modern', 'tech', 'creative', 'ats-friendly'],
    },
    {
        id: 'canada-classic-1',
        name: 'Executive Classic',
        country: 'canada',
        type: 'classic',
        layout: 'two_column',
        description: 'Format classique et professionnel pour les postes de gestion et direction',
        thumbnail_url: '/templates/thumbnails/canada-classic.jpg',
        preview_url: '/templates/previews/canada-classic-preview.pdf',
        sections: ['personal_info', 'professional_summary', 'experience', 'education', 'skills', 'achievements'],
        color_scheme: { primary: '#1e293b', secondary: '#475569', accent: '#0f172a' },
        font_family: 'Georgia',
        is_premium: false,
        is_active: true,
        popularity_score: 88,
        tags: ['classic', 'executive', 'professional', 'ats-friendly'],
    },

    // FRANCE Templates
    {
        id: 'france-europass-1',
        name: 'Europass Moderne',
        country: 'france',
        type: 'modern',
        layout: 'single_column',
        description: 'Format Europass adapté aux standards français avec photo',
        thumbnail_url: '/templates/thumbnails/france-europass.jpg',
        preview_url: '/templates/previews/france-europass-preview.pdf',
        sections: ['personal_info', 'photo', 'profile', 'experience', 'education', 'competences', 'languages'],
        color_scheme: { primary: '#1e40af', secondary: '#64748b', accent: '#3b82f6' },
        font_family: 'Arial',
        is_premium: false,
        is_active: true,
        popularity_score: 92,
        tags: ['europass', 'photo', 'français', 'ats-friendly'],
    },
    {
        id: 'france-creative-1',
        name: 'Créatif Français',
        country: 'france',
        type: 'creative',
        layout: 'two_column',
        description: 'Design créatif pour les métiers du digital et de la communication en France',
        thumbnail_url: '/templates/thumbnails/france-creative.jpg',
        preview_url: '/templates/previews/france-creative-preview.pdf',
        sections: ['personal_info', 'photo', 'about', 'experience', 'education', 'competences', 'portfolio'],
        color_scheme: { primary: '#7c3aed', secondary: '#a78bfa', accent: '#8b5cf6' },
        font_family: 'Montserrat',
        is_premium: true,
        is_active: true,
        popularity_score: 85,
        tags: ['creative', 'design', 'digital', 'photo'],
    },

    // AUSTRALIA Templates
    {
        id: 'australia-modern-1',
        name: 'Sydney Professional',
        country: 'australia',
        type: 'modern',
        layout: 'single_column',
        description: 'Template moderne conforme aux standards australiens',
        thumbnail_url: '/templates/thumbnails/australia-modern.jpg',
        preview_url: '/templates/previews/australia-modern-preview.pdf',
        sections: ['personal_info', 'professional_summary', 'key_skills', 'experience', 'education', 'references'],
        color_scheme: { primary: '#059669', secondary: '#6b7280', accent: '#10b981' },
        font_family: 'Calibri',
        is_premium: false,
        is_active: true,
        popularity_score: 87,
        tags: ['modern', 'professional', 'australia', 'ats-friendly'],
    },

    // USA Templates
    {
        id: 'usa-executive-1',
        name: 'American Executive',
        country: 'usa',
        type: 'executive',
        layout: 'single_column',
        description: 'Format exécutif américain pour postes de direction',
        thumbnail_url: '/templates/thumbnails/usa-executive.jpg',
        preview_url: '/templates/previews/usa-executive-preview.pdf',
        sections: ['personal_info', 'executive_summary', 'professional_experience', 'key_achievements', 'education', 'skills'],
        color_scheme: { primary: '#dc2626', secondary: '#991b1b', accent: '#ef4444' },
        font_family: 'Times New Roman',
        is_premium: true,
        is_active: true,
        popularity_score: 90,
        tags: ['executive', 'usa', 'leadership', 'ats-friendly'],
    },
    {
        id: 'usa-tech-1',
        name: 'Silicon Valley Tech',
        country: 'usa',
        type: 'modern',
        layout: 'two_column',
        description: 'Template tech optimisé pour les entreprises de la Silicon Valley',
        thumbnail_url: '/templates/thumbnails/usa-tech.jpg',
        preview_url: '/templates/previews/usa-tech-preview.pdf',
        sections: ['personal_info', 'summary', 'technical_skills', 'experience', 'projects', 'education'],
        color_scheme: { primary: '#f59e0b', secondary: '#78350f', accent: '#fbbf24' },
        font_family: 'Roboto',
        is_premium: false,
        is_active: true,
        popularity_score: 94,
        tags: ['tech', 'modern', 'silicon-valley', 'ats-friendly'],
    },

    // Additional Popular Templates
    {
        id: 'international-minimal-1',
        name: 'Minimal International',
        country: 'canada',
        type: 'minimal',
        layout: 'single_column',
        description: 'Design minimaliste et élégant adapté à tous les pays',
        thumbnail_url: '/templates/thumbnails/minimal.jpg',
        preview_url: '/templates/previews/minimal-preview.pdf',
        sections: ['personal_info', 'summary', 'experience', 'education', 'skills'],
        color_scheme: { primary: '#000000', secondary: '#6b7280', accent: '#374151' },
        font_family: 'Helvetica',
        is_premium: false,
        is_active: true,
        popularity_score: 89,
        tags: ['minimal', 'clean', 'international', 'ats-friendly'],
    },
];

// Template Categories
export const TEMPLATE_CATEGORIES = {
    modern: {
        name: 'Moderne',
        icon: '✨',
        description: 'Designs contemporains et innovants',
    },
    classic: {
        name: 'Classique',
        icon: '📄',
        description: 'Formats traditionnels et professionnels',
    },
    creative: {
        name: 'Créatif',
        icon: '🎨',
        description: 'Templates originaux pour se démarquer',
    },
    executive: {
        name: 'Exécutif',
        icon: '💼',
        description: 'Pour postes de direction et leadership',
    },
    minimal: {
        name: 'Minimaliste',
        icon: '⚪',
        description: 'Épuré et élégant',
    },
};

// Helper functions
export function getTemplatesByCountry(country: string): CVTemplate[] {
    return CV_TEMPLATES.filter(t => t.country === country && t.is_active);
}

export function getTemplateById(id: string): CVTemplate | undefined {
    return CV_TEMPLATES.find(t => t.id === id);
}

export function getPopularTemplates(limit: number = 3): CVTemplate[] {
    return [...CV_TEMPLATES]
        .filter(t => t.is_active)
        .sort((a, b) => b.popularity_score - a.popularity_score)
        .slice(0, limit);
}

export function getPremiumTemplates(): CVTemplate[] {
    return CV_TEMPLATES.filter(t => t.is_premium && t.is_active);
}
