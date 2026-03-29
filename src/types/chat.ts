export type Persona = 'student' | 'investor' | 'founder';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface BriefingData {
  highlights: string[];
  sectorImpact: { sector: string; impact: string; sentiment: 'positive' | 'negative' | 'neutral' }[];
  winners: string[];
  losers: string[];
  followUpQuestions: string[];
}

export interface TimelineEvent {
  date: string;
  event: string;
  sentiment: number;
}
