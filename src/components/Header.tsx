import { motion } from 'framer-motion';
import { PersonaSelector } from './PersonaSelector';
import { MetricsBar } from './MetricsBar';
import type { Persona } from '@/types/chat';
import etLogo from '@/assets/et-logo.png';

interface HeaderProps {
  persona: Persona;
  onPersonaChange: (p: Persona) => void;
}

export function Header({ persona, onPersonaChange }: HeaderProps) {
  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-md px-6 py-3">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <img src={etLogo} alt="ET SmartNews" className="h-9 w-auto" />
          <div>
            <h1 className="font-display text-lg font-bold text-foreground leading-tight flex items-center gap-2">
              SmartNews
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/15 text-primary font-semibold">AI</span>
            </h1>
            <p className="text-[10px] text-muted-foreground">Interactive Intelligence Platform</p>
          </div>
        </motion.div>

        <div className="hidden lg:block">
          <MetricsBar />
        </div>

        <PersonaSelector selected={persona} onSelect={onPersonaChange} />
      </div>
    </header>
  );
}
