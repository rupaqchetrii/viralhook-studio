import React, { useState, useEffect, useCallback } from 'react';
import {
  Swords,
  Sparkles,
  AlertCircle,
  Link2,
  Video,
  RefreshCw,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { OnboardingModal } from './components/layout/OnboardingModal';
import { HistoryDrawer } from './components/history/HistoryDrawer';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { LoginPage } from './components/auth/LoginPage';
import { HookEditor } from './components/arena/HookEditor';
import { ComparisonArena } from './components/arena/ComparisonArena';
import { RemixLab } from './components/arena/RemixLab';
import { UniversalHookLab } from './components/universal/UniversalHookLab';
import { OutcomeModal } from './components/analytics/OutcomeModal';
import { AnalyticsModal } from './components/analytics/AnalyticsModal';
import { Card, CardBody } from './components/ui/Card';
import { OAuthModal } from './components/oauth/OAuthModal';
import { useHookStore } from './store/useHookStore';
import { ingestSocialUrlAPI } from './services/api';

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
    activeTab,
    hookA,
    setHookA,
    hookB,
    setHookB,
    topic,
    setTopic,
    applyQuickFix,
    runComparison,
    isComparing,
    comparisonResult,
    error,
    theme,
    fontSize,
    isLoggedIn,
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

  // Apply font size
  useEffect(() => {
    if (fontSize === 'small') document.documentElement.style.fontSize = '14px';
    else if (fontSize === 'large') document.documentElement.style.fontSize = '17px';
    else document.documentElement.style.fontSize = '16px';
  }, [fontSize]);

  // Run initial comparison on mount if result is empty
  useEffect(() => {
    if (!comparisonResult && isLoggedIn) {
      runComparison();
    }
  }, [runComparison, comparisonResult, isLoggedIn]);

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

  const handleIngestUrl = async (e) => {
    e.preventDefault();
    if (!socialUrl.trim()) return;

    setIsIngesting(true);
    setIngestNotice(null);

    try {
      const data = await ingestSocialUrlAPI(socialUrl);
      if (data && data.extracted_hook) {
        setHookA(data.extracted_hook);
        if (data.topic_inference) {
          setTopic(data.topic_inference);
        }
        setIngestNotice({
          platform: data.platform || 'social',
          creator: data.creator_handle || 'Creator',
          benchmark: data.algorithm_benchmark || {
            target_pacing_sec: 3.0,
            algorithm_focus: 'High initial retention',
          },
        });
        setSocialUrl('');
        setShowIngestInput(false);
        runComparison();
      }
    } catch (err) {
      alert(err.message || 'Failed to ingest link.');
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F0F1A] text-[#0D0C22] dark:text-white flex flex-col font-sans selection:bg-[#EA4C89] selection:text-white transition-colors duration-300 relative overflow-x-hidden">
      {/* World-Class Ambient Background Glow Elements */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[1100px] h-[520px] bg-gradient-to-tr from-[#EA4C89]/12 via-purple-600/10 to-indigo-500/10 rounded-full blur-[130px] pointer-events-none -z-10 animate-drift-slow" />
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-drift-reverse" />
      <div className="fixed -bottom-40 -left-40 w-96 h-96 bg-[#EA4C89]/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-drift-slow" />

      {/* Top Navbar */}
      <Header
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenOAuth={() => setIsOAuthOpen(true)}
      />

      {/* Logged-Out / Auth State */}
      {!isLoggedIn ? (
        <LoginPage />
      ) : (
        /* Main Studio Workspace */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <div key={activeTab} className="animate-tab-switch space-y-10">
            {activeTab === 'universal' ? (
              <UniversalHookLab />
            ) : (
              <>
                {/* Workspace Title & Presets Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2 animate-stagger-1">
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
              <span className="text-[#6E6D7A] dark:text-zinc-400 font-bold mr-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#EA4C89]" />
                Presets:
              </span>
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadPreset(p)}
                  className="px-4 py-2 rounded-full bg-[#F8F7F4] hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 border border-[#E7E7E9] hover:border-[#EA4C89] dark:border-white/10 dark:hover:border-[#EA4C89] text-[#0D0C22] dark:text-white font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 text-xs flex items-center gap-1.5 cursor-pointer group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA4C89] group-hover:scale-125 transition-transform" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Video Topic Summary Input + Social Link Ingest */}
          <Card className="border-[#E7E7E9] bg-[#F8F7F4]/60 overflow-hidden">
            <CardBody className="p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
                <button
                  type="button"
                  onClick={() => setShowIngestInput(!showIngestInput)}
                  className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-white hover:bg-[#0D0C22] text-[#0D0C22] hover:text-white border border-[#E7E7E9] transition-all shadow-sm active:scale-95"
                  title="Import Hook from TikTok, Reels, or Shorts URL"
                >
                  <Link2 className="w-3.5 h-3.5 text-[#EA4C89]" />
                  <span>{showIngestInput ? 'Hide Link Import' : 'Import Social Link'}</span>
                </button>
              </div>

              {/* Collapsible Social URL Ingestion Input */}
              {showIngestInput && (
                <form onSubmit={handleIngestUrl} className="pt-3 border-t border-[#E7E7E9] flex flex-col sm:flex-row items-stretch gap-2.5">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      required
                      value={socialUrl}
                      onChange={(e) => setSocialUrl(e.target.value)}
                      placeholder="Paste TikTok, Instagram Reels, or YouTube Shorts link..."
                      className="w-full bg-white text-xs text-[#0D0C22] placeholder-[#9E9EA7] rounded-full pl-9 pr-4 py-2 border border-[#E7E7E9] focus:border-[#EA4C89] focus:outline-none"
                    />
                    <Video className="w-4 h-4 text-[#EA4C89] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    disabled={isIngesting}
                    className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#0D0C22] hover:bg-[#3D3D4E] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
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
                <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>
                      Extracted from <strong className="text-cyan-950">{ingestNotice.platform.toUpperCase()}</strong> ({ingestNotice.creator})
                    </span>
                  </div>
                  <div className="text-[11px] text-cyan-800 font-mono">
                    Target Pacing: &le;{ingestNotice.benchmark.target_pacing_sec}s &bull; Focus: {ingestNotice.benchmark.algorithm_focus}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Error notification banner if any */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Real-Time Neural Scanning Radar Bar during inference */}
          {isComparing && (
            <div className="p-4 rounded-2xl bg-[#0D0C22] text-white border border-[#EA4C89]/60 shadow-[0_10px_30px_rgba(234,76,137,0.3)] flex items-center justify-between gap-4 animate-pulse-glow">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-[#EA4C89] animate-spin shrink-0" />
                <div>
                  <div className="text-xs font-black tracking-wide flex items-center gap-2">
                    <span>Running Dual-Tower 384-Dim Latent Semantic Inference...</span>
                  </div>
                  <div className="text-[11px] text-[#9E9EA7]">
                    Scanning 24 psycholinguistic features &bull; Spoken delivery tempo (2.75 wps) &bull; MarginGuard calibration
                  </div>
                </div>
              </div>
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#EA4C89]/25 text-[#EA4C89] border border-[#EA4C89]/40 shrink-0">
                AI ACTIVE
              </span>
            </div>
          )}

          {/* Dual Editor Battle Grid (Hook A vs Hook B) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch animate-stagger-2">
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

          {/* Action Trigger Bar: World-Class Electrifying Battle Button */}
          <div className="flex flex-col items-center justify-center gap-3 py-6 relative">
            {/* Ambient Background Glow Orb */}
            <div className="absolute w-72 h-20 bg-gradient-to-r from-[#EA4C89]/40 via-purple-600/30 to-[#EA4C89]/40 rounded-full blur-2xl pointer-events-none -z-10" />

            <button
              type="button"
              onClick={runComparison}
              disabled={isComparing}
              className="relative px-12 py-4 rounded-full text-white font-extrabold text-base sm:text-lg bg-gradient-to-r from-[#EA4C89] via-[#f05a96] to-[#0D0C22] shadow-[0_12px_36px_rgba(234,76,137,0.45)] hover:shadow-[0_18px_50px_rgba(234,76,137,0.7)] battle-glow-btn hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-50 select-none"
            >
              <Swords className={`w-5 h-5 text-white ${isComparing ? 'animate-spin' : 'group-hover:rotate-45 group-hover:scale-125 transition-transform duration-300'}`} />
              <span className="tracking-wide">
                {isComparing ? 'Running Dual-Tower Inference...' : 'Run A/B Hook Battle'}
              </span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </button>
            <div className="flex items-center gap-2 text-xs text-[#6E6D7A] dark:text-zinc-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>24 Psycholinguistic Signals &bull; 384-Dim Transformer Latent Space &bull; &lt;50ms</span>
            </div>
          </div>

          {/* Comparison Arena: Results, Margin Guard & Donut Charts */}
          {comparisonResult && (
            <ComparisonArena
              result={comparisonResult}
              onOpenOutcome={() => setIsOutcomeOpen(true)}
            />
          )}

            {/* Hook Remix & Inspiration Lab */}
            <RemixLab />
              </>
            )}
          </div>
        </main>
      )}

      {/* Slide-out Library / History Drawer */}
      <HistoryDrawer />

      {/* Settings Panel */}
      <SettingsPanel />

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

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
