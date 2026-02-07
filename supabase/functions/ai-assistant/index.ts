import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // System prompts based on context
    const systemPrompts: Record<string, string> = {
      general: `Tu es l'assistant IA d'OkouSmart Hub, une plateforme de services professionnels en Côte d'Ivoire. 
Tu aides les utilisateurs avec:
- Rédaction académique (mémoires, rapports de stage)
- Inscription VAP/VAE (DUT, Licence, Master)
- Assistance voyage (visas, Decreto Flussi)
- Création de CV et lettres de motivation ATS
- Gestion comptable et création d'entreprise
- Création de sites web
- Formations pratiques

Sois professionnel, amical et précis. Réponds en français. Propose toujours des actions concrètes.`,
      
      redaction: `Tu es un expert en rédaction académique. Tu aides avec:
- Les rapports de stage (BT, BTS)
- Les mémoires de Licence et Master
- La méthodologie de recherche
- La structuration des documents
- Les normes de rédaction APA/Vancouver

Donne des conseils pratiques et des exemples concrets.`,
      
      voyage: `Tu es un expert en assistance voyage. Tu conseilles sur:
- Les procédures de visa (France, Canada, Allemagne, Italie)
- Le programme Decreto Flussi pour l'Italie
- Les documents requis pour chaque destination
- Les délais et les coûts
- Les astuces pour maximiser les chances d'obtention

Sois précis sur les procédures actuelles.`,
      
      emploi: `Tu es un expert en recherche d'emploi. Tu aides avec:
- La création de CV optimisés pour les ATS
- Les lettres de motivation percutantes
- Les modèles français et canadiens
- La traduction en anglais et allemand
- Les conseils pour les entretiens

Donne des exemples concrets et personnalisés.`,
      
      entreprise: `Tu es un expert en création d'entreprise et comptabilité. Tu conseilles sur:
- Les formalités de création d'entreprise
- La gestion comptable
- Les obligations fiscales
- Le choix du statut juridique
- L'optimisation fiscale

Sois précis sur la réglementation ivoirienne.`,
      
      digital: `Tu es un expert en développement web. Tu conseilles sur:
- Les sites vitrines et e-commerce
- Les portfolios professionnels
- Les technologies web modernes
- Le référencement SEO
- L'expérience utilisateur

Propose des solutions adaptées au budget du client.`,
      
      formation: `Tu es un formateur expert. Tu guides sur:
- Les formations en informatique
- La maintenance et réparation
- Le design graphique
- Le marketing digital
- Les compétences pratiques

Adapte tes conseils au niveau du participant.`,
    };

    const systemPrompt = systemPrompts[context] || systemPrompts.general;

    // Call Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        stream: type === "stream",
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes. Veuillez réessayer dans quelques instants." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporairement indisponible." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    if (type === "stream") {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "Je n'ai pas pu générer une réponse.";

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Assistant error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Erreur inconnue" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
