import { motion } from 'framer-motion';
import { Zap, Clock, Brain, BarChart3 } from 'lucide-react';

const metrics = [
  { icon: Clock, label: 'Time Saved', value: '80%', color: 'text-primary' },
  { icon: Brain, label: 'AI Agents', value: '6', color: 'text-accent' },
  { icon: BarChart3, label: 'Insights', value: 'Instant', color: 'text-primary' },
  { icon: Zap, label: 'Sources', value: '50+', color: 'text-accent' },
];

export function MetricsBar() {
  return (
    <div className="flex items-center gap-6">
      {metrics.map((m, i) => {
        const Icon = m.icon;
        return (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex items-center gap-2"
          >
            <Icon className={`w-3.5 h-3.5 ${m.color}`} />
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-display font-bold text-foreground">{m.value}</span>
              <span className="text-[10px] text-muted-foreground">{m.label}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
