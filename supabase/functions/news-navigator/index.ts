import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Mock news database for RAG-like retrieval
const NEWS_DATABASE = [
  { title: "AI Industry Sees Unprecedented Growth", category: "Technology", content: "Global AI market projected to reach $500B by 2027. India's AI push includes dedicated research labs, talent development programs, and enterprise adoption accelerating across sectors.", sentiment: "positive" },
  { title: "Electric Vehicle Sales Surge 45%", category: "Automotive", content: "EV sales crossed 2 million units globally. Charging infrastructure growing rapidly. Battery technology breakthroughs reducing costs by 30%.", sentiment: "positive" },
  { title: "Green Energy Investments Hit Record $500B", category: "Energy", content: "Solar manufacturing, green hydrogen, and offshore wind projects attract record global investment. Renewable energy now cheaper than fossil fuels in 90% of markets.", sentiment: "positive" },
  { title: "Global Startup Funding Rebounds in 2026", category: "Startups", content: "VC funding rebounds to $350B globally. AI, climate-tech, and healthcare startups lead. Seed-stage valuations stabilize after 2024 correction.", sentiment: "positive" },
  { title: "Banking Sector Embraces Digital Transformation", category: "Banking", content: "Major banks investing in AI-powered risk assessment, blockchain settlements, and neobank partnerships. Digital lending grows 60% YoY.", sentiment: "neutral" },
  { title: "Healthcare Tech Revolution Accelerates", category: "Healthcare", content: "AI diagnostics, telemedicine platforms, and personalized medicine drive healthcare innovation. Digital health market expected to reach $650B by 2028.", sentiment: "positive" },
  { title: "Real Estate Market Shifts to Hybrid Models", category: "Real Estate", content: "Remote work reshapes commercial real estate. Co-working spaces grow 40%. Residential demand shifts to tier-2 cities and suburban areas.", sentiment: "neutral" },
  { title: "Cybersecurity Spending Surges Amid Rising Threats", category: "Technology", content: "Global cybersecurity market reaches $250B. AI-powered threat detection, zero-trust architecture, and quantum-safe encryption gain traction.", sentiment: "neutral" },
  { title: "Agriculture Tech Disrupts Traditional Farming", category: "Agriculture", content: "Precision agriculture, drone-based monitoring, and AI crop management boost yields by 25%. Agri-fintech platforms connect farmers to global markets.", sentiment: "positive" },
  { title: "Space Tech Industry Attracts Major Investments", category: "Space", content: "Private space companies raise $15B in 2026. Satellite internet, space manufacturing, and lunar exploration programs accelerate.", sentiment: "positive" },
];

// Agent: Retrieval - fetches relevant news
function retrievalAgent(query: string) {
  const queryLower = query.toLowerCase();
  const relevant = NEWS_DATABASE.filter((n) =>
    n.title.toLowerCase().includes(queryLower) ||
    n.content.toLowerCase().includes(queryLower) ||
    n.category.toLowerCase().includes(queryLower) ||
    queryLower.split(" ").some((word) => word.length > 3 && (n.title.toLowerCase().includes(word) || n.content.toLowerCase().includes(word)))
  );
  return relevant.length > 0 ? relevant : NEWS_DATABASE.slice(0, 5);
}

// Agent: Personalization - adapts system prompt
function personalizationAgent(persona: string): string {
  switch (persona) {
    case "student":
      return "You are explaining news to a university student. Use simple language, analogies, and real-world examples. Focus on learning opportunities, career implications, and skill development. Be educational and encouraging. Do NOT assume the topic is about any specific country's budget unless the user explicitly asks about it.";
    case "investor":
      return "You are briefing a sophisticated investor. Focus on market impact, risk-reward analysis, sector allocation implications, and actionable investment insights. Use financial terminology appropriately. Analyze the topic the user asks about, not unrelated fiscal policy.";
    case "founder":
      return "You are advising a startup founder. Focus on business opportunities, competitive landscape, funding trends, market gaps, and strategic implications. Be action-oriented. Stick to the topic the user asks about and do not inject unrelated government policy analysis.";
    default:
      return "You are a helpful news analyst providing balanced, insightful analysis.";
  }
}

// Agent: Orchestrator - coordinates all agents
async function orchestratorAgent(query: string, persona: string, conversationHistory: any[], apiKey: string) {
  const relevantNews = retrievalAgent(query);
  const personaPrompt = personalizationAgent(persona);

  const newsContext = relevantNews
    .map((n) => `[${n.category}] ${n.title}: ${n.content} (Sentiment: ${n.sentiment})`)
    .join("\n");

  const systemPrompt = `${personaPrompt}

You are the ET SmartNews AI Navigator. You provide intelligence briefings, not just summaries. Focus your analysis on whatever topic the user asks about. Only use the news context below if it is directly relevant to the user's query — do not force unrelated news into your answer.

CONTEXT - Relevant news articles:
${newsContext}

RESPONSE FORMAT - Always structure your response as follows:

## 📊 Intelligence Briefing

### Key Highlights
- [3-5 bullet points of the most important takeaways]

### Sector Impact
For each relevant sector, provide:
- **[Sector Name]**: [Impact description] (Positive/Negative/Neutral)

### Winners & Losers
**Winners:** [List companies, sectors, or groups that benefit]
**Losers:** [List those negatively affected]

### What This Means for You
[2-3 sentences tailored to the ${persona} persona]

### Suggested Follow-ups
- [Question 1]
- [Question 2]
- [Question 3]

Be specific, data-driven, and insightful. Don't just repeat news — analyze it.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
    { role: "user", content: query },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      stream: true,
    }),
  });

  return response;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, persona, conversationHistory = [] } = await req.json();

    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await orchestratorAgent(
      query,
      persona || "student",
      conversationHistory,
      LOVABLE_API_KEY
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("news-navigator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
