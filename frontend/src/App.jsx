import React, { useEffect, useCallback } from 'react';
import { Swords, Sparkles, HelpCircle, AlertCircle, BookmarkPlus } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { OnboardingModal } from './components/layout/OnboardingModal';
import { HistoryDrawer } from './components/history/HistoryDrawer';
import { HookEditor } from './components/arena/HookEditor';
import { ComparisonArena } from './components/arena/ComparisonArena';
import { RemixLab } from './components/arena/RemixLab';
import { Button } from './components/ui/Button';
import { Card, CardBody } from './components/ui/Card';
import { useHookStore } from './store/useHookStore';

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

  return (
    <div className="min-h-screen bg-[#11121B] text-[#F1F5F9] flex flex-col font-sans selection:bg-[#A78BFA]/30 selection:text-white">
      {/* Top Navbar */}
      <Header />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Workspace Title & Onboarding Callout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F1F5F9]">
              Creator A/B Hook Lab
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

        {/* Dual Editor Battle Grid (Hook A vs Hook B) */}
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
            {isComparing ? 'Running Dual-Tower Inference...' : 'Run A/B Hook Battle'}
          </Button>
        </div>

        {/* Comparison Arena: Results, Margin Guard & Recharts */}
        {comparisonResult && <ComparisonArena result={comparisonResult} />}

        {/* Hook Remix & Inspiration Lab (Day 3 Feature) */}
        <RemixLab />
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
