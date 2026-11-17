import React, { useEffect, useCallback } from 'react';
import { Swords, Sparkles, HelpCircle, AlertCircle, ArrowLeftRight, Play } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { OnboardingModal } from './components/layout/OnboardingModal';
import { HistoryDrawer } from './components/history/HistoryDrawer';
import { HookEditor } from './components/arena/HookEditor';
import { ComparisonArena } from './components/arena/ComparisonArena';
import { Button } from './components/ui/Button';
import { Card, CardBody } from './components/ui/Card';
import { useHookStore } from './store/useHookStore';

const DEMO_PRESETS = [
  {
    name: '🏆 Clear Winner (A Leads)',
    hookA: 'Stop making this #1 coding mistake right now if you want to get hired in 2026!',
    hookB: 'Hey guys welcome back to my channel today we are talking about python programming.',
    topic: 'Software engineering tips and junior developer common mistakes',
  },
  {
    name: '⚖️ Close Result (ΔP ≤ 0.08)',
    hookA: 'Here are 5 Python mistakes beginners make when learning to code.',
    hookB: 'Here are 5 mistakes Python developers make when starting out.',
    topic: 'Python coding best practices and common beginner errors',
  },
  {
    name: '⚠️ Clickbait Mismatch',
    hookA: 'The insane secret that tech companies definitely do not want you to know!',
    hookB: 'How to easily configure your Python virtual environment step by step',
    topic: 'Python environment setup and package management tutorial',
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
    setOnboardingOpen,
  } = useHookStore();

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

  const loadPreset = (preset) => {
    setHookA(preset.hookA);
    setHookB(preset.hookB);
    setTopic(preset.topic);
  };

  return (
    <div className="min-h-screen bg-[#11121B] text-[#F1F5F9] flex flex-col font-sans selection:bg-[#A78BFA]/30 selection:text-white">
      {/* Top Navbar */}
      <Header />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Workspace Title & Onboarding Callout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-[#A78BFA] uppercase tracking-wider bg-[#A78BFA]/10 px-2.5 py-1 rounded-full border border-[#A78BFA]/20">
                Group M · Frontend Lead: Meenmoy
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F1F5F9] mt-2">
              Creator A/B Hook Lab & Virality Predictor
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 max-w-2xl">
              Compare two opening lines before recording. Evaluate real-time spoken delivery tempo (2.75 wps),
              clean up filler phrases, and estimate virality tier with calibrated ML inference.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setOnboardingOpen(true)}
              className="text-xs"
            >
              <HelpCircle className="w-3.5 h-3.5 mr-1" />
              How Scoring Works
            </Button>
          </div>
        </div>

        {/* Presentation & Viva Quick Demo Presets */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#191a2c]/40 border border-[#2e3152]/60">
          <span className="text-xs font-semibold text-[#A78BFA] flex items-center gap-1.5 mr-1">
            <Play className="w-3 h-3" />
            <span>Evaluation Presets:</span>
          </span>
          {DEMO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadPreset(preset)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#11121B] hover:bg-[#202238] border border-[#2e3152] hover:border-[#A78BFA]/40 text-[#94A3B8] hover:text-[#F1F5F9] transition-all"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Video Topic Summary Input (Hook-to-Promise Alignment Checker - FR-07) */}
        <Card className="border-[#2e3152]/80 bg-[#191a2c]/60">
          <CardBody className="p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="shrink-0 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Video Core Topic:</span>
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 5 simple habits that boost developer productivity (used to flag clickbait mismatch)..."
              className="flex-1 bg-[#11121B] text-xs sm:text-sm text-[#F1F5F9] placeholder-[#64748B] rounded-xl px-4 py-2.5 border border-[#2e3152] focus:border-[#A78BFA] focus:ring-1 focus:ring-[#A78BFA] focus:outline-none transition-all"
            />
          </CardBody>
        </Card>

        {/* Error notification banner if any */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Dual Editor Battle Grid (Hook A vs Hook B) with Swap Controls */}
        <div className="space-y-3">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={swapHooks}
              className="text-xs font-medium text-[#94A3B8] hover:text-[#A78BFA] flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#191a2c] border border-[#2e3152] hover:border-[#A78BFA]/40 transition-all"
              title="Swap Hook A and Hook B"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Swap Hook A ⇄ Hook B</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <HookEditor
              label="Hook Option A"
              tagline="Variant A"
              value={hookA}
              onChange={handleHookAChange}
              onApplyFix={handleApplyFixA}
              badgeVariant="accent"
              accentColor="#818CF8"
            />

            <HookEditor
              label="Hook Option B"
              tagline="Variant B (Challenger)"
              value={hookB}
              onChange={handleHookBChange}
              onApplyFix={handleApplyFixB}
              badgeVariant="default"
              accentColor="#C084FC"
            />
          </div>
        </div>

        {/* Action Trigger Bar: Run Battle */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2">
          <Button
            size="lg"
            variant="primary"
            onClick={runComparison}
            disabled={isComparing}
            className="w-full sm:w-auto px-10 shadow-xl shadow-[#A78BFA]/20 group"
          >
            <Swords className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            {isComparing ? 'Running Inference...' : 'Run A/B Hook Battle'}
          </Button>
        </div>

        {/* Comparison Arena: Results, Margin Guard & Recharts (Owner: Meenmoy) */}
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
