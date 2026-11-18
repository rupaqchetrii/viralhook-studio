import React, { useState, useEffect, useCallback } from 'react';
import {
  Swords,
  Sparkles,
  HelpCircle,
  AlertCircle,
  RefreshCw,
  Zap,
  Search,
  Link2,
  Share2,
  Video,
  ArrowRight,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { OnboardingModal } from './components/layout/OnboardingModal';
import { HistoryDrawer } from './components/history/HistoryDrawer';
import { HookEditor } from './components/arena/HookEditor';
import { ComparisonArena } from './components/arena/ComparisonArena';
import { RemixLab } from './components/arena/RemixLab';
import { OutcomeModal } from './components/analytics/OutcomeModal';
import { AnalyticsModal } from './components/analytics/AnalyticsModal';
import { OAuthModal } from './components/oauth/OAuthModal';
import { useHookStore } from './store/useHookStore';
import { ingestSocialUrlAPI } from './services/api';

export function App() {
  const {
    hookA,
    hookB,
    topic,
    platform,
    setHookA,
    setHookB,
    setTopic,
    setPlatform,
    applyQuickFix,
    runComparison,
    isComparing,
    comparisonResult,
    error,
    setOnboardingOpen,
    swapHooks,
  } = useHookStore();

  // Modals state
  const [isOutcomeOpen, setIsOutcomeOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isOAuthOpen, setIsOAuthOpen] = useState(false);

  // Social Ingestion state
  const [showIngestInput, setShowIngestInput] = useState(false);
  const [socialUrl, setSocialUrl] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestNotice, setIngestNotice] = useState(null);

  // Run initial comparison on mount if result is empty
  useEffect(() => {
    if (!comparisonResult) {
      runComparison();
    }
  }, []);

  // Global Keyboard Shortcut: Ctrl + Enter / Cmd + Enter to Run Battle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runComparison();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [runComparison]);

  const handleHookAChange = useCallback((val) => setHookA(val), [setHookA]);
  const handleHookBChange = useCallback((val) => setHookB(val), [setHookB]);
  const handleApplyFixA = useCallback((id) => applyQuickFix('A', id), [applyQuickFix]);
  const handleApplyFixB = useCallback((id) => applyQuickFix('B', id), [applyQuickFix]);

  const handleIngestUrl = async (e) => {
    e.preventDefault();
    if (!socialUrl.trim()) return;

    setIsIngesting(true);
    setIngestNotice(null);

    try {
      const data = await ingestSocialUrlAPI(socialUrl);
      if (data && data.extracted_hook) {
        setHookA(data.extracted_hook);
        // Suggest a high-converting curiosity / contrarian challenger hook
        const challenger = `Stop ignoring this: ${data.extracted_hook.replace(/^Why\s+|^The secret to\s+|^Stop doing this with your\s+/i, '')}`;
        setHookB(challenger);
        if (data.detected_platform) {
          setPlatform(data.detected_platform);
        }

        setIngestNotice({
          platform: data.detected_platform,
          creator: data.creator_handle,
          benchmark: data.platform_benchmarks,
        });

        // Auto trigger comparison with the freshly ingested hooks
        setTimeout(() => {
          runComparison();
        }, 150);
      }
    } catch (err) {
      alert(err.message || 'Failed to ingest URL. Ensure it is a valid TikTok, Reels, or Shorts link.');
    } finally {
      setIsIngesting(false);
    }
  };

  const PRESET_TOPICS = [
    { label: '🔥 Tech & Coding', value: 'Software engineering tips and junior developer common mistakes' },
    { label: '📈 Creator Growth', value: 'How to scale your audience on TikTok and Shorts in 30 days' },
    { label: '⚡ Productivity', value: '5 morning habits that will double your focus and daily energy' },
  ];

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F8FAFC] flex flex-col font-sans selection:bg-violet-500/30 selection:text-white bg-studio-grid relative overflow-x-hidden">
      {/* Background Ambient Radial Glow Spheres */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-gradient-to-b from-violet-600/20 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none rounded-full z-0" />
      <div className="absolute top-[40%] -left-32 w-[400px] h-[400px] bg-fuchsia-600/10 blur-[130px] pointer-events-none rounded-full z-0" />
      <div className="absolute top-[60%] -right-32 w-[450px] h-[450px] bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full z-0" />

      {/* Top Floating Navbar with Analytics & Channels Buttons */}
      <Header
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenOAuth={() => setIsOAuthOpen(true)}
      />

      {/* Main Studio Workspace */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-violet-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
            <span>Tri-Modal NLP & 24-Feature Psycholinguistic Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Craft Video Hooks That{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              Stop The Scroll.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Test and benchmark two opening lines before hitting record. Calibrated for 1–5 second spoken tempo,
            filler phrase detection, and follower-normalized virality potential.
          </p>
        </div>

        {/* Video Topic Search & Ingest Floating Bar */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.08] shadow-2xl max-w-4xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="shrink-0 text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Video Core Topic:</span>
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter your video promise (e.g. 5 simple coding habits to get hired in 2026)..."
                className="w-full bg-black/40 text-xs sm:text-sm text-white placeholder-zinc-500 rounded-xl px-4 py-2.5 border border-white/[0.08] focus:border-violet-500/50 focus:outline-none transition-all shadow-inner"
              />
            </div>
            <button
              onClick={() => setShowIngestInput(!showIngestInput)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08] transition-all"
              title="Import Hook from TikTok, Reels, or Shorts URL"
            >
              <Link2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showIngestInput ? 'Hide Link Import' : 'Import Social Link'}</span>
            </button>
          </div>

          {/* Collapsible Social URL Ingestion Input */}
          {showIngestInput && (
            <form onSubmit={handleIngestUrl} className="pt-2 border-t border-white/[0.06] flex flex-col sm:flex-row items-stretch gap-2.5 animate-fade-in-up">
              <div className="relative flex-1">
                <input
                  type="url"
                  required
                  value={socialUrl}
                  onChange={(e) => setSocialUrl(e.target.value)}
                  placeholder="Paste TikTok, Instagram Reels, or YouTube Shorts link..."
                  className="w-full bg-black/50 text-xs text-white placeholder-zinc-500 rounded-xl pl-9 pr-3 py-2 border border-cyan-500/30 focus:border-cyan-400 focus:outline-none"
                />
                <Video className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                type="submit"
                disabled={isIngesting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-cyan-600/20"
              >
                {isIngesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting Hook...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Ingest Hook</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Social Ingest Intelligence Notice Banner */}
          {ingestNotice && (
            <div className="p-3 rounded-xl bg-cyan-950/25 border border-cyan-500/30 text-xs text-cyan-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Extracted from <strong className="text-white">{ingestNotice.platform.toUpperCase()}</strong> ({ingestNotice.creator})
                </span>
              </div>
              <div className="text-[11px] text-cyan-300 font-mono">
                Target Pacing: &le;{ingestNotice.benchmark.target_pacing_sec}s &bull; Focus: {ingestNotice.benchmark.algorithm_focus}
              </div>
            </div>
          )}

          {/* Quick Preset Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/[0.04] text-xs">
            <span className="text-zinc-500 text-[11px] font-medium">Quick Prompts:</span>
            {PRESET_TOPICS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setTopic(p.value)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06] hover:border-violet-500/30 transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error notification banner if any */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-3 max-w-4xl mx-auto shadow-lg shadow-rose-950/20">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Dual Editor Battle Grid (Hook A vs Hook B) */}
        <div className="relative">
          {/* Centered VS Floating Badge */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl glass-panel-elevated border border-white/20 flex items-center justify-center text-white font-black text-xs tracking-wider shadow-2xl shadow-violet-950/40">
              VS
            </div>
            <button
              onClick={swapHooks}
              title="Swap Hook A and Hook B"
              className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/20 text-zinc-400 hover:text-white border border-white/10 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
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
              accentColor="#38BDF8"
            />
          </div>
        </div>

        {/* Action Trigger Bar: Run Battle Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2">
          <button
            onClick={runComparison}
            disabled={isComparing}
            className="relative group px-10 py-3.5 rounded-2xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-xl shadow-violet-600/30 active:scale-95 transition-all duration-200 border border-white/20 disabled:opacity-50 flex items-center gap-2.5"
          >
            <Swords className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            <span>{isComparing ? 'Running Dual-Tower Inference...' : 'Run A/B Hook Battle'}</span>
            <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/30 border border-white/15 text-zinc-300">
              Ctrl + ↵
            </span>
          </button>
        </div>

        {/* Comparison Arena: Results, Margin Guard & Recharts */}
        {comparisonResult && (
          <ComparisonArena
            result={comparisonResult}
            onOpenOutcome={() => setIsOutcomeOpen(true)}
          />
        )}

        {/* Hook Remix & Inspiration Lab (Day 3 Feature) */}
        <RemixLab />
      </main>

      {/* Slide-out Library / History Drawer */}
      <HistoryDrawer />

      {/* Guided Walkthrough Modal */}
      <OnboardingModal />

      {/* 48-Hour Outcome Feedback Loop Modal */}
      <OutcomeModal
        isOpen={isOutcomeOpen}
        onClose={() => setIsOutcomeOpen(false)}
        battle={comparisonResult}
      />

      {/* Database & Multi-User Analytics Intelligence Modal */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      {/* Direct Social OAuth Integration Modal */}
      <OAuthModal
        isOpen={isOAuthOpen}
        onClose={() => setIsOAuthOpen(false)}
      />

      {/* Refined Footer */}
      <Footer />
    </div>
  );
}

export default App;
