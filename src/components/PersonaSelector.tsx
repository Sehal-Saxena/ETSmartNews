import { motion } from 'framer-motion';
import { GraduationCap, TrendingUp, Rocket } from 'lucide-react';
import type { Persona } from '@/types/chat';

const personas = [
  {
    id: 'student' as Persona,
    label: 'Student',
    icon: GraduationCap,
    description: 'Simple explanations, learning-focused',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'investor' as Persona,
    label: 'Investor',
    icon: TrendingUp,
    description: 'Market impact, risk analysis',
    gradient: 'from-emerald-500 to-teal-400',
  },
  {
    id: 'founder' as Persona,
    label: 'Founder',
    icon: Rocket,
    description: 'Business opportunities, strategy',
    gradient: 'from-orange-500 to-amber-400',
  },
];

interface PersonaSelectorProps {
  selected: Persona;
  onSelect: (persona: Persona) => void;
}

export function PersonaSelector({ selected, onSelect }: PersonaSelectorProps) {
  return (
    <div className="flex gap-2">
      {personas.map((p, i) => {
        const Icon = p.icon;
        const isActive = selected === p.id;
        return (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(p.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'bg-secondary/50 text-muted-foreground border border-transparent hover:bg-secondary hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="font-display">{p.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
