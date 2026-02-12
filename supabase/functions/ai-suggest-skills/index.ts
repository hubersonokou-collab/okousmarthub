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
        const { jobTitle, industry, existingSkills } = await req.json()

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
                    content: 'Tu es un expert RH qui suggère des compétences pertinentes pour un CV professionnel. Réponds uniquement en JSON valide.'
                }, {
                    role: 'user',
                    content: `Poste: ${jobTitle || 'Non spécifié'}
Secteur: ${industry || 'Non spécifié'}
Compétences existantes: ${existingSkills.join(', ') || 'Aucune'}

Suggère 5 compétences techniques pertinentes et 3 soft skills qui amélioreraient ce CV.
Retourne uniquement un JSON au format: {"technical": ["compétence1", "compétence2", ...], "soft": ["compétence1", "compétence2", ...]}`
                }],
                temperature: 0.7,
                max_tokens: 300,
            }),
        })

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`)
        }

        const data = await response.json()
        const content = data.choices[0]?.message?.content || '{}'

        // Parse JSON response from GPT-4
        const suggestions = JSON.parse(content)

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
            p_action_type: 'ai_skills_suggestion',
            p_description: 'Suggestions de compétences par IA',
        })

        if (creditError) {
            console.error('Credit deduction error:', creditError)
        }

        return new Response(
            JSON.stringify(suggestions),
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
