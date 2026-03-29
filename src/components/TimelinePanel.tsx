import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, ArrowRight, Users, Building2, Landmark, Cpu, Leaf, Heart, Rocket } from 'lucide-react';
import type { BriefingData } from '@/types/chat';

interface TimelinePanelProps {
  data: BriefingData | null;
  topic: string;
  persona: string;
}

function generateTimelineFromBriefing(data: BriefingData, topic: string): { date: string; event: string; sentiment: number }[] {
  const events: { date: string; event: string; sentiment: number }[] = [];
  const today = new Date();

  // Generate a story arc from the briefing highlights & sector impact
  const allItems = [
    ...data.highlights.map((h) => ({ text: h, type: 'highlight' as const })),
    ...data.sectorImpact.map((s) => ({ text: `${s.sector}: ${s.impact}`, type: s.sentiment })),
  ];

  if (allItems.length === 0) return [];

  // Create a timeline spanning past weeks leading to "now"
  const count = Math.min(allItems.length, 8);
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.round((count - 1 - i) * 3);
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    const dateStr = d.toISOString().slice(0, 10);

    const item = allItems[i];
    let sentiment = 65 + Math.round(Math.random() * 20);
    if (item.type === 'positive') sentiment = 72 + Math.round(Math.random() * 18);
    else if (item.type === 'negative') sentiment = 40 + Math.round(Math.random() * 20);
    else if (item.type === 'neutral') sentiment = 55 + Math.round(Math.random() * 15);

    events.push({ date: dateStr, event: item.text.slice(0, 120), sentiment });
  }

  return events;
}

function extractEntities(data: BriefingData): { name: string; type: 'winner' | 'loser' | 'sector' }[] {
  const entities: { name: string; type: 'winner' | 'loser' | 'sector' }[] = [];
  data.winners.forEach((w) => entities.push({ name: w.trim(), type: 'winner' }));
  data.losers.forEach((l) => entities.push({ name: l.trim(), type: 'loser' }));
  data.sectorImpact.forEach((s) => entities.push({ name: s.sector, type: 'sector' }));
  return entities;
}

function getEntityIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('bank') || lower.includes('financ')) return Landmark;
  if (lower.includes('tech') || lower.includes('ai') || lower.includes('cyber')) return Cpu;
  if (lower.includes('energy') || lower.includes('green') || lower.includes('solar')) return Leaf;
  if (lower.includes('health') || lower.includes('pharma')) return Heart;
  if (lower.includes('space') || lower.includes('startup')) return Rocket;
  if (lower.includes('real estate') || lower.includes('infra')) return Building2;
  return Users;
}

export function TimelinePanel({ data, topic, persona }: TimelinePanelProps) {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-3 p-6">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">Ask a question to generate<br />a dynamic story arc timeline</p>
      </div>
    );
  }

  const timeline = generateTimelineFromBriefing(data, topic);
  const entities = extractEntities(data);
  const chartData = timeline.map((e) => ({
    date: e.date.slice(5),
    sentiment: e.sentiment,
    event: e.event,
  }));

  const avgSentiment = chartData.length > 0
    ? Math.round(chartData.reduce((s, c) => s + c.sentiment, 0) / chartData.length)
    : 0;

  return (
    <div className="p-4 space-y-5 overflow-y-auto h-full">
      {/* Topic Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-primary/5 border border-primary/20 rounded-xl p-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Story Arc for</p>
        <p className="text-sm font-display font-bold text-foreground mt-0.5 line-clamp-2">{topic}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground capitalize">{persona}</span>
          <span className="text-[10px] text-muted-foreground">Avg Sentiment: <span className={avgSentiment >= 65 ? 'text-accent' : avgSentiment >= 50 ? 'text-foreground' : 'text-destructive'}>{avgSentiment}</span></span>
        </div>
      </motion.div>

      {/* Sentiment Chart */}
      {chartData.length > 0 && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" /> Sentiment Trend
          </h3>
          <div className="h-36 bg-secondary/30 rounded-xl p-2 border border-border/30">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="sentimentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'hsl(215, 12%, 50%)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[30, 95]} tick={{ fontSize: 9, fill: 'hsl(215, 12%, 50%)' }} axisLine={false} tickLine={false} width={25} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(220, 18%, 10%)',
                    border: '1px solid hsl(220, 14%, 18%)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: 'hsl(210, 20%, 92%)',
                  }}
                  formatter={(value: number) => [`${value}`, 'Sentiment']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area type="monotone" dataKey="sentiment" stroke="hsl(210, 100%, 56%)" fill="url(#sentimentGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      )}

      {/* Key Entities */}
      {entities.length > 0 && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Users className="w-3.5 h-3.5" /> Key Entities
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {entities.slice(0, 12).map((e, i) => {
              const Icon = getEntityIcon(e.name);
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.04 }}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium border ${
                    e.type === 'winner'
                      ? 'bg-accent/10 text-accent border-accent/20'
                      : e.type === 'loser'
                      ? 'bg-destructive/10 text-destructive border-destructive/20'
                      : 'bg-secondary text-muted-foreground border-border/30'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {e.name}
                </motion.span>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Timeline Events */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" /> Story Arc
        </h3>
        <div className="relative pl-4 space-y-3">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
          {timeline.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.06 }}
              className="relative flex items-start gap-3"
            >
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 -ml-[5px] border-2 ${
                e.sentiment >= 65 ? 'bg-accent border-accent/30' : e.sentiment >= 50 ? 'bg-muted-foreground border-muted' : 'bg-destructive border-destructive/30'
              }`} />
              <div>
                <p className="text-[10px] text-muted-foreground">{e.date}</p>
                <p className="text-xs text-foreground mt-0.5 leading-relaxed">{e.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
