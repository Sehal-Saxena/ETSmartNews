import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import type { ChatMessage, Persona } from '@/types/chat';

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  persona: Persona;
  onSend: (message: string) => void;
  suggestedQuestions: string[];
}

export function ChatPanel({ messages, isLoading, persona, onSend, suggestedQuestions }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        {messages.length === 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={persona}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, pointerEvents: 'none' as any }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {persona === 'student' ? '🎓 Student Mode' : persona === 'investor' ? '📈 Investor Mode' : '🚀 Founder Mode'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {persona === 'student'
                    ? 'Get simple, educational explanations with career insights'
                    : persona === 'investor'
                      ? 'Get market impact analysis, risk-reward insights & sector allocation'
                      : 'Get business opportunities, funding landscape & strategic insights'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {(persona === 'student'
                  ? ['How does AI affect jobs?', 'Explain green energy trends', 'Best sectors to study for?']
                  : persona === 'investor'
                    ? ['Green energy investment thesis', 'Banking sector risk analysis', 'EV market growth outlook']
                    : ['Startup funding landscape', 'AI business opportunities', 'Healthcare sector disruption']
                ).map((q) => (
                  <button
                    key={q}
                    onClick={() => onSend(q)}
                    className="px-3 py-1.5 text-xs rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors border border-border/50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border/50'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm prose-invert max-w-none [&_ul]:space-y-1 [&_li]:text-foreground [&_p]:text-foreground [&_strong]:text-primary [&_h3]:font-display [&_h3]:text-base [&_h3]:text-foreground [&_h2]:font-display [&_h2]:text-foreground">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    {msg.isStreaming && (
                      <span className="inline-block w-1.5 h-4 bg-primary rounded-full animate-pulse ml-0.5 align-middle" />
                    )}
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing with {persona} lens...</span>
          </motion.div>
        )}

        {/* Follow-up suggestions */}
        {suggestedQuestions.length > 0 && !isLoading && messages.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-2 pt-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => onSend(q)}
                className="px-3 py-1.5 text-xs rounded-full bg-secondary/60 text-secondary-foreground hover:bg-secondary transition-colors border border-border/30"
              >
                {q}
              </button>
            ))}
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border/50">
        <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-4 py-2 border border-border/50 focus-within:border-primary/30 transition-colors">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any news topic..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" variant="ghost" disabled={!input.trim() || isLoading} className="h-8 w-8 text-primary hover:text-primary">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
