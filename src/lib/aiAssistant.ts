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
