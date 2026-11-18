import React, { useState, useEffect } from 'react';
import { Flame, History, HelpCircle, RefreshCw, Cpu, Sparkles, ChevronDown, BarChart3, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useHookStore } from '../../store/useHookStore';
import { checkBackendHealth } from '../../services/api';

export function Header({ onOpenAnalytics, onOpenOAuth }) {
  const {
    platform,
    setPlatform,
    niche,
    setNiche,
    battleHistory,
    setHistoryDrawerOpen,
    setOnboardingOpen,
    swapHooks,
  } = useHookStore();

  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    checkBackendHealth().then((res) => {
      setHealthStatus(res);
    });
  }, []);

  const isModelLive = healthStatus?.status === 'healthy';
  const isTrained = healthStatus?.inference_mode === 'trained_model';

  return (
    <header className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all">
      <div className="glass-panel rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4 border border-white/10 shadow-2xl shadow-black/40">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative w-10 h-10 rounded-xl bg-[#0F111D] border border-white/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-violet-400 fill-violet-400/20" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                ViralHook <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent font-black">Studio</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide bg-violet-500/10 text-violet-300 border border-violet-500/20 font-semibold">
                <Sparkles className="w-3 h-3 text-violet-400" />
                v1.0 AI
              </span>
            </div>
          </div>
        </div>

        {/* Center: Platform Segmented Controls + Niche Selector */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Platform Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/[0.06] backdrop-blur-md">
            {[
              { id: 'tiktok', label: 'TikTok', icon: '🎵' },
              { id: 'reels', label: 'Reels', icon: '📸' },
              { id: 'shorts', label: 'Shorts', icon: '⚡' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  platform === p.id
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          {/* Niche Selector */}
          <div className="relative">
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="appearance-none bg-black/40 border border-white/[0.06] text-xs font-medium text-zinc-300 rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-violet-500/50 hover:border-white/20 transition-all cursor-pointer"
            >
              <option value="tech">💻 Tech & AI</option>
              <option value="finance">📈 Finance & Business</option>
              <option value="fitness">🏋️ Fitness & Health</option>
              <option value="education">📚 How-To & Tutorials</option>
              <option value="lifestyle">✨ Lifestyle & Stories</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right Actions & Status */}
        <div className="flex items-center gap-2.5">
          {/* Live Status Pill */}
          {healthStatus && (
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border backdrop-blur-md transition-all ${
                isModelLive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-500/10'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isModelLive ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-medium">{isTrained ? 'Dual-Tower ML' : isModelLive ? 'Gateway Live' : 'Offline'}</span>
            </div>
          )}

          <button
            onClick={swapHooks}
            title="Swap Hook A and Hook B"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06] hover:border-white/20 text-xs font-medium transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Swap</span>
          </button>

          <button
            onClick={() => setOnboardingOpen(true)}
            title="How Scoring Works"
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.06] transition-all"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {onOpenOAuth && (
            <button
              onClick={onOpenOAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all shadow-sm"
              title="Connected Social Channels (TikTok & Instagram OAuth)"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Channels</span>
            </button>
          )}

          {onOpenAnalytics && (
            <button
              onClick={onOpenAnalytics}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all shadow-sm"
              title="Channel Accuracy & Outcome Analytics"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
          )}

          <button
            onClick={() => setHistoryDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 hover:from-violet-600/30 hover:to-indigo-600/30 text-violet-200 border border-violet-500/30 text-xs font-medium transition-all shadow-sm"
          >
            <History className="w-4 h-4 text-violet-400" />
            <span className="font-semibold">Library</span>
            {battleHistory.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-violet-500 text-white text-[10px] font-bold">
                {battleHistory.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
