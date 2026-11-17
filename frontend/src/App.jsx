import React, { useEffect, useCallback } from 'react';
import { Swords, Sparkles, AlertCircle, ArrowLeftRight } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { OnboardingModal } from './components/layout/OnboardingModal';
import { HistoryDrawer } from './components/history/HistoryDrawer';
import { HookEditor } from './components/arena/HookEditor';
import { ComparisonArena } from './components/arena/ComparisonArena';
import { useHookStore } from './store/useHookStore';

const EXAMPLES = [
  {
    label: 'Clear winner',
    hookA: 'Stop making this #1 coding mistake right now if you want to get hired in 2026!',
    hookB: 'Hey guys, welcome back to my channel! Today we are talking about Python mistakes.',
    topic: 'Software engineering career tips and junior developer mistakes',
  },
  {
    label: 'Close tie',
    hookA: 'Here are 5 Python mistakes beginners make when learning to code.',
    hookB: 'Here are 5 mistakes Python developers make when starting out.',
    topic: 'Python coding best practices and common beginner errors',
  },
  {
    label: 'Off-topic clickbait',
    hookA: 'The insane secret that tech companies definitely do not want you to know!',
    hookB: 'How to easily configure your Python virtual environment step by step',
    topic: 'Python virtual environment setup and pip tutorial',
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
    swapHooks,
    applyQuickFix,
    runComparison,
    isComparing,
    comparisonResult,
    error,
  } = useHookStore();

  // Run initial comparison on mount if result is empty
  useEffect(() => {
    if (!comparisonResult) {
      runComparison();
    }
  }, [comparisonResult, runComparison]);

  // Isolated callbacks for HookEditor inputs to guarantee 60 FPS typing without re-rendering peer
  const handleHookAChange = useCallback((val) => setHookA(val), [setHookA]);
  const handleHookBChange = useCallback((val) => setHookB(val), [setHookB]);
  const handleApplyFixA = useCallback((id) => applyQuickFix('A', id), [applyQuickFix]);
  const handleApplyFixB = useCallback((id) => applyQuickFix('B', id), [applyQuickFix]);

  const loadExample = (item) => {
    setHookA(item.hookA);
    setHookB(item.hookB);
    setTopic(item.topic);
  };

  return (
    <div className="min-h-screen bg-[#0A0B10] text-[#EDEDEF] flex flex-col font-sans selection:bg-[#A78BFA]/30 selection:text-white">
      {/* Top Navbar */}
      <Header />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* Workspace Title & Onboarding Callout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#EDEDEF]">
              Hook Studio
            </h1>
            <p className="text-sm text-[#8E90A0] mt-1.5 max-w-2xl leading-relaxed">
              Test two video openings side-by-side. See which one grabs attention in the first 3 seconds,
              cuts filler phrases, and keeps viewers watching.
            </p>
          </div>

          {/* Quick Example Presets */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[#64748B] font-medium mr-1">Try example:</span>
            {EXAMPLES.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadExample(item)}
                className="px-2.5 py-1 rounded-lg bg-[#14151F] hover:bg-[#1E202C] text-[#8E90A0] hover:text-[#EDEDEF] border border-[#222432] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video Topic Summary Input (Optional) */}
        <div className="rounded-xl bg-[#13141C] border border-[#222432] p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label htmlFor="video-topic" className="shrink-0 text-xs font-medium text-[#8E90A0] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Video topic (optional):</span>
          </label>
          <input
            id="video-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. 5 Python mistakes beginners make (used to detect off-topic clickbait)..."
            className="flex-1 bg-[#0B0C10] text-xs sm:text-sm text-[#EDEDEF] placeholder-[#55586D] rounded-lg px-3.5 py-2 border border-[#1E202C] focus:border-[#A78BFA] focus:ring-1 focus:ring-[#A78BFA]/30 focus:outline-none transition-all"
          />
        </div>

        {/* Error notification banner if any */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Dual Editor Battle Grid (Hook A vs Hook B) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-[#64748B]">Compare two variants</span>
            <button
              type="button"
              onClick={swapHooks}
              className="text-xs font-medium text-[#8E90A0] hover:text-[#EDEDEF] flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#14151F] border border-[#222432] hover:border-[#2D3042] transition-all"
              title="Swap Hook A and Hook B"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Swap A ⇄ B</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            <HookEditor
              label="Option A"
              tagline="Your original line"
              value={hookA}
              onChange={handleHookAChange}
              onApplyFix={handleApplyFixA}
              badgeVariant="accent"
            />

            <HookEditor
              label="Option B"
              tagline="Alternative challenger"
              value={hookB}
              onChange={handleHookBChange}
              onApplyFix={handleApplyFixB}
              badgeVariant="default"
            />
          </div>
        </div>

        {/* Action Trigger Bar: Run Comparison */}
        <div className="flex items-center justify-center pt-2">
          <button
            type="button"
            onClick={runComparison}
            disabled={isComparing}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#A78BFA] hover:bg-[#9065f7] active:scale-[0.99] text-[#0A0B10] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#A78BFA]/20 transition-all disabled:opacity-50"
          >
            <Swords className="w-4 h-4" />
            <span>{isComparing ? 'Analyzing hooks...' : 'Compare Openings'}</span>
          </button>
        </div>

        {/* Comparison Arena: Results, Winner & Visual Distribution */}
        {comparisonResult && <ComparisonArena result={comparisonResult} />}
      </main>

      {/* Slide-out Library / History Drawer */}
      <HistoryDrawer />

      {/* Guided Walkthrough Modal */}
      <OnboardingModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
