import React, { useEffect, useCallback } from 'react';
import { Swords, Sparkles, AlertCircle } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { OnboardingModal } from './components/layout/OnboardingModal';
import { HistoryDrawer } from './components/history/HistoryDrawer';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { HookEditor } from './components/arena/HookEditor';
import { ComparisonArena } from './components/arena/ComparisonArena';
import { RemixLab } from './components/arena/RemixLab';
import { Button } from './components/ui/Button';
import { Card, CardBody } from './components/ui/Card';
import { useHookStore } from './store/useHookStore';

const PRESETS = [
  {
    label: 'Tech / Coding Mistake',
    hookA: 'Stop scrolling if you code in Python, here are 5 critical mistakes.',
    hookB: 'Hello guys today in this video I will discuss some programming errors.',
    topic: 'Software engineering career tips and junior developer mistakes',
  },
  {
    label: 'Close Match (MarginGuard Tie)',
    hookA: 'Why 99% of developers struggle with memory leaks in web applications.',
    hookB: 'The real reason software developers run into memory issues in web apps.',
    topic: 'Python coding best practices and common beginner errors',
  },
  {
    label: 'E-Commerce Hook',
    hookA: "Don't buy this viral mechanical keyboard before checking this 1 fatal flaw.",
    hookB: 'Reviewing the top mechanical keyboard that I purchased on sale recently.',
    topic: 'Mechanical keyboard consumer review and purchasing advice',
  },
];

export function App() {
  const {
    hookA,
    hookB,
    topic,
    setHookA,
    setHookB,
    setTopic,
    applyQuickFix,
    runComparison,
    isComparing,
    comparisonResult,
    error,
    setOnboardingOpen,
    theme,
    fontSize,
    isLoggedIn,
    loginBack,
  } = useHookStore();

  // Apply dark mode class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (theme === 'system' && prefersDark)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Apply font size class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-sm-base', 'text-base-base', 'text-lg-base');
    if (fontSize === 'small') root.style.fontSize = '14px';
    else if (fontSize === 'large') root.style.fontSize = '17px';
    else root.style.fontSize = '16px';
  }, [fontSize]);

  // Run initial comparison on mount if result is empty
  useEffect(() => {
    if (!comparisonResult) {
      runComparison();
    }
  }, []);

  // Isolated callbacks for HookEditor inputs to guarantee 60 FPS typing without re-rendering peer
  const handleHookAChange = useCallback((val) => setHookA(val), [setHookA]);
  const handleHookBChange = useCallback((val) => setHookB(val), [setHookB]);
  const handleApplyFixA = useCallback((id) => applyQuickFix('A', id), [applyQuickFix]);
  const handleApplyFixB = useCallback((id) => applyQuickFix('B', id), [applyQuickFix]);

  const loadPreset = (item) => {
    setHookA(item.hookA);
    setHookB(item.hookB);
    setTopic(item.topic);
    runComparison();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F0F1A] text-[#0D0C22] dark:text-white flex flex-col font-sans selection:bg-[#EA4C89] selection:text-white transition-colors duration-300">
      {/* Top Navbar */}
      <Header />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Workspace Title & Presets Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F7F4] border border-[#E7E7E9] text-[#6E6D7A] text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#EA4C89]"></span>
              <span>Pre-Production Video Virality Predictor</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0D0C22]">
              Creator A/B Hook Lab
            </h1>
            <p className="text-sm text-[#6E6D7A] mt-1.5 max-w-2xl leading-relaxed">
              Compare two opening video lines before recording. Evaluate real-time spoken delivery tempo (2.75 wps),
              clean up filler phrases, and estimate virality tier with calibrated ML inference.
            </p>
          </div>

          {/* Quick Preset Chips (Dribbble Pill Style) */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[#6E6D7A] font-semibold mr-1">Presets:</span>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadPreset(p)}
                className="px-3.5 py-1.5 rounded-full bg-[#F8F7F4] hover:bg-[#F3F3F6] border border-[#E7E7E9] hover:border-[#0D0C22] text-[#0D0C22] font-semibold transition-all shadow-sm active:scale-95"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video Topic Summary Input (Hook-to-Promise Alignment Checker - FR-07) */}
        <Card className="border-[#E7E7E9] bg-[#F8F7F4]/60">
          <CardBody className="p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="shrink-0 text-xs font-bold text-[#EA4C89] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Video Core Topic:</span>
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 5 simple habits that boost developer productivity (used to flag clickbait mismatch)..."
              className="flex-1 bg-white text-xs sm:text-sm text-[#0D0C22] placeholder-[#9E9EA7] rounded-full px-5 py-2.5 border border-[#E7E7E9] focus:border-[#EA4C89] focus:ring-2 focus:ring-[#EA4C89]/20 focus:outline-none transition-all shadow-sm"
            />
          </CardBody>
        </Card>

        {/* Error notification banner if any */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Dual Editor Battle Grid (Hook A vs Hook B) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <HookEditor
            label="Hook Option A"
            tagline="Variant A"
            value={hookA}
            onChange={handleHookAChange}
            onApplyFix={handleApplyFixA}
            badgeVariant="dark"
            accentColor="#0D0C22"
          />

          <HookEditor
            label="Hook Option B"
            tagline="Variant B (Challenger)"
            value={hookB}
            onChange={handleHookBChange}
            onApplyFix={handleApplyFixB}
            badgeVariant="accent"
            accentColor="#EA4C89"
          />
        </div>

        {/* Action Trigger Bar: Run Battle */}
        <div className="flex flex-col items-center justify-center gap-3 py-4">
          <Button
            size="lg"
            variant="accent"
            onClick={runComparison}
            disabled={isComparing}
            className="w-full sm:w-auto px-10 shadow-lg shadow-[#EA4C89]/25 group font-extrabold text-sm sm:text-base hover:scale-105 transition-all"
          >
            <Swords className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            {isComparing ? 'Running Dual-Tower Inference...' : 'Run A/B Hook Battle'}
          </Button>
          <span className="text-xs text-[#6E6D7A] font-medium">
            Evaluates 24 psycholinguistic features with calibrated ML inference
          </span>
        </div>

        {/* Comparison Arena: Results, Margin Guard & Recharts */}
        {comparisonResult && <ComparisonArena result={comparisonResult} />}

        {/* Hook Remix & Inspiration Lab (Day 3 Feature) */}
        <RemixLab />
      </main>

      {/* Slide-out Library / History Drawer */}
      <HistoryDrawer />

      {/* Settings Panel */}
      <SettingsPanel />

      {/* Guided Walkthrough Modal */}
      <OnboardingModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
