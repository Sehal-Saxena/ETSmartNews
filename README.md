# ET SmartNews: Interactive AI-Native News Experience

An AI-powered news intelligence platform that transforms static business news into interactive, personalized, and multi-modal briefings using a multi-agent architecture.

![ET SmartNews](src/assets/et-logo.png)

---

## 🧠 Architecture Overview

### Multi-Agent AI System

The backend runs a **multi-agent orchestration pipeline** via a serverless edge function:

```
User Query
    │
    ▼
┌──────────────────┐
│  Orchestrator     │ ← Coordinates all agents
│  Agent            │
└──────┬───────────┘
       │
  ┌────┴────┐
  │         │
  ▼         ▼
┌─────┐  ┌──────────────┐
│ RAG │  │Personalization│
│Agent│  │    Agent      │
└──┬──┘  └──────┬───────┘
   │            │
   ▼            ▼
 Relevant    Persona-tuned
 News Data   System Prompt
       │            │
       └─────┬──────┘
             ▼
      ┌─────────────┐
      │  LLM        │
      └──────┬──────┘
             │
             ▼
    Streamed Intelligence
        Briefing
```

| Agent | Role |
|-------|------|
| **Retrieval Agent** | Searches a mock news database using keyword matching to find relevant articles for the user's query |
| **Personalization Agent** | Adapts the system prompt based on the selected persona (Student / Investor / Founder) |
| **Orchestrator Agent** | Coordinates retrieval + personalization, constructs the full prompt, and streams the response from the LLM |

### Response Format

Every AI response follows a structured **Intelligence Briefing** format:

- **Key Highlights** — Top 3–5 takeaways
- **Sector Impact** — Per-sector analysis with sentiment
- **Winners & Losers** — Who benefits and who doesn't
- **What This Means for You** — Persona-tailored advice
- **Suggested Follow-ups** — Clickable next questions

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui, Framer Motion |
| **State** | React hooks, TanStack React Query |
| **Routing** | React Router v6 |
| **Charts** | Recharts |
| **Markdown** | react-markdown |
| **Backend** | Lovable Cloud (Supabase Edge Functions) |
| **AI** | Lovable AI Gateway (LLM streaming via SSE) |
| **Deployment** | Lovable Platform |

---

## 📁 Project Structure

```
src/
├── assets/             # Logo and static assets
├── components/
│   ├── Header.tsx       # Top bar with logo, persona selector, metrics
│   ├── Navbar.tsx       # Navigation between sections
│   ├── ChatPanel.tsx    # AI Navigator chat interface (streaming)
│   ├── InsightsPanel.tsx # Parsed briefing display (sectors, winners/losers)
│   ├── TimelinePanel.tsx # Story Arc Tracker with sentiment chart
│   ├── VideoGenerator.tsx# Animated video-style briefing slides
│   ├── TrendingNews.tsx  # Persona-specific trending topics
│   ├── PersonaSelector.tsx # Student / Investor / Founder toggle
│   ├── MetricsBar.tsx   # Live status indicators
│   ├── Footer.tsx       # Site footer
│   └── ui/              # shadcn/ui primitives
├── data/
│   └── mockNews.ts      # Static trending news per persona
├── hooks/               # Custom React hooks
├── integrations/
│   └── supabase/        # Auto-generated Supabase client & types
├── pages/
│   ├── Index.tsx        # Main app page (all sections)
│   └── NotFound.tsx     # 404 page
├── types/
│   └── chat.ts          # TypeScript interfaces (Persona, ChatMessage, BriefingData)
└── main.tsx             # App entry point

supabase/
└── functions/
    └── news-navigator/
        └── index.ts     # Multi-agent edge function (retrieval + personalization + orchestration)
```

---

## 🔄 User Workflow

1. **Land on Home** — See welcome screen with trending news for the default persona
2. **Select Persona** — Choose Student, Investor, or Founder to personalize the experience
3. **Browse Trending Topics** — Click any topic card to auto-query the AI Navigator
4. **Chat with Navigator** — Ask any business/news question; get a streamed intelligence briefing
5. **View Insights** — Parsed briefing with sector impact cards, winners/losers badges
6. **Explore Story Arc** — Timeline of events, sentiment trend chart, key entities
7. **Generate Video** — Animated slide-based visual briefing from the AI response

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs at `http://localhost:8080`.

---

## 🧪 Sample Test Queries

Try these in the Navigator for each persona:

| Persona | Sample Query |
|---------|-------------|
| **Student** | "What's happening in AI and how can I build a career in it?" |
| **Investor** | "Which sectors should I allocate capital to in 2026?" |
| **Founder** | "What startup opportunities exist in green energy?" |
| **Any** | "Tell me about the electric vehicle market" |
| **Any** | "What's the state of cybersecurity in 2026?" |

---

## 📄 License

Built for hackathon demonstration purposes.
