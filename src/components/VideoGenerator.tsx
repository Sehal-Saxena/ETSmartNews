import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Video, Loader2, Volume2, RotateCcw, TrendingUp, Globe, Zap, BarChart3, Shield, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoGeneratorProps {
  topic: string;
  highlights: string[];
}

// Strip markdown bold markers and other formatting
function cleanText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/^[-•]\s*/, '')
    .trim();
}

// Pick an icon based on keyword matching
function getSlideIcon(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes('market') || lower.includes('stock') || lower.includes('growth')) return TrendingUp;
  if (lower.includes('global') || lower.includes('world') || lower.includes('trade')) return Globe;
  if (lower.includes('energy') || lower.includes('tech') || lower.includes('ai') || lower.includes('innovation')) return Zap;
  if (lower.includes('sector') || lower.includes('industry') || lower.includes('economy')) return BarChart3;
  if (lower.includes('risk') || lower.includes('security') || lower.includes('regulation')) return Shield;
  return Lightbulb;
}

// Gradient palettes for visual variety
const SLIDE_THEMES = [
  { bg: 'from-primary/20 via-primary/5 to-background', accent: 'bg-primary/15', text: 'text-primary' },
  { bg: 'from-blue-500/15 via-blue-500/5 to-background', accent: 'bg-blue-500/15', text: 'text-blue-400' },
  { bg: 'from-emerald-500/15 via-emerald-500/5 to-background', accent: 'bg-emerald-500/15', text: 'text-emerald-400' },
  { bg: 'from-amber-500/15 via-amber-500/5 to-background', accent: 'bg-amber-500/15', text: 'text-amber-400' },
  { bg: 'from-violet-500/15 via-violet-500/5 to-background', accent: 'bg-violet-500/15', text: 'text-violet-400' },
];

export function VideoGenerator({ topic, highlights }: VideoGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanedHighlights = highlights.map(cleanText).filter(Boolean);

  const slides = [
    { type: 'title' as const, text: cleanText(topic) || 'Intelligence Briefing' },
    ...cleanedHighlights.slice(0, 4).map((h, i) => ({ type: 'point' as const, text: h, index: i })),
    { type: 'outro' as const, text: 'ET SmartNews AI' },
  ];

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setCurrentSlide(0);
    setIsPlaying(false);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 2500);
  };

  const handlePlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(true);
    setCurrentSlide(0);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= slides.length - 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
  };

  const handleReplay = () => {
    handlePlay();
  };

  const currentTheme = SLIDE_THEMES[currentSlide % SLIDE_THEMES.length];
  const SlideIcon = slides[currentSlide]?.type === 'point'
    ? getSlideIcon(slides[currentSlide].text)
    : Video;

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <Video className="w-3.5 h-3.5" /> AI News Video
      </h3>

      {/* Video Preview */}
      <div className="flex-1 bg-secondary/20 rounded-xl border border-border/30 overflow-hidden relative min-h-[220px]">
        <AnimatePresence mode="wait">
          {/* Placeholder */}
          {!isGenerated && !isGenerating && (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center border border-primary/10">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Generate Video Briefing</p>
                  <p className="text-xs text-muted-foreground mt-1">AI-powered visual news summary</p>
                </div>
                <Button
                  onClick={handleGenerate}
                  size="sm"
                  disabled={cleanedHighlights.length === 0}
                  className="gap-2"
                >
                  <Zap className="w-3.5 h-3.5" /> Generate
                </Button>
              </div>
            </motion.div>
          )}

          {/* Generating */}
          {isGenerating && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <Loader2 className="w-16 h-16 text-primary/30 animate-spin" />
                  <Video className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Composing scenes…</p>
                  <p className="text-xs text-muted-foreground mt-1">Analyzing highlights & building visuals</p>
                </div>
                <div className="w-52 h-1.5 bg-secondary rounded-full mx-auto overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.5, ease: 'easeInOut' }}
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Generated Video */}
          {isGenerated && (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
            >
              {/* Animated background */}
              <motion.div
                key={`bg-${currentSlide}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className={`absolute inset-0 bg-gradient-to-br ${currentTheme.bg}`}
              />

              {/* Decorative circles */}
              <motion.div
                key={`deco-${currentSlide}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.08 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary"
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.05 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-accent"
              />

              {/* Slide content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 1.02 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-center justify-center p-6"
                >
                  {/* TITLE slide */}
                  {slides[currentSlide]?.type === 'title' && (
                    <div className="text-center max-w-[85%] space-y-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20"
                      >
                        <Globe className="w-6 h-6 text-primary" />
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold"
                      >
                        Intelligence Briefing
                      </motion.p>
                      <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="font-display text-xl font-bold text-foreground leading-tight"
                      >
                        {slides[currentSlide].text}
                      </motion.h2>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="w-16 h-0.5 bg-gradient-to-r from-primary to-transparent mx-auto"
                      />
                    </div>
                  )}

                  {/* POINT slide */}
                  {slides[currentSlide]?.type === 'point' && (
                    <div className="max-w-[90%] space-y-4">
                      <div className="flex items-start gap-3">
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 12 }}
                          className={`w-10 h-10 rounded-xl ${currentTheme.accent} flex items-center justify-center shrink-0 border border-white/5`}
                        >
                          <SlideIcon className={`w-5 h-5 ${currentTheme.text}`} />
                        </motion.div>
                        <div className="space-y-1.5 flex-1">
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className={`text-[10px] uppercase tracking-widest font-semibold ${currentTheme.text}`}
                          >
                            Key Insight {(slides[currentSlide] as any).index + 1}
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-sm font-medium text-foreground leading-relaxed"
                          >
                            {slides[currentSlide].text}
                          </motion.p>
                        </div>
                      </div>

                      {/* Visual accent bar */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                        className={`h-1 rounded-full bg-gradient-to-r ${currentTheme.bg} origin-left`}
                      />
                    </div>
                  )}

                  {/* OUTRO slide */}
                  {slides[currentSlide]?.type === 'outro' && (
                    <div className="text-center space-y-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                        className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center border border-primary/15"
                      >
                        <Zap className="w-7 h-7 text-primary" />
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="font-display text-base font-bold text-foreground"
                      >
                        {slides[currentSlide].text}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                      >
                        Your AI News Intelligence
                      </motion.p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-3 left-3 right-3 flex items-center justify-between"
                >
                  <Button onClick={handleReplay} size="sm" variant="secondary" className="gap-1.5 text-xs h-7">
                    {currentSlide >= slides.length - 1 ? (
                      <><RotateCcw className="w-3 h-3" /> Replay</>
                    ) : (
                      <><Play className="w-3 h-3" /> Play</>
                    )}
                  </Button>
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">AI Narration</span>
                  </div>
                </motion.div>
              )}

              {/* Progress dots */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {slides.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      width: i === currentSlide ? 20 : 6,
                      opacity: i === currentSlide ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`h-1.5 rounded-full ${i === currentSlide ? 'bg-primary' : 'bg-muted-foreground'}`}
                  />
                ))}
              </div>

              {/* Slide counter */}
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-3 right-3 text-[10px] text-muted-foreground font-mono"
                >
                  {currentSlide + 1}/{slides.length}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
