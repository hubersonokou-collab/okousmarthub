// AI Assistant Service - Frontend integration with Supabase Edge Functions
import { supabase } from '@/integrations/supabase/client';

export interface SkillsSuggestions {
    technical: string[];
    soft: string[];
}

export interface EnhancedSummaryResponse {
    enhancedSummary: string;
}

/**
 * Call AI to suggest skills based on job title and industry
 * Cost: 1 credit
 */
export async function suggestSkills(params: {
    jobTitle: string;
    industry: string;
    existingSkills: string[];
}): Promise<SkillsSuggestions> {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            throw new Error('User not authenticated');
        }

        const response = await supabase.functions.invoke('ai-suggest-skills', {
            body: {
                jobTitle: params.jobTitle,
                industry: params.industry,
                existingSkills: params.existingSkills,
            },
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as SkillsSuggestions;
    } catch (error) {
        console.error('Error suggesting skills:', error);
        throw error;
    }
}

/**
 * Call AI to enhance professional summary
 * Cost: 1 credit
 */
export async function enhanceSummary(summary: string): Promise<string> {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            throw new Error('User not authenticated');
        }

        const response = await supabase.functions.invoke('ai-enhance-summary', {
            body: {
                summary,
            },
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        const data = response.data as EnhancedSummaryResponse;
        return data.enhancedSummary;
    } catch (error) {
        console.error('Error enhancing summary:', error);
        throw error;
    }
}

export interface CoverLetterRequest {
    userInfo: string;
    jobTitle: string;
    companyName: string;
    jobDescription: string;
    tone: 'professional' | 'creative' | 'enthusiastic';
}

/**
 * Call AI to generate a full cover letter
 * Cost: 2 credits
 */
export async function generateCoverLetter(params: CoverLetterRequest): Promise<string> {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            throw new Error('User not authenticated');
        }

        const response = await supabase.functions.invoke('ai-generate-letter', {
            body: params,
        });

        if (response.error) {
            console.error('Edge Function Error Details:', response.error);
            const errorMessage = response.error.message || response.error.context?.message || 'Unknown error occurred';
            throw new Error(errorMessage);
        }

        return response.data.letter;
    } catch (error) {
        console.error('Error generating cover letter:', error);
        throw error;
    }
}

/**
 * Stream version of cover letter generation
 * Returns a callback to handle chunks
 */
export async function generateCoverLetterStream(
    params: CoverLetterRequest, // Using existing interface
    onChunk: (chunk: string) => void
): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('User not authenticated');

    // Call the NEW streaming function: ai-generate-letter-stream
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-generate-letter-stream`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || 'Failed to stream letter');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No stream reader available');

    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        // Clean up SSE prefix if present (optional, depends on how raw stream is handled)
        // Here we assume raw stream or simple text
        onChunk(chunk);
    }
}

/**
 * Stream version of cover letter generation
 * Returns a callback to handle chunks
 */
export async function generateCoverLetterStream(
    params: CoverLetterRequest,
    onChunk: (chunk: string) => void
): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('User not authenticated');

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-generate-letter`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || 'Failed to stream letter');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No stream reader available');

    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        onChunk(chunk);
    }
}
