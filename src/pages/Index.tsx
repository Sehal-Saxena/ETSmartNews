import { useState, useCallback, useRef } from 'react';
import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import { TrendingNews } from '@/components/TrendingNews';
import { ChatPanel } from '@/components/ChatPanel';
import { InsightsPanel } from '@/components/InsightsPanel';
import { TimelinePanel } from '@/components/TimelinePanel';
import { VideoGenerator } from '@/components/VideoGenerator';
import { Footer } from '@/components/Footer';
import type { Persona, ChatMessage, BriefingData } from '@/types/chat';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Video, MessageSquare, Compass } from 'lucide-react';

type ActiveSection = 'home' | 'navigator' | 'insights' | 'timeline' | 'video';
type RightPanel = 'insights' | 'timeline' | 'video';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/news-navigator`;

function parseBriefingFromMarkdown(text: string): BriefingData | null {
  try {
    const highlights: string[] = [];
    const sectorImpact: BriefingData['sectorImpact'] = [];
    const winners: string[] = [];
    const losers: string[] = [];
    const followUpQuestions: string[] = [];

    const highlightsMatch = text.match(/### Key Highlights\n([\s\S]*?)(?=###|$)/);
    if (highlightsMatch) {
      highlightsMatch[1].split('\n').forEach((line) => {
        const clean = line.replace(/^[-*]\s*/, '').trim();
        if (clean) highlights.push(clean);
      });
    }

    const sectorMatch = text.match(/### Sector Impact\n([\s\S]*?)(?=###|$)/);
    if (sectorMatch) {
      const sectorLines = sectorMatch[1].split('\n').filter((l) => l.trim().startsWith('-') || l.trim().startsWith('*'));
      sectorLines.forEach((line) => {
        const match = line.match(/\*\*(.+?)\*\*:\s*(.+?)(?:\((\w+)\))?$/);
        if (match) {
          const sentimentText = (match[3] || '').toLowerCase();
          const sentiment = sentimentText.includes('positive') ? 'positive' : sentimentText.includes('negative') ? 'negative' : 'neutral';
          sectorImpact.push({ sector: match[1], impact: match[2].trim(), sentiment });
        }
      });
    }

    const winnersMatch = text.match(/\*\*Winners?:?\*\*\s*(.+)/i);
    if (winnersMatch) winnersMatch[1].split(/,|;/).forEach((w) => { const c = w.trim(); if (c) winners.push(c); });

    const losersMatch = text.match(/\*\*Losers?:?\*\*\s*(.+)/i);
    if (losersMatch) losersMatch[1].split(/,|;/).forEach((l) => { const c = l.trim(); if (c) losers.push(c); });

    const followUpMatch = text.match(/### Suggested Follow-ups?\n([\s\S]*?)(?=###|$)/);
    if (followUpMatch) {
      followUpMatch[1].split('\n').forEach((line) => {
        const clean = line.replace(/^[-*]\s*/, '').trim();
        if (clean && clean.includes('?')) followUpQuestions.push(clean);
      });
    }

    if (highlights.length === 0 && sectorImpact.length === 0) return null;
    return { highlights, sectorImpact, winners, losers, followUpQuestions };
  } catch {
    return null;
  }
}

export default function Index() {
  const [persona, setPersona] = useState<Persona>('investor');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<ActiveSection>('home');
  const [rightPanel, setRightPanel] = useState<RightPanel>('insights');
  const [lastTopic, setLastTopic] = useState('');

  const personaRef = useRef(persona);
  personaRef.current = persona;
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const handlePersonaChange = (p: Persona) => {
    setPersona(p);
    setMessages([]);
    setBriefing(null);
    setSuggestedQuestions([]);
    setLastTopic('');
  };

  const sendMessage = useCallback(async (content: string) => {
    setActiveSection('navigator');

    const currentPersona = personaRef.current;
    const currentMessages = messagesRef.current;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setLastTopic(content);

    let assistantContent = '';
    const assistantId = (Date.now() + 1).toString();
    const conversationHistory = currentMessages.map((m) => ({ role: m.role, content: m.content }));

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ query: content, persona: currentPersona, conversationHistory }),
      });

      if (!resp.ok || !resp.body) throw new Error(`Request failed: ${resp.status}`);

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      const upsertAssistant = (text: string) => {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && last.id === assistantId) {
            return prev.map((m) => (m.id === assistantId ? { ...m, content: text, isStreaming: true } : m));
          }
          return [...prev, { id: assistantId, role: 'assistant', content: text, timestamp: new Date(), isStreaming: true }];
        });
      };

      let streamDone = false;
      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) { assistantContent += delta; upsertAssistant(assistantContent); }
          } catch { textBuffer = line + '\n' + textBuffer; break; }
        }
      }

      setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, isStreaming: false } : m)));
      const parsed = parseBriefingFromMarkdown(assistantContent);
      if (parsed) { setBriefing(parsed); setSuggestedQuestions(parsed.followUpQuestions); }
    } catch (e) {
      console.error('Chat error:', e);
      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleTrendingClick = (topic: string) => {
    sendMessage(topic);
  };

  const panelTabs: { id: RightPanel; label: string; icon: typeof BarChart3 }[] = [
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'video', label: 'Video', icon: Video },
  ];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header persona={persona} onPersonaChange={handlePersonaChange} />
      <Navbar activeSection={activeSection} onSectionChange={(s) => setActiveSection(s as ActiveSection)} />

      {activeSection === 'home' && (
        <TrendingNews persona={persona} onTopicClick={handleTrendingClick} />
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Home welcome */}
        {activeSection === 'home' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center gap-6 p-8">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Compass className="w-10 h-10 text-primary" />
            </motion.div>
            <div className="max-w-md">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Welcome to ET SmartNews</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your AI-powered news intelligence platform. Click a trending topic above or navigate to <strong className="text-primary">Navigator</strong> to start exploring.
              </p>
            </div>
            <button onClick={() => setActiveSection('navigator')} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:bg-primary/90 transition-colors">
              Start Exploring
            </button>
          </motion.div>
        )}

        {/* Navigator: Chat + Right Panel */}
        {activeSection === 'navigator' && (
          <>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full md:w-[45%] lg:w-[40%] border-r border-border/50 flex flex-col">
              <div className="px-4 py-2 border-b border-border/30 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-display font-semibold text-foreground">News Navigator</span>
              </div>
              <ChatPanel messages={messages} isLoading={isLoading} persona={persona} onSend={sendMessage} suggestedQuestions={suggestedQuestions} />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="hidden md:flex flex-1 flex-col">
              <div className="px-4 py-2 border-b border-border/30 flex items-center gap-1">
                {panelTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id} onClick={() => setRightPanel(tab.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${rightPanel === tab.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex-1 overflow-hidden">
                {rightPanel === 'insights' && <InsightsPanel data={briefing} />}
                {rightPanel === 'timeline' && <TimelinePanel data={briefing} topic={lastTopic} persona={persona} />}
                {rightPanel === 'video' && <VideoGenerator topic={lastTopic} highlights={briefing?.highlights || []} />}
              </div>
            </motion.div>
          </>
        )}

        {/* Standalone full-page views */}
        {activeSection === 'insights' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
            <div className="px-4 py-2 border-b border-border/30 flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-display font-semibold text-foreground">Intelligence Insights</span>
            </div>
            <div className="flex-1 overflow-hidden"><InsightsPanel data={briefing} /></div>
          </motion.div>
        )}

        {activeSection === 'timeline' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
            <div className="px-4 py-2 border-b border-border/30 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-display font-semibold text-foreground">Story Arc Tracker</span>
            </div>
            <div className="flex-1 overflow-hidden"><TimelinePanel data={briefing} topic={lastTopic} persona={persona} /></div>
          </motion.div>
        )}

        {activeSection === 'video' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
            <div className="px-4 py-2 border-b border-border/30 flex items-center gap-2">
              <Video className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-display font-semibold text-foreground">Video Briefing</span>
            </div>
            <div className="flex-1 overflow-hidden"><VideoGenerator topic={lastTopic} highlights={briefing?.highlights || []} /></div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
