import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import type { BriefingData } from '@/types/chat';

interface InsightsPanelProps {
  data: BriefingData | null;
}

const sentimentIcon = {
  positive: <TrendingUp className="w-3.5 h-3.5 text-accent" />,
  negative: <TrendingDown className="w-3.5 h-3.5 text-destructive" />,
  neutral: <Minus className="w-3.5 h-3.5 text-muted-foreground" />,
};

const sentimentColor = {
  positive: 'text-accent',
  negative: 'text-destructive',
  neutral: 'text-muted-foreground',
};

export function InsightsPanel({ data }: InsightsPanelProps) {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-3 p-6">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">Ask a question to see<br />intelligence insights here</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5 overflow-y-auto h-full">
      {/* Key Highlights */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Key Highlights</h3>
        <ul className="space-y-2">
          {data.highlights.map((h, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-2 text-sm text-foreground"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              {h}
            </motion.li>
          ))}
        </ul>
      </motion.section>

      {/* Sector Impact */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Sector Impact</h3>
        <div className="space-y-2">
          {data.sectorImpact.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.06 }}
              className="bg-secondary/40 rounded-lg p-3 border border-border/30"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-display font-semibold text-foreground">{s.sector}</span>
                {sentimentIcon[s.sentiment]}
              </div>
              <p className={`text-xs ${sentimentColor[s.sentiment]}`}>{s.impact}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Winners & Losers */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 gap-3">
        <div>
          <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-accent mb-2">Winners</h3>
          <ul className="space-y-1">
            {data.winners.map((w, i) => (
              <li key={i} className="text-xs text-foreground flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-accent" /> {w}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-destructive mb-2">Losers</h3>
          <ul className="space-y-1">
            {data.losers.map((l, i) => (
              <li key={i} className="text-xs text-foreground flex items-center gap-1.5">
                <TrendingDown className="w-3 h-3 text-destructive" /> {l}
              </li>
            ))}
          </ul>
        </div>
      </motion.section>
    </div>
  );
}
