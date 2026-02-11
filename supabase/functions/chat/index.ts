import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the AI customer service assistant for Summit Outdoors, a premium outdoor gear store. You are friendly, professional, and concise.

STORE INFORMATION:
- Store name: Summit Outdoors
- Products: Tents (2-person to 6-person), sleeping bags (rated 0°F to 40°F), backpacks (30L to 75L), hiking boots (sizes 6-14), trekking poles, camp stoves, water filters
- Shipping: Free shipping on orders over $100, otherwise $8.99 flat rate
- Shipping time: 3-5 business days (continental US)
- International shipping: Canada and Mexico only, $24.99 flat rate, 7-14 business days
- Return policy: 30-day free returns on all items. Items must be unused with original tags. Refund processed within 5-7 business days after receipt.
- Store support hours: Monday-Friday 9am-6pm EST
- Email: support@summitoutdoors.com
- Phone: 1-800-SUMMIT-1

PRODUCT DETAILS:
- Hiking boots: Available in sizes 6-14 (whole and half sizes). Waterproof Gore-Tex lining. Models: TrailMaster ($129), SummitPro ($189), AlpineElite ($249)
- Tents: All tents are 3-season with waterproof rainfly. Models: BaseCamp 2P ($199), TrailHome 4P ($299), FamilyDome 6P ($449)
- Sleeping bags: Synthetic fill, machine washable. Models: SummerLite 40°F ($89), TrailSleep 20°F ($149), ArcticDream 0°F ($229)
- Backpacks: Adjustable torso length, hydration compatible. Models: DayTripper 30L ($79), WeekendWarrior 50L ($159), ExpeditionPack 75L ($249)

RESPONSE GUIDELINES:
- Keep responses SHORT: 2-3 sentences maximum
- Be friendly but professional
- If asked about order status: Ask for the order number, then provide a simulated response like "Your order #[number] shipped on [2 days ago] via UPS and should arrive by [3 days from now]. Track it here: https://tracking.summitoutdoors.com/[number]"
- If a question is too complex or outside your knowledge, say: "Great question! Let me connect you with our team for detailed help. You can reach us at support@summitoutdoors.com or call 1-800-SUMMIT-1."
- If the user asks a non-store-related question (weather, general knowledge, etc.), politely redirect: "I'm here to help with Summit Outdoors questions! How can I assist you with your order or products?"
- If the user is rude or angry, stay professional: "I understand your frustration, and I want to help. Let me connect you with our team at support@summitoutdoors.com to resolve this right away."
- NEVER make up information you don't have
- NEVER discuss competitors
- Always sign off with a helpful offer: "Is there anything else I can help with?"`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
