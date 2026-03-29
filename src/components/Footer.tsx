import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 px-6 py-2 flex items-center justify-between text-[10px] text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <Zap className="w-3 h-3 text-primary" />
        <span>© 2026 ET SmartNews — AI-Powered News Intelligence</span>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <span>Multi-Agent Architecture</span>
        <span className="text-border">•</span>
        <span>6 AI Agents</span>
        <span className="text-border">•</span>
        <span>Real-time Streaming</span>
      </div>
    </footer>
  );
}
