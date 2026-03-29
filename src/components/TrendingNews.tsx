import { motion } from 'framer-motion';
import { TrendingUp, Flame, ArrowRight, GraduationCap, TrendingUp as InvestorIcon, Rocket } from 'lucide-react';
import type { Persona } from '@/types/chat';

interface TrendingNewsProps {
  persona: Persona;
  onTopicClick: (topic: string) => void;
}

interface TrendingItem { title: string; tag: string; hot?: boolean }
const trendingByPersona: Record<Persona, TrendingItem[]> = {
  student: [
    { title: 'AI replacing entry-level jobs — What skills to learn now?', tag: 'Career', hot: true },
    { title: 'Top 10 emerging fields for 2026 graduates', tag: 'Education' },
    { title: 'How green energy is creating new career paths', tag: 'Sustainability' },
    { title: 'Remote internships surge 40% in tech sector', tag: 'Internships', hot: true },
    { title: "India's startup boom: What students should know", tag: 'Startups' },
    { title: 'Cybersecurity demand outpaces supply by 3x', tag: 'Tech' },
  ],
  investor: [
    { title: 'Sensex hits all-time high amid global rally', tag: 'Markets', hot: true },
    { title: 'Green hydrogen stocks surge 25% in Q1', tag: 'Energy' },
    { title: 'Banking NPAs at decade low — sector re-rating ahead?', tag: 'Banking', hot: true },
    { title: 'EV battery makers attract $4B in fresh funding', tag: 'Auto' },
    { title: 'Real estate REITs show 18% YoY returns', tag: 'Real Estate' },
    { title: 'Pharma sector: Biosimilar exports double', tag: 'Healthcare' },
  ],
  founder: [
    { title: 'Govt launches ₹10K Cr deep-tech startup fund', tag: 'Funding', hot: true },
    { title: 'AI-first SaaS startups see 3x valuation premiums', tag: 'AI', hot: true },
    { title: 'Healthcare disruption: Telemedicine adoption at 60%', tag: 'HealthTech' },
    { title: 'Simplified compliance norms for D2C brands', tag: 'Policy' },
    { title: 'B2B marketplaces raise $2.1B in 2026 so far', tag: 'B2B' },
    { title: 'AgriTech: Precision farming market hits $8B', tag: 'AgriTech' },
  ],
};

const personaConfig: Record<Persona, { icon: typeof GraduationCap; label: string; accent: string }> = {
  student: { icon: GraduationCap, label: 'Student', accent: 'from-blue-500 to-cyan-400' },
  investor: { icon: InvestorIcon, label: 'Investor', accent: 'from-emerald-500 to-teal-400' },
  founder: { icon: Rocket, label: 'Founder', accent: 'from-orange-500 to-amber-400' },
};

export function TrendingNews({ persona, onTopicClick }: TrendingNewsProps) {
  const items = trendingByPersona[persona];
  const config = personaConfig[persona];
  const Icon = config.icon;

  return (
    <motion.section
      key={persona}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-b border-border/50 bg-card/30"
    >
      <div className="px-6 py-3">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-orange-400" />
          <h2 className="font-display text-sm font-bold text-foreground">Trending for</h2>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md bg-gradient-to-r ${config.accent} text-white flex items-center gap-1`}>
            <Icon className="w-3 h-3" />
            {config.label}s
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {items.map((item, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onTopicClick(item.title)}
              className="group flex-shrink-0 flex items-start gap-2 bg-secondary/50 hover:bg-secondary border border-border/40 hover:border-primary/30 rounded-lg px-3 py-2.5 text-left transition-all max-w-[220px]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">{item.tag}</span>
                  {item.hot && <Flame className="w-3 h-3 text-orange-400" />}
                </div>
                <p className="text-xs text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </p>
              </div>
              <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary mt-1 shrink-0 transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
