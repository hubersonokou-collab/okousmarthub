import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { summary } = await req.json()

        if (!summary || summary.trim().length < 10) {
            throw new Error('Summary too short or empty')
        }

        const openaiKey = Deno.env.get('OPENAI_API_KEY')
        if (!openaiKey) {
            throw new Error('OPENAI_API_KEY not configured')
        }

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{
                    role: 'system',
                    content: `Tu es un expert en rédaction de CV. Améliore les résumés professionnels pour les rendre:
- Plus percutants et accrocheurs
- Optimisés pour les ATS (Applicant Tracking Systems)
- Orientés résultats avec des verbes d'action
- Professionnels et concis (maximum 120 mots)

Retourne uniquement le résumé amélioré, sans introduction ni commentaires.`
                }, {
                    role: 'user',
                    content: `Améliore ce résumé professionnel:\n\n${summary}`
                }],
                temperature: 0.8,
                max_tokens: 250,
            }),
        })

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`)
        }

        const data = await response.json()
        const enhancedSummary = data.choices[0]?.message?.content?.trim() || summary

        // Get auth token from request
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('No authorization header')
        }

        // Create Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: authHeader },
                },
            }
        )

        // Get user from auth
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
        if (userError || !user) {
            throw new Error('Unauthorized')
        }

        // Deduct 1 credit
        const { error: creditError } = await supabaseClient.rpc('deduct_credits', {
            p_user_id: user.id,
            p_credits: 1,
            p_action_type: 'ai_summary_enhancement',
            p_description: 'Amélioration résumé professionnel par IA',
        })

        if (creditError) {
            console.error('Credit deduction error:', creditError)
        }

        return new Response(
            JSON.stringify({ enhancedSummary }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            },
        )
    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            },
        )
    }
})
