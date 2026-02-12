// PDF Generation Service - Client-side
import { pdf } from '@react-pdf/renderer';
import { renderPDFTemplate } from './pdfTemplates/templateRenderer';
import { supabase } from '@/lib/supabase';
import type { CVFormData } from '@/types/aiCVService';
import type { CVTemplate } from '@/types/aiCVService';

export interface GeneratePDFOptions {
    cvData: CVFormData;
    template: CVTemplate;
    userId: string;
    photoFile?: File;
}

export interface GeneratePDFResult {
    success: boolean;
    pdfBlob?: Blob;
    pdfUrl?: string;
    documentId?: string;
    error?: string;
}

/**
 * Convert image file to base64 data URL for PDF embedding
 */
async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Generate PDF from CV data and template
 */
export async function generateCVPDF(options: GeneratePDFOptions): Promise<GeneratePDFResult> {
    try {
        const { cvData, template, userId, photoFile } = options;

        // Convert photo to base64 if provided
        let cvDataWithPhoto = { ...cvData };
        if (photoFile) {
            const photoDataUrl = await fileToDataUrl(photoFile);
            cvDataWithPhoto = {
                ...cvData,
                photoDataUrl,
            };
        }

        // Render PDF template
        const pdfDocument = renderPDFTemplate({
            cvData: cvDataWithPhoto,
            template,
        });

        // Generate PDF blob
        const pdfBlob = await pdf(pdfDocument).toBlob();

        // Upload to Supabase Storage
        const fileName = `cv_${userId}_${Date.now()}.pdf`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('cv-documents')
            .upload(fileName, pdfBlob, {
                contentType: 'application/pdf',
                upsert: false,
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return {
                success: false,
                error: 'Erreur lors de l\'upload du PDF',
            };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('cv-documents')
            .getPublicUrl(fileName);

        // Save document record in database
        const { data: documentData, error: dbError } = await supabase
            .from('generated_documents')
            .insert({
                user_id: userId,
                document_type: 'cv',
                template_id: template.id,
                title: `CV - ${cvData.personalInfo?.firstName} ${cvData.personalInfo?.lastName}`,
                content: cvData,
                file_pdf_url: urlData.publicUrl,
                credits_used: 2,
                language: 'fr',
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
        }

        // Deduct credits
        const { error: creditError } = await supabase.rpc('deduct_credits', {
            p_user_id: userId,
            p_credits: 2,
            p_action_type: 'cv_generation_basic',
            p_description: `Génération CV - ${template.name}`,
        });

        if (creditError) {
            console.error('Credit deduction error:', creditError);
        }

        return {
            success: true,
            pdfBlob,
            pdfUrl: urlData.publicUrl,
            documentId: documentData?.id,
        };
    } catch (error) {
        console.error('PDF generation error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue',
        };
    }
}

/**
 * Download PDF directly without uploading
 */
export async function downloadCVPDF(options: Omit<GeneratePDFOptions, 'userId'>): Promise<void> {
    try {
        const { cvData, template, photoFile } = options;

        // Convert photo to base64 if provided
        let cvDataWithPhoto = { ...cvData };
        if (photoFile) {
            const photoDataUrl = await fileToDataUrl(photoFile);
            cvDataWithPhoto = {
                ...cvData,
                photoDataUrl,
            };
        }

        // Render PDF template
        const pdfDocument = renderPDFTemplate({
            cvData: cvDataWithPhoto,
            template,
        });

        // Generate PDF blob
        const pdfBlob = await pdf(pdfDocument).toBlob();

        // Create download link
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `CV_${cvData.personalInfo?.lastName || 'Document'}_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('PDF download error:', error);
        throw error;
    }
}
