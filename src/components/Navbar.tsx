import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Compass, BarChart3, Clock, Video, Zap, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'navigator', label: 'Navigator', icon: Compass },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
  { id: 'timeline', label: 'Story Arc', icon: Clock },
  { id: 'video', label: 'Video Brief', icon: Video },
];

export function Navbar({ activeSection, onSectionChange }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-border/50 bg-card/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-1.5">
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="font-display">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-accent" />
            <span>Powered by Multi-Agent AI</span>
          </div>
          <span className="text-border">|</span>
          <span>Real-time Analysis</span>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden border-t border-border/30 px-4 py-2 space-y-1"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { onSectionChange(item.id); setMobileOpen(false); }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm ${
                  activeSection === item.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-display">{item.label}</span>
              </button>
            );
          })}
        </motion.div>
      )}
    </nav>
  );
}
