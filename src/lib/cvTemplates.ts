// CV Template Gallery Data
import type { CVTemplate } from '@/types/aiCVService';

// Simplified template data for development - full fields added via type assertion
export const CV_TEMPLATES: CVTemplate[] = [
    // CANADA Templates
    {
        id: 'canada-modern-1',
        name: 'Modern Professional',
        country: 'canada',
        template_type: 'modern',
        description: 'Template moderne et épuré, parfait pour les secteurs tech et créatifs au Canada',
        layout_config: { columns: 1, fontSize: 12, lineHeight: 1.5 },
        sections_config: ['personal_info', 'summary', 'experience', 'education', 'skills', 'certifications'],
        is_active: true,
        is_premium: false,
        preview_image_url: '/templates/thumbnails/canada-modern.jpg',
        layout: 'single_column',
        sections: ['personal_info', 'summary', 'experience', 'education', 'skills', 'certifications'],
        color_scheme: { primary: '#2563eb', secondary: '#64748b', accent: '#3b82f6' },
        font_family: 'Inter',
        popularity_score: 95,
        tags: ['modern', 'tech', 'creative', 'ats-friendly'],
        created_at: '2026-02-11T00:00:00Z',
        updated_at: '2026-02-11T00:00:00Z',
    },
    {
        id: 'canada-classic-1',
        name: 'Executive Classic',
        country: 'canada',
        template_type: 'classic',
        description: 'Format classique et professionnel pour les postes de gestion et direction',
        layout_config: { columns: 2, fontSize: 11, lineHeight: 1.4 },
        sections_config: ['personal_info', 'professional_summary', 'experience', 'education', 'skills', 'achievements'],
        is_active: true,
        is_premium: false,
        preview_image_url: '/templates/thumbnails/canada-classic.jpg',
        layout: 'two_column',
        sections: ['personal_info', 'professional_summary', 'experience', 'education', 'skills', 'achievements'],
        color_scheme: { primary: '#1e293b', secondary: '#475569', accent: '#0f172a' },
        font_family: 'Georgia',
        popularity_score: 88,
        tags: ['classic', 'executive', 'professional', 'ats-friendly'],
        created_at: '2026-02-11T00:00:00Z',
        updated_at: '2026-02-11T00:00:00Z',
    },

    // FRANCE Templates - Modèles professionnels français
    {
        id: 'france-modern-blue-1',
        name: 'Moderne Bleu Professionnel',
        country: 'france',
        template_type: 'modern',
        description: 'CV moderne avec colonne latérale bleue, photo circulaire et design épuré - parfait pour tous secteurs',
        layout_config: { columns: 2, fontSize: 11, lineHeight: 1.5 },
        sections_config: ['photo', 'personal_info', 'coordonnees', 'langues', 'competences', 'centers_interet', 'formation', 'experience'],
        is_active: true,
        is_premium: false,
        preview_image_url: '/templates/thumbnails/france-modern-blue.jpg',
        layout: 'two_column_sidebar',
        sections: ['photo', 'coordonnees', 'langues', 'competences', 'centres_interet', 'formation', 'experience'],
        color_scheme: { primary: '#1e3a5f', secondary: '#64748b', accent: '#3b82f6' },
        font_family: 'Montserrat',
        popularity_score: 95,
        tags: ['moderne', 'photo', 'français', 'colonne-laterale', 'professionnel'],
        created_at: '2026-02-11T00:00:00Z',
        updated_at: '2026-02-11T16:07:46Z',
    },
    {
        id: 'france-commercial-elegant',
        name: 'Commercial Élégant',
        country: 'france',
        template_type: 'modern',
        description: 'Design élégant avec photo professionnelle, colonne bleue foncée et mise en page claire - idéal pour commerciaux',
        layout_config: { columns: 2, fontSize: 11, lineHeight: 1.4 },
        sections_config: ['photo', 'profil', 'contact', 'interets', 'formation', 'experience', 'competences'],
        is_active: true,
        is_premium: false,
        preview_image_url: '/templates/thumbnails/france-commercial.jpg',
        layout: 'two_column_sidebar',
        sections: ['photo', 'profil', 'contact', 'interets', 'formation', 'experience', 'competences', 'langues'],
        color_scheme: { primary: '#1a365d', secondary: '#4a5568', accent: '#2c5282' },
        font_family: 'Poppins',
        popularity_score: 92,
        tags: ['moderne', 'photo', 'commercial', 'élégant', 'français'],
        created_at: '2026-02-11T00:00:00Z',
        updated_at: '2026-02-11T16:07:46Z',
    },
    {
        id: 'france-simple-classic',
        name: 'Simple et Classique',
        country: 'france',
        template_type: 'classic',
        description: 'CV simple et professionnel avec petite photo, design épuré sur fond clair - polyvalent et efficace',
        layout_config: { columns: 1, fontSize: 11, lineHeight: 1.5 },
        sections_config: ['photo', 'personal_info', 'formation', 'experience', 'competences', 'langues'],
        is_active: true,
        is_premium: false,
        preview_image_url: '/templates/thumbnails/france-simple.jpg',
        layout: 'single_column',
        sections: ['photo', 'personal_info', 'formation', 'experience', 'competences', 'langues', 'loisirs'],
        color_scheme: { primary: '#2d3748', secondary: '#718096', accent: '#4299e1' },
        font_family: 'Open Sans',
        popularity_score: 88,
        tags: ['classique', 'simple', 'photo', 'français', 'polyvalent'],
        created_at: '2026-02-11T00:00:00Z',
        updated_at: '2026-02-11T16:07:46Z',
    },
    {
        id: 'france-creative-diagonal',
        name: 'Créatif Diagonal',
        country: 'france',
        template_type: 'creative',
        description: 'Design créatif avec diagonale bleue distinctive, photo en-tête et mise en page dynamique',
        layout_config: { columns: 1, fontSize: 11, lineHeight: 1.4 },
        sections_config: ['photo', 'contact', 'langues', 'competences', 'centres_interet', 'profil', 'experience', 'formation'],
        is_active: true,
        is_premium: true,
        preview_image_url: '/templates/thumbnails/france-diagonal.jpg',
        layout: 'single_column_creative',
        sections: ['photo', 'contact', 'langues', 'competences', 'centres_interet', 'profil', 'experience', 'formation'],
        color_scheme: { primary: '#2563eb', secondary: '#1e40af', accent: '#60a5fa' },
        font_family: 'Raleway',
        popularity_score: 90,
        tags: ['créatif', 'moderne', 'photo', 'original', 'français'],
        created_at: '2026-02-11T00:00:00Z',
        updated_at: '2026-02-11T16:07:46Z',
    },

    // AUSTRALIA Templates
    {
        id: 'australia-modern-1',
        name: 'Sydney Professional',
        country: 'australia',
        template_type: 'modern',
        description: 'Template moderne conforme aux standards australiens',
        layout_config: { columns: 1, fontSize: 12, lineHeight: 1.5 },
        sections_config: ['personal_info', 'professional_summary', 'key_skills', 'experience', 'education', 'references'],
        is_active: true,
        is_premium: false,
        preview_image_url: '/templates/thumbnails/australia-modern.jpg',
        layout: 'single_column',
        sections: ['personal_info', 'professional_summary', 'key_skills', 'experience', 'education', 'references'],
        color_scheme: { primary: '#059669', secondary: '#6b7280', accent: '#10b981' },
        font_family: 'Calibri',
        popularity_score: 87,
        tags: ['modern', 'professional', 'australia', 'ats-friendly'],
        created_at: '2026-02-11T00:00:00Z',
        updated_at: '2026-02-11T00:00:00Z',
    },

    // USA Templates
    {
        id: 'usa-executive-1',
        name: 'American Executive',
        country: 'usa',
        template_type: 'executive',
        description: 'Format exécutif américain pour postes de direction',
        layout_config: { columns: 1, fontSize: 11, lineHeight: 1.4 },
        sections_config: ['personal_info', 'executive_summary', 'professional_experience', 'key_achievements', 'education', 'skills'],
        is_active: true,
        is_premium: true,
        preview_image_url: '/templates/thumbnails/usa-executive.jpg',
        layout: 'single_column',
        sections: ['personal_info', 'executive_summary', 'professional_experience', 'key_achievements', 'education', 'skills'],
        color_scheme: { primary: '#dc2626', secondary: '#991b1b', accent: '#ef4444' },
        font_family: 'Times New Roman',
        popularity_score: 90,
        tags: ['executive', 'usa', 'leadership', 'ats-friendly'],
        created_at: '2026-02-11T00:00:00Z',
        updated_at: '2026-02-11T00:00:00Z',
    },
    {
        id: 'usa-tech-1',
        name: 'Silicon Valley Tech',
        country: 'usa',
        template_type: 'modern',
        description: 'Template tech optimisé pour les entreprises de la Silicon Valley',
        layout_config: { columns: 2, fontSize: 11, lineHeight: 1.5 },
        sections_config: ['personal_info', 'summary', 'technical_skills', 'experience', 'projects', 'education'],
        is_active: true,
        is_premium: false,
        preview_image_url: '/templates/thumbnails/usa-tech.jpg',
        layout: 'two_column',
        sections: ['personal_info', 'summary', 'technical_skills', 'experience', 'projects', 'education'],
        color_scheme: { primary: '#f59e0b', secondary: '#78350f', accent: '#fbbf24' },
        font_family: 'Roboto',
        popularity_score: 94,
        tags: ['tech', 'modern', 'silicon-valley', 'ats-friendly'],
        created_at: '2026-02-11T00:00:00Z',
        updated_at: '2026-02-11T00:00:00Z',
    },

    // Additional Popular Templates
    {
        id: 'international-minimal-1',
        name: 'Minimal International',
        country: 'canada',
        template_type: 'minimal',
        description: 'Design minimaliste et élégant adapté à tous les pays',
        layout_config: { columns: 1, fontSize: 12, lineHeight: 1.6 },
        sections_config: ['personal_info', 'summary', 'experience', 'education', 'skills'],
        is_active: true,
        is_premium: false,
        preview_image_url: '/templates/thumbnails/minimal.jpg',
        layout: 'single_column',
        sections: ['personal_info', 'summary', 'experience', 'education', 'skills'],
        color_scheme: { primary: '#000000', secondary: '#6b7280', accent: '#374151' },
        font_family: 'Helvetica',
        popularity_score: 89,
        tags: ['minimal', 'clean', 'international', 'ats-friendly'],
        created_at: '2026-02-11T00:00:00Z',
        updated_at: '2026-02-11T00:00:00Z',
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
        .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
        .slice(0, limit);
}

export function getPremiumTemplates(): CVTemplate[] {
    return CV_TEMPLATES.filter(t => t.is_premium && t.is_active);
}
