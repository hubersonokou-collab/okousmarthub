// Template Renderer - Maps template IDs to PDF components
import React from 'react';
import FrenchModernBluePDF from './FrenchModernBluePDF';
import type { PDFTemplateProps } from './types';
import type { CVTemplate } from '@/types/aiCVService';

interface TemplateRendererProps extends Omit<PDFTemplateProps, 'templateConfig'> {
    template: CVTemplate;
}

export const renderPDFTemplate = ({ cvData, template }: TemplateRendererProps) => {
    const templateConfig = {
        colorScheme: template.color_scheme || {
            primary: '#1e3a5f',
            secondary: '#64748b',
            accent: '#3b82f6',
        },
        fontFamily: template.font_family || 'Helvetica',
        layout: template.layout as 'single_column' | 'two_column_sidebar' | 'single_column_creative',
    };

    // Map template IDs to components
    const templateMap: Record<string, React.FC<PDFTemplateProps>> = {
        'france-modern-blue-1': FrenchModernBluePDF,
        'france-commercial-elegant': FrenchModernBluePDF, // Réutiliser pour l'instant
        'france-simple-classic': FrenchModernBluePDF, // TODO: Create separate component
        'france-creative-diagonal': FrenchModernBluePDF, // TODO: Create separate component

        // Fallback templates
        'canada-modern-1': FrenchModernBluePDF,
        'canada-classic-1': FrenchModernBluePDF,
        'australia-modern-1': FrenchModernBluePDF,
        'usa-executive-1': FrenchModernBluePDF,
        'usa-tech-1': FrenchModernBluePDF,
        'international-minimal-1': FrenchModernBluePDF,
    };

    const TemplateComponent = templateMap[template.id] || FrenchModernBluePDF;

    return <TemplateComponent cvData={cvData} templateConfig={templateConfig} />;
};

export default renderPDFTemplate;
